import { SlashCommand } from '../../../../interfaces/commands';
import { SlashCommandBuilder } from '@discordjs/builders';


const ping: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Send ping request'),
  async execute(interaction) {
    const ms1 = Date.now();
    await interaction.client.application?.fetchAssets();
    const ms2 = Date.now();

    interaction.reply({ content: `Pong (**${ms2 - ms1}ms**)` });
  }
};

export default ping;