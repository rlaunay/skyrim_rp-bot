import { Collection, Message } from 'discord.js';
import Event from '../interfaces/event';

const messageCreate: Event = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    const { prefix, prefixCommands, cooldowns } = message.client;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() || '';

    const command = prefixCommands.get(commandName) || prefixCommands.find((cmd) => !!cmd.aliases?.includes(commandName));

    if (!command) return message.reply('Command not found!');

    if (command.guildOnly && message.channel.type === 'DM') return message.reply('I can\'t execute that command inside DMs!');

    if (command.args && !args.length) {
      message.reply(`You did't provide any arguments, Use ${prefix}help ${command.name} for more informations`);
      return;
    }

    if (command.permissions) {
      if (!message.member?.permissions.has(command.permissions)) {
        return message.reply('You can\'t do this!');
      }
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownsAmount = (command.cooldown || 3) * 1000;

    if (timestamps?.has(message.author.id)) {
      const expirationTime = (timestamps.get(message.author.id) || 0) + cooldownsAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        return;
      }
    }

    timestamps?.set(message.author.id, now);
    setTimeout(() => timestamps?.delete(message.author.id), cooldownsAmount);

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error when trying to execute that command!');
    }

  }
};

export default messageCreate;