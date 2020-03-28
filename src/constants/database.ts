// const user = process.env.MONGO_USER;
// const pass = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_NAME;
const port = process.env.MONGO_PORT;

// export const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${dbName}`;
export const connectionString = `mongodb://${host}:${port}/${dbName}`;

export const banModel = 'Ban';
export const tagModel = 'Tag';
export const userModel = 'User';
export const historyModel = 'History';
export const chatModel = 'Chat';
