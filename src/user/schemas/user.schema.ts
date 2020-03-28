import * as mongoose from 'mongoose';
import { defaultSchemaFields } from '@constants/index';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  userName: [{ first: String, last: String, date: Date }],
  userTgName: [{ name: String, date: Date }],
  chatList: [{ id: String, name: String, date: Date }],
  phone: [{ number: String, date: Date }],
  prevActive: String,
  password: String,
  ...defaultSchemaFields,
});

UserSchema.index({
  'id': 'text',
  'userId': 'text',
  'userName.first': 'text',
  'userName.last': 'text',
  'userTgName.name': 'text',
  'chatList.id': 'text',
  'chatList.name': 'text',
  'phone.number': 'text',
});

UserSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

export { UserSchema };
