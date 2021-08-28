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

    if (!command) return message.reply('Commande inexistante!');

    if (command.guildOnly && message.channel.type === 'DM') return message.reply('Je ne peux pas exécuter cette commande dans les MPs!');

    if (command.args && !args.length) {
      message.reply(`Vous n'avez fourni aucun argument, utilisez ${prefix}help ${command.name} pour plus d'informations`);
      return;
    }

    if (command.permissions) {
      if (!message.member?.permissions.has(command.permissions)) {
        return message.reply('Vous n\'avez pas les permissions!');
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
        message.reply(`**${message.author.username}**, merci de patienter ${timeLeft.toFixed(1)} secondes avant d'utiliser cette commande.`);
        return;
      }
    }

    timestamps?.set(message.author.id, now);
    setTimeout(() => timestamps?.delete(message.author.id), cooldownsAmount);

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('Une erreur est survenue, veuillez réessayer plus tard!');
    }

  }
};

export default messageCreate;