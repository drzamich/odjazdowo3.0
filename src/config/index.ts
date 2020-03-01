import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

export const MONGODB_URI = process.env.MONGODB_URI || '';

export const { TOKEN, MESSENGER_TOKEN, TEST_USER_ID } = process.env;
