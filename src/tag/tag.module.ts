import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { database } from '../constants';
import { TagSchema } from './schemas/tag.schema';
import {TagService} from './tag.service';
import {HistorySchema} from '../history/schemas/history.schema';
import {HistoryService} from '../history/history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: database.modelName.tag,
        schema: TagSchema,
      },
      {
        name: database.modelName.history,
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [TagController],
  providers: [TagService, HistoryService],
})
export class TagModule {}
