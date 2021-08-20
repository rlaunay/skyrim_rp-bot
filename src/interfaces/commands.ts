import { CommandInteraction, ContextMenuInteraction, Message, Permissions } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { APIApplicationCommandOption } from 'discord-api-types';

export interface PrefixCommand {
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

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
}

export interface UserCommand {
  name: string;
  type: 2;
  execute: (interaction: ContextMenuInteraction) => void;
}

export type JsonCmd = {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
}

export enum Type {
  CHANNEL_INPUT = 1,
  USER = 2,
  MESSAGE = 3
}