import {
  Controller,
  Get, Delete, Post,
  Param, Body, Query,
  Inject, Put,
} from '@nestjs/common';
import { CreateHistoryDto } from './dto/history-create.dto';
import { HistoryService } from './history.service';
import { IHistory, IGetAllQuery } from './interfaces/history.interface';
import { HistoryValidator } from './validator';

@Controller('history')
export class HistoryController {
  protected readonly validator;

  constructor(
    private readonly historyService: HistoryService,
  ) {
    this.validator = new HistoryValidator();
  }

  @Get()
  findAll(@Query() query: IGetAllQuery): Promise<{ result: IHistory[], count: number }> {
    const data = this.validator.get(query);
    return this.historyService.findAll(data);
  }

  @Delete(':id')
  remove(@Param() params): Promise<IHistory> {
    const id = this.validator.remove(params);
    return this.historyService.delete(id);
  }

  @Post()
  add(@Body() createTagDto: CreateHistoryDto): Promise<IHistory> {
    const data = this.validator.create(createTagDto);
    return this.historyService.create(data);
  }
}
