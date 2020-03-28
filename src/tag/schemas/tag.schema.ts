import * as mongoose from 'mongoose';
import { defaultSchemaFields } from '@constants/index';

const TagSchema = new mongoose.Schema({
  authorId: String,
  authorName: String,
  authorTgName: String,
  adminId: String,
  adminName: String,
  adminTgName: String,
  chatId: String,
  tagList: [String],
  text: String,
  approve: {
    type: Boolean,
    default: false,
  },
  ...defaultSchemaFields,
});

TagSchema.index({
  authorId: 'text',
  authorName: 'text',
  authorTgName: 'text',
  adminId: 'text',
  adminName: 'text',
  adminTgName: 'text',
  chatId: 'text',
  text: 'text',
  tagList: 'text',
});

TagSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

export { TagSchema };
