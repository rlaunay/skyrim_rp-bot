import 'discord.js';
import { Collection } from 'discord.js';
import { PrefixCommand, SlashCommand, UserCommand } from './../src/interfaces/commands';

declare module 'discord.js' {
  interface Client {
    prefixCommands: Collection<string, PrefixCommand>;
    slashCommands: Collection<string, SlashCommand>;
    userCommands: Collection<string, UserCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    prefix: string;
  }
}