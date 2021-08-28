import { SlashCommand } from '../../../../interfaces/commands';
import { SlashCommandBuilder } from '@discordjs/builders';
import { interactionSelectChar, interactionDisplayChar } from '../../../../response/interactions/character';
import { createCharacter, delCharacter, updateCharStatus } from '../../../../firebase/users';
import { isAdminOrModo } from '../../../../utils/permissions';
import { GuildMember } from 'discord.js';
import interactionConfimation from '../../../../response/interactions/confirmation';


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
    if (['new', 'del', 'status'].includes(interaction.options.getSubcommand()) && !isAdminOrModo(interaction.member as GuildMember)) {
      return interaction.reply('Vous n\'avez pas les droits pour cette command');
    }

    const user = interaction.options.getUser('user') || interaction.user;


    if (interaction.options.getSubcommand() === 'info') {
      const char = await interactionSelectChar(interaction, user);
      if (!char) return;

      return await interactionDisplayChar(interaction, user, char);
    }

    if (interaction.options.getSubcommand() === 'new') {
      const charName = interaction.options.getString('nom', true);

      const res = await createCharacter(user.id, user.tag, charName);
      if (!res) return interaction.reply(`${user.tag} possède déjà 9 personnages ! Impossible d'en ajouter un nouveau.`);

      return interaction.reply(`Vous avez bien créé le personnage \`${charName}\` pour ${user.tag}.`);
    }

    if (interaction.options.getSubcommand() === 'del') {
      const char = await interactionSelectChar(interaction, user);
      if (!char) return;

      const choice = await interactionConfimation(interaction, `Voulez vous vraiment supprimer le personnage \`${char.name}\` pour ${user.tag}`);
          
      if (choice) {
        await delCharacter(user.id, char);
        interaction.editReply({ 
          content: `Vous avez bien supprimé le personnage \`${char.name}\` pour ${user.tag}.`,
          components: []
        });
      }
      return;
    }

    if (interaction.options.getSubcommand() === 'status') {
      const char = await interactionSelectChar(interaction, user);
      if (!char) return;

      await updateCharStatus(user.id, char);
      return interaction.editReply({ 
        content: `Vous avez bien changer le statut du personnage \`${char.name}\` pour ${user.tag}.`,
        components: []
      });
    }
  }
};

export default characters;