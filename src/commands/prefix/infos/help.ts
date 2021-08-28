import { MessageEmbed } from 'discord.js';
import { PrefixCommand } from '../../../interfaces/commands';

const help: PrefixCommand = {
  name: 'help',
  description: 'Liste toutes mes commandes ou informations sur une seul commande',
  aliases: ['aled'],
  usages: ['<command name>'],
  cooldown: 5,
  execute(message, args) {
    const reply = new MessageEmbed().setColor('#2ecc71');
    const { prefixCommands, prefix } = message.client;

    if (!args.length) {
      const commandsName = prefixCommands.map((command) => command.name).join(', ');
      reply
        .setTitle('Voici une liste de toutes mes commandes')
        .setDescription(`Vous pouvez envoyer \`${prefix}help <command name>\` pour obtenir des informations sur une commande spécifique`)
        .addFields({ name: 'Commandes: ', value: commandsName, inline: true });
      
      return message.reply({ embeds: [reply] });
    }

    const name = args[0].toLowerCase();
    const command = prefixCommands.get(name) || prefixCommands.find((cmd) => !!cmd.aliases?.includes(name));
    if (!command) return message.reply('Commande inexistante!');

    reply.setTitle(`Aide pour la commande ${command.name}`);

    let description = '';

    if (command.aliases) description += `**Alias: ** ${command.aliases.join(', ')}\n`;
    if (command.description) description += `**Description: ** ${command.description}\n`;
    if (command.usages) {
      description += '**Usage(s): **\n';
      command.usages.forEach((u) => {
        description += `\u200B \u200B \u200B \u200B - ${prefix}${command.name} ${u}\n`;
      });
    }

    description += `**Cooldown: ** ${command.cooldown || 3} seconde(s)`;
    reply.setDescription(description);

    message.reply({ embeds: [reply] });
  }
};

export default help;