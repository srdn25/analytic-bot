import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {database} from './constants';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {ErrorsInterceptor} from './interceptor/error.interceptor';

import {BanModule} from './ban/ban.module';
import {TagModule} from './tag/tag.module';
import {UserModule} from './user/user.module';
import {HistoryModule} from './history/history.module';
import {AuthMiddleware} from './middleware/auth.middleware';
import {UserService} from './user/user.service';
import {UserSchema} from './user/schemas/user.schema';
import {ChatModule} from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot(database.connectionString),
    MongooseModule.forFeature([
      {
        name: database.modelName.user,
        schema: UserSchema,
      },
    ]),
    BanModule,
    TagModule,
    UserModule,
    HistoryModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    UserService,
  ],
  exports: [
    'UserService',
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/user/:id', method: RequestMethod.DELETE }, // MODER+
        { path: '/tag/approve/:id', method: RequestMethod.PUT }, // MODER+
        { path: '/tag/:id', method: RequestMethod.DELETE }, // MODER+
        { path: '/ban/vote/:id/:vote', method: RequestMethod.PUT }, // TODO: only once from user
        { path: '/ban/:id/', method: RequestMethod.DELETE }, // MODER+
        { path: '/chat/:id/', method: RequestMethod.DELETE }, // MODER+
      );
  }
}
