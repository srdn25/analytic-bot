import {
  Controller,
  Get, Delete, Post,
  Param, Body, Query,
  Inject, Put, Headers,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import {IUser, IGetAllQuery, ICreatePassword, IToken} from './interfaces/user.interface';
import { UserValidator } from './validator';
import {UpdateUserDto} from './dto/user-update.dto';
import {LoginUserDto} from './dto/user-login.dto';
import {CheckTokenUserDto} from './dto/user-checkToken.dto';
import {HistoryService} from '../history/history.service';
import {database} from '@constants/index';
import {CreateHistoryDto} from '../history/dto/history-create.dto';

@Controller('user')
export class UserController {
  protected readonly validator;

  constructor(
    private readonly userService: UserService,
    private readonly loggerService: HistoryService,
  ) {
    this.validator = new UserValidator();
  }

  @Get()
  findAll(@Query() query: IGetAllQuery): Promise<{ result: IUser[], count: number }> {
    const data = this.validator.get(query);
    return this.userService.findAll(data);
  }

  @Get('/tg-id/:id')
  findByTgId(@Param('id') id): Promise<IUser> {
    const data = this.validator.remove({ id });
    return this.userService.getByTgId(data);
  }

  // safe because id get from message of sender ALSO check bot token
  @Get(':userId/create-password')
  createPassword(@Param('userId') userId, @Headers() headers): Promise<ICreatePassword | string> {
    this.validator.checkBotToken(headers);
    const data = this.validator.checkId({ id: userId });
    const result = this.userService.createPassword({ userId: data });

    const dataLog = {
      event: 'createPassword',
      service: database.modelName.user,
      userId,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Get('check-token')
  checkToken(@Headers() headers): Promise<CheckTokenUserDto> {
    const data = this.validator.checkToken(headers);
    return this.userService.checkToken(data);
  }

  @Delete(':id')
  async remove(@Param() params): Promise<IUser> {
    const data = this.validator.remove(params);
    const result = await this.userService.delete(data.id);

    const {userId, id, adminId, adminTgName, adminName} = data;
    const dataLog = {
      event: 'delete',
      service: database.modelName.user,
      userId,
      id,
      adminId,
      adminTgName,
      adminName,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Post()
  async add(@Body() createUserDto: CreateUserDto, @Headers() headers): Promise<IUser|string> {
    this.validator.checkBotToken(headers);
    const data = this.validator.create(createUserDto);
    const result = await this.userService.create(data);

    const {userId} = data;
    const dataLog: CreateHistoryDto = {
      event: 'add',
      service: database.modelName.user,
      userId,
    };

    if (typeof result === 'object' && result.hasOwnProperty('_id')) {
      dataLog.id = result._id;
    } else {
      dataLog.info = 'result is not an object or has not _id';
    }
    this.loggerService.create(dataLog);

    return result;
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<IToken|string> {
    const data = this.validator.login(loginUserDto);
    const result = this.userService.login(data);

    this.loggerService.create({
      event: 'login',
      service: database.modelName.user,
      userId: data.userId,
    });
    return result;
  }

  @Put(':id')
  update(@Param('id') id, @Body() updateUserDto: UpdateUserDto, @Headers() headers): Promise<IUser|string> {
    this.validator.checkBotToken(headers);
    const data = this.validator.update(updateUserDto);
    const result = this.userService.update({ id, data, exist: false });

    const {userId} = data;
    this.loggerService.create({
      event: 'update',
      service: database.modelName.user,
      userId,
      id,
    });
    return result;
  }
}
