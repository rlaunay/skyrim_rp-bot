import 'discord.js';
import { Collection } from 'discord.js';
import { PrefixCommand, SlashCommand } from './../src/interfaces/commands';

declare module 'discord.js' {
  interface Client {
    prefixCommands: Collection<string, PrefixCommand>;
    slashCommands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    prefix: string;
  }
}