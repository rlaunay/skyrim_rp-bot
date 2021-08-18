import { GuildMember, Permissions } from 'discord.js';

export const isAdminOrModo = (member: GuildMember): boolean => {
  return member.roles.cache.some((r) => r.name === 'Modérateur') || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
};