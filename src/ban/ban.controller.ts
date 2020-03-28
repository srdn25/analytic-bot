import {
  Controller,
  Get, Delete, Post,
  Param, Body, Query,
  Put, Req, Headers, HttpStatus,
} from '@nestjs/common';
import { CreateBanDto } from './dto/ban-create.dto';
import { BanService } from './ban.service';
import { Ban, GetAllQuery } from './interfaces/ban.interface';
import { BanValidator } from './validator';
import {HistoryService} from '../history/history.service';
import {database, errorList} from '@constants/index';
import {CustomError} from '@components/CustomError';

@Controller('ban')
export class BanController {
  protected readonly validator;

  constructor(
    private readonly banService: BanService,
    private readonly loggerService: HistoryService,
  ) {
    this.validator = new BanValidator();
  }

  @Get()
  findAll(@Query() query: GetAllQuery): Promise<{ result: Ban[], count: number }> {
    const data = this.validator.get(query);
    return this.banService.findAll(data);
  }

  @Put('vote/:id/:vote')
  async vote(@Param() params, @Req() req): Promise<Ban> {
    const data = this.validator.vote(params);

    const voteLog = await this.loggerService.findBanVoteByUserAndBan(req.user.userId, data.id);

    if (voteLog) {

      const { code, info: message } = errorList.BAN.VOTE_EXIST;

      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        code,
        message,
      });
    }

    const result = this.banService.vote(data);

    const dataLog = {
      event: 'vote',
      service: database.modelName.ban,
      userId: req.user.userId || 'userId not found in req',
      id: data.id,
      info: data.vote,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Delete(':id')
  remove(@Param() params, @Req() req): Promise<Ban> {
    const id = this.validator.remove(params);
    const result = this.banService.delete(id);

    const dataLog = {
      event: 'delete',
      service: database.modelName.ban,
      userId: req.user.userId || 'userId not found in req',
      id,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Post()
  async add(@Body() createBanDto: CreateBanDto, @Headers() headers): Promise<Ban> {
    this.validator.checkBotToken(headers);
    const data = this.validator.create(createBanDto);
    const result = await this.banService.create(data);

    const {userId, adminId} = data;
    const dataLog = {
      event: 'delete',
      service: database.modelName.ban,
      id: result._id,
      userId,
      adminId,
    };

    this.loggerService.create(dataLog);

    return result;
  }
}
