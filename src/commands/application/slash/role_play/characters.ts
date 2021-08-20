import { SlashCommand } from '../../../../interfaces/commands';
import { SlashCommandBuilder } from '@discordjs/builders';


const characters: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('perso')
    .setDescription('List les personnages')
    .addSubcommand(subCommand => 
      subCommand
        .setName('info')
        .setDescription('Informations sur un personnage')
        .addUserOption(option => option.setName('user').setDescription('Joueur cible'))
    )
    .addSubcommand(subCommand => 
      subCommand
        .setName('new')
        .setDescription('Ajoute un nouveau perso')
        .addUserOption(option => option.setName('user').setDescription('Joueur cible').setRequired(true))
        .addStringOption(option => option.setName('nom').setDescription('Nom du personnage').setRequired(true))
    )
    .addSubcommand(subCommand => 
      subCommand
        .setName('del')
        .setDescription('Supprime un personnage')
        .addUserOption(option => option.setName('user').setDescription('Joueur cible'))
    )
    .addSubcommand(subCommand => 
      subCommand
        .setName('status')
        .setDescription('Change le status d\'un personnage')
        .addUserOption(option => option.setName('user').setDescription('Joueur cible'))
    ),
  async execute(interaction) {

    if (interaction.options.getSubcommand() === 'info') {
      return interaction.reply({ content: 'Infor perso' });
    }

    if (interaction.options.getSubcommand() === 'new') {
      return interaction.reply({ content: 'Nouveau perso' });
    }

    if (interaction.options.getSubcommand() === 'del') {
      return interaction.reply({ content: 'Suprression de perso' });
    }

    if (interaction.options.getSubcommand() === 'status') {
      return interaction.reply({ content: 'Changement dde status' });
    }
  }
};

export default characters;