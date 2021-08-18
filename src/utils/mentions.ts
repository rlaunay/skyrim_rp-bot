import { Client, User } from 'discord.js';

export const getUserFromMention = (mention: string, client: Client): User | undefined => {
  if (!mention) return;
  const matches = mention.match(/^<@!?(\d+)>$/);

  if (!matches) return;
  const id = matches[1];

  return client.users.cache.get(id);
};