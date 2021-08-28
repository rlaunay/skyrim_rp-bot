import fs from 'fs';
import path from 'path';
import { Client, Collection, Intents } from 'discord.js';
import Event from '../interfaces/event';
import { PrefixCommand, SlashCommand, UserCommand } from '../interfaces/commands';
import registers from './registers';

export default class Bot extends Client {
  cooldowns = new Collection<string, Collection<string, number>>()
  prefixCommands = new Collection<string, PrefixCommand>()
  slashCommands = new Collection<string, SlashCommand>()
  userCommands = new Collection<string, UserCommand>()

  constructor(readonly prefix: string) {
    super({
      presence: {
        status: 'online',
        activities: [
          { name: `${prefix}help`, type: 'PLAYING' }
        ]
      },
      partials: [
        'CHANNEL'
      ],
      intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
      ] 
    });
  }

  eventHandler = async (): Promise<void> => {
    const eventsFiles = fs
      .readdirSync(path.join(__dirname, '..', 'events'))
      .filter(file => file.endsWith('.js'));

    await Promise.all(eventsFiles.map(async file => {
      const event: Event = (await import(`./../events/${file}`)).default;
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    }));
  }

  prefixCommandsHandler = async (): Promise<void> => {
    const commandsFolders = fs
      .readdirSync(path.join(__dirname, '..', 'commands', 'prefix'));

    await Promise.all(commandsFolders.map(async folder => {
      const commandsFiles = fs
        .readdirSync(path.join(__dirname, '..', 'commands', 'prefix', folder))
        .filter(file => file.endsWith('.js'));
      
      await Promise.all(commandsFiles.map(async file => {
        const res = await import(`./../commands/prefix/${folder}/${file}`);
        const command: PrefixCommand = res.default;

        this.prefixCommands.set(command.name, command);
      }));
    }));
  }

  slashCommandsHandler = async (): Promise<void> => {
    const commandsFolders = fs
      .readdirSync(path.join(__dirname, '..', 'commands', 'application', 'slash'));
    
    await Promise.all(commandsFolders.map(async folder => {
      const commandsFiles = fs
        .readdirSync(path.join(__dirname, '..', 'commands', 'application', 'slash', folder))
        .filter(file => file.endsWith('.js'));
      
      await Promise.all(commandsFiles.map(async file => {
        const res = await import(`./../commands/application/slash/${folder}/${file}`);
        const command: SlashCommand = res.default;

        this.slashCommands.set(command.data.name, command);
      }));
    }));
  }

  userCommandsHandler = async (): Promise<void> => {
    const commandsFiles = fs
      .readdirSync(path.join(__dirname, '..', 'commands', 'application', 'user'))
      .filter(file => file.endsWith('.js'));
      
    await Promise.all(commandsFiles.map(async file => {
      const res = await import(`./../commands/application/user/${file}`);
      const command: UserCommand = res.default;

      this.userCommands.set(command.name, command);
    }));
  }

  run = async (token: string): Promise<void> => {
    await this.eventHandler();
    await this.prefixCommandsHandler();
    await this.slashCommandsHandler();
    await this.userCommandsHandler();
    await registers();
    await this.login(token);
  }
}