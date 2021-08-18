import dotenv from 'dotenv-safe';
dotenv.config();

export const token = process.env.TOKEN || '';
export const prefix = process.env.PREFIX || '';
export const channelId = process.env.CALENDAR || '';
