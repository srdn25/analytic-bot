import {banModel, tagModel, connectionString, userModel, historyModel, chatModel} from './database';
import errorListData from './errorList';
import schemaFields from './defaultSchemaFields';
import {schemaGet} from './validatorSchema';

export const database = {
  connectionString,
  modelName: {
    ban: banModel,
    tag: tagModel,
    user: userModel,
    history: historyModel,
    chat: chatModel,
  },
};

export const errorList = errorListData;

export const defaultSchemaFields = schemaFields;

export const validatorSchema = {
  getList: schemaGet,
};
