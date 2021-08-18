import fs from 'fs';
import path from 'path';
import { Client, Collection, Intents } from 'discord.js';
import Event from '../interfaces/event';
import { Command } from '../interfaces/commands';

export default class Bot extends Client {
  cooldowns = new Collection<string, Collection<string, number>>()
  commands = new Collection<string, Command>()

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

  commandsHandler = async (): Promise<void> => {
    const commandsFolders = fs
      .readdirSync(path.join(__dirname, '..', 'commands'));

    await Promise.all(commandsFolders.map(async folder => {
      const commandsFiles = fs
        .readdirSync(path.join(__dirname, '..', 'commands', folder))
        .filter(file => file.endsWith('.js'));
      
      await Promise.all(commandsFiles.map(async file => {
        const res = await import(`./../commands/${folder}/${file}`);
        const command: Command = res.default;

        this.commands.set(command.name, command);
      }));
    }));
  }

  run = async (token: string): Promise<void> => {
    await this.eventHandler();
    await this.commandsHandler();
    await this.login(token);
  }
}