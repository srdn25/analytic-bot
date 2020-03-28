import * as mongoose from 'mongoose';
import { defaultSchemaFields } from '@constants/index';

const BanSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userTgName: String,
  adminId: String,
  adminName: String,
  adminTgName: String,
  chatId: String,
  reason: String,
  duration: String,
  restrictedMsg: String,
  active: {
    type: Boolean,
    default: true,
  },
  rate: {
    type: Number,
    default: 0,
  },
  ...defaultSchemaFields,
});

BanSchema.index({
  userId: 'text',
  userName: 'text',
  userTgName: 'text',
  adminId: 'text',
  adminName: 'text',
  adminTgName: 'text',
  chatId: 'text',
  reason: 'text',
  duration: 'text',
  restrictedMsg: 'text',
});

BanSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

export { BanSchema };
