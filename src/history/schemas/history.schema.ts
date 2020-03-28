import * as mongoose from 'mongoose';
import { defaultSchemaFields } from '@constants/index';

const HistorySchema = new mongoose.Schema({
  service: String,
  id: String, // id in service
  event: String,
  info: String,
  userId: String,
  userName: String,
  userTgName: String,
  adminId: String,
  adminName: String,
  adminTgName: String,
  ...defaultSchemaFields,
});

HistorySchema.index({
  userId: 'text',
  userName: 'text',
  info: 'text',
  userTgName: 'text',
  adminId: 'text',
  adminName: 'text',
  adminTgName: 'text',
  id: 'text',
  service: 'text',
  event: 'text',
});

HistorySchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

export { HistorySchema };
