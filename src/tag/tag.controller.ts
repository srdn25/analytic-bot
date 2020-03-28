import {
  Controller,
  Get, Delete, Post,
  Param, Body, Query,
  Inject, Put, Headers,
} from '@nestjs/common';
import { CreateTagDto } from './dto/tag-create.dto';
import { TagService } from './tag.service';
import { ITag, IGetAllQuery } from './interfaces/tag.interface';
import { TagValidator } from './validator';
import {HistoryService} from '../history/history.service';
import {database} from '@constants/index';

@Controller('tag')
export class TagController {
  protected readonly validator;

  constructor(
    private readonly tagService: TagService,
    private readonly loggerService: HistoryService,
  ) {
    this.validator = new TagValidator();
  }

  @Get()
  findAll(@Query() query: IGetAllQuery): Promise<{ result: ITag[], count: number }> {
    const data = this.validator.get(query);
    return this.tagService.findAll(data);
  }

  @Put('approve/:id')
  approve(@Param() params): Promise<ITag> {
    const data = this.validator.approve(params);
    const result = this.tagService.approve(data);

    const dataLog = {
      event: 'approve',
      service: database.modelName.tag,
      ...data,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Delete(':id')
  remove(@Param() params): Promise<ITag> {
    const data = this.validator.remove(params);
    const result = this.tagService.delete(data.id);

    const dataLog = {
      event: 'delete',
      service: database.modelName.tag,
      ...data,
    };

    this.loggerService.create(dataLog);

    return result;
  }

  @Post()
  add(@Body() createTagDto: CreateTagDto, @Headers() headers): Promise<ITag> {
    this.validator.checkBotToken(headers);
    const data = this.validator.create(createTagDto);
    const result = this.tagService.create(data);

    const dataLog = {
      event: 'add',
      service: database.modelName.tag,
      ...data,
    };

    this.loggerService.create(dataLog);

    return result;
  }
}
