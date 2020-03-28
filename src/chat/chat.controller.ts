import {
  Controller,
  Get, Delete, Post,
  Param, Body, Query,
  Inject, Put, Headers,
} from '@nestjs/common';
import { CreateChatDto } from './dto/chat-create.dto';
import { ChatService } from './chat.service';
import { IChat, IGetAllQuery } from './interfaces/chat.interface';
import { ChatValidator } from './validator';
import {HistoryService} from '../history/history.service';
import {database} from '@constants/index';
import {UpdateChatDto} from './dto/chat-update.dto';
import helper from '@components/helper';

@Controller('chat')
export class ChatController {
  protected readonly validator;

  constructor(
    private readonly chatService: ChatService,
    private readonly loggerService: HistoryService,
  ) {
    this.validator = new ChatValidator();
  }

  @Get()
  findAll(@Query() query: IGetAllQuery): Promise<{ result: IChat[], count: number }> {
    const data = this.validator.get(query);
    return this.chatService.findAll(data);
  }

  @Delete(':id')
  remove(@Param() params, @Headers() headers): Promise<IChat> {
    const tokenDecoded = helper.decode(headers['x-access-token']);
    const data = this.validator.remove(params);
    const result = this.chatService.delete(data.id);

    const dataLog = {
      event: 'delete',
      service: database.modelName.chat,
      adminId: tokenDecoded.userId,
      info: {...data},
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Post()
  async add(@Body() createChatDto: CreateChatDto, @Headers() headers): Promise<IChat|string> {
    this.validator.checkBotToken(headers);
    const data = this.validator.create(createChatDto);
    const result = await this.chatService.create(data);

    const dataLog = {
      event: 'add',
      service: database.modelName.chat,
      info: {...data},
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Put(':chatId')
  async update(@Param('chatId') chatId, @Body() updateChatDto: UpdateChatDto, @Headers() headers): Promise<IChat|string> {
    this.validator.checkBotToken(headers);
    const data = this.validator.update(updateChatDto);
    const result = await this.chatService.update({ chatId, data, exist: false });

    const {userId} = data;
    const dataLog: any = {
      event: 'update',
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
}
