import { Module } from '@nestjs/common';
import { BanController } from './ban.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { database } from '../constants';
import { BanSchema } from './schemas/ban.schema';
import {BanService} from './ban.service';
import {HistorySchema} from '../history/schemas/history.schema';
import {HistoryService} from '../history/history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: database.modelName.ban,
        schema: BanSchema,
      },
      {
        name: database.modelName.history,
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [BanController],
  providers: [BanService, HistoryService],
})
export class BanModule {}
