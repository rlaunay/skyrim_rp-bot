import { MessageEmbed } from 'discord.js';
import { PrefixCommand } from '../../../interfaces/commands';

const ping: PrefixCommand = {
  name: 'ping',
  description: 'Envoie un ping',
  async execute (message) {
    const reply = await message.reply('Pinging...');
    const botPing = reply.createdTimestamp - message.createdTimestamp;
    const apiPing = Math.round(message.client.ws.ping);

    const embed = new MessageEmbed()
      .setTitle('🏓 **Pong!**')
      .setDescription(`**BOT:** \`${botPing}ms\`\n**API:** \`${apiPing}ms\``);

    await reply.edit({ content: null, embeds: [embed] });
  }
};

export default ping;