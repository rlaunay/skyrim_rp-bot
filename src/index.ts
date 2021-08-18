import Bot from './bot/client';
import { token, prefix } from './config/env';

const client = new Bot(prefix);

client.run(token);
