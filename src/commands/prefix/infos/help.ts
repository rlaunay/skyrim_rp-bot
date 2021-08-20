import { MessageEmbed } from 'discord.js';
import { PrefixCommand } from '../../../interfaces/commands';

const help: PrefixCommand = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['aled'],
  usages: ['[command name]'],
  cooldown: 5,
  execute(message, args) {
    const reply = new MessageEmbed().setColor('#2ecc71');
    const { prefixCommands, prefix } = message.client;

    if (!args.length) {
      const commandsName = prefixCommands.map((command) => command.name).join(', ');
      reply
        .setTitle('Here\'s a list of all my commands')
        .setDescription(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command`)
        .addFields({ name: 'Commands: ', value: commandsName, inline: true });
      
      return message.reply({ embeds: [reply] });
    }

    const name = args[0].toLowerCase();
    const command = prefixCommands.get(name) || prefixCommands.find((cmd) => !!cmd.aliases?.includes(name));
    if (!command) return message.reply('Command not found!');

    reply.setTitle(`Help for the ${command.name} command`);

    let description = '';

    if (command.aliases) description += `**Aliases: ** ${command.aliases.join(', ')}\n`;
    if (command.description) description += `**Description: ** ${command.description}\n`;
    if (command.usages) {
      description += '**Usage: **\n';
      command.usages.forEach((u) => {
        description += `\u200B \u200B \u200B \u200B - ${prefix}${command.name} ${u}\n`;
      });
    }

    description += `**Cooldown: ** ${command.cooldown || 3} second(s)`;
    reply.setDescription(description);

    message.reply({ embeds: [reply] });
  }
};

export default help;