import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token, clientId, guildId } from './../config/env';
import fs from 'fs';
import path from 'path';
import { SlashCommand, JsonCmd } from '../interfaces/commands';

const rest = new REST({ version: '9' }).setToken(token);

export default async function registers (): Promise<void> {
  const commands: JsonCmd[] = [];

  const commandsFolders = fs
    .readdirSync(path.join(__dirname, '..', 'commands', 'application', 'slash'));

  await Promise.all(commandsFolders.map(async (folder) => {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, '..', 'commands', 'application', 'slash', folder))
      .filter(file => file.endsWith('.js'));
    
    await Promise.all(commandFiles.map(async (file) => {
      const command: SlashCommand = (await import(`./../commands/application/slash/${folder}/${file}`)).default;

      commands.push(command.data.toJSON());
    }));
  }));


  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
