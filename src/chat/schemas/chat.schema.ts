import * as mongoose from 'mongoose';
import { defaultSchemaFields } from '@constants/index';

const ChatSchema = new mongoose.Schema({
  chatId: String,
  chatNameList: [{ tgLink: String, name: String, date: Date }],
  adminList: [{ userId: { type: String, unique: true }, date: Date }],
  ...defaultSchemaFields,
});

ChatSchema.index({
  'chatId': 'text',
  'chatNameList.tgLink': 'text',
  'chatNameList.name': 'text',
  'adminList.userId': 'text',
});

ChatSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

export { ChatSchema };
