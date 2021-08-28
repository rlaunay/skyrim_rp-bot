import { SlashCommand } from '../../../../interfaces/commands';
import { SlashCommandBuilder } from '@discordjs/builders';


const ping: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Envoie un ping'),
  async execute(interaction) {
    const apiPing = Math.round(interaction.client.ws.ping);

    await interaction.reply({ content: `🏓 Pong (**${apiPing}ms**)` });
  }
};

export default ping;