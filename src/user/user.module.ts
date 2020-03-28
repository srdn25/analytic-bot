import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { database } from '../constants';
import { UserSchema } from './schemas/user.schema';
import {UserService} from './user.service';
import {HistoryService} from '../history/history.service';
import {HistorySchema} from '../history/schemas/history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: database.modelName.user,
        schema: UserSchema,
      },
      {
        name: database.modelName.history,
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, HistoryService],
})
export class UserModule {}
