import { Message, Permissions } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  usages?: string[];
  cooldown?: number;
  guildOnly?: boolean;
  args?: boolean;
  permissions?: Permissions;

  execute: (message: Message, args: string[]) => void;
}