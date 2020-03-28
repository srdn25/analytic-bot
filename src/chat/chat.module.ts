import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { database } from '../constants';
import { ChatSchema } from './schemas/chat.schema';
import {ChatService} from './chat.service';
import {HistorySchema} from '../history/schemas/history.schema';
import {HistoryService} from '../history/history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: database.modelName.chat,
        schema: ChatSchema,
      },
      {
        name: database.modelName.history,
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, HistoryService],
})
export class ChatModule {}
