import dotenv from 'dotenv-safe';
dotenv.config();

export const token = process.env.TOKEN || '';
export const prefix = process.env.PREFIX || '';
export const channelId = process.env.CALENDAR || '';
export const clientId = process.env.CLIENT_ID || '';
export const guildId = process.env.GUILD_ID || '';
export const projectId = process.env.PROJECT_ID || '';
export const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
export const clientEmail = process.env.CLIENT_EMAIL || '';
export const septims = process.env.SEPTIMS || '';
