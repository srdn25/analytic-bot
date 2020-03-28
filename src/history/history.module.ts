import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { database } from '../constants';
import { HistorySchema } from './schemas/history.schema';
import {HistoryService} from './history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: database.modelName.history,
        schema: HistorySchema,
      },
    ]),
  ],
  // controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
