import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import { SlashCommand } from '../../../../interfaces/commands';
import { isAdminOrModo } from '../../../../utils/permissions';
import { interactionSelectChar } from '../../../../response/interactions/character';
import { addMoneyToCharacter, removeMoneyToCharacter } from '../../../../firebase/users';
import interactionConfimation from '../../../../response/interactions/confirmation';
import { septims } from '../../../../config/env';

const econnmy: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('argent')
    .setDescription('Gestion de l\'argent des personnages')
    .addSubcommand(subCommand => 
      subCommand
        .setName('add')
        .setDescription('Ajoute de l\'argent à un personnage')
        .addIntegerOption(option => 
          option
            .setName('montant')
            .setDescription('Montant à ajouter')
            .setRequired(true)
        )
        .addUserOption(option => 
          option
            .setName('user')
            .setDescription('Joueur ciblé')
        )
    )
    .addSubcommand(subCommand => 
      subCommand
        .setName('remove')
        .setDescription('Retire de l\'argent à un personnage')
        .addIntegerOption(option => 
          option
            .setName('montant')
            .setDescription('Montant à retirer')
            .setRequired(true)
        )
        .addUserOption(option => 
          option
            .setName('user')
            .setDescription('Joueur ciblé')
        )
    )
    .addSubcommand(subCommand => 
      subCommand
        .setName('give')
        .setDescription('Donne de l\'argent à un autre personnage')
        .addIntegerOption(option => 
          option
            .setName('montant')
            .setDescription('Montant à donner')
            .setRequired(true)
        )
        .addUserOption(option => 
          option
            .setName('user')
            .setDescription('Joueur ciblé')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (['add', 'remove'].includes(interaction.options.getSubcommand()) && !isAdminOrModo(interaction.member as GuildMember)) {
      return interaction.reply('Vous n\'avez pas les droits pour cette commande.');
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const money = interaction.options.getInteger('montant', true);
    if (money < 0) return interaction.reply('Le montant doit être supérieur à 0');

    if (interaction.options.getSubcommand() === 'add') {
      const char = await interactionSelectChar(interaction, user, 'À quel(s) personnage(s) voulez-vous ajouter de l\'argent.');
      if (!char) return;
      
      await addMoneyToCharacter(user.id, char, money);
      return interaction.editReply({
        content: `Vous avez bien ajouté ${money}<:septims:${septims}> à \`${char.name}\`.`,
        components: []
      });
    }

    if (interaction.options.getSubcommand() === 'remove') {    
      const char = await interactionSelectChar(interaction, user, 'À quel(s) personnage(s) voulez-vous retirer de l\'argent.');
      if (!char) return;
       
      const res = await removeMoneyToCharacter(user.id, char, money);
      if (res) {
        return interaction.editReply({
          content: `Vous avez bien retiré ${money}<:septims:${septims}> à \`${char.name}\`.`,
          components: []
        });
      }
      return interaction.editReply({
        content: `Vous ne pouvez pas retirer ${money}<:septims:${septims}> à \`${char.name}\` car il ne dispose pas ce de montant.`,
        components: []
      });
    }

    if (interaction.options.getSubcommand() === 'give') {
      const giver = interaction.user;
      const receiver = interaction.options.getUser('user', true);

      const giverChar = await interactionSelectChar(
        interaction, 
        giver,
        'Sélectionner le personnage qui va donner de l\'argent\nPersonnage(s) de '
      );
      if (!giverChar) return;

      const receiverChar = await interactionSelectChar(
        interaction, 
        receiver,
        'Sélectionner le personnage qui va recevoir de l\'argent\nPersonnage(s) de '
      );
      if (!receiverChar) return;
  
      const choice = await interactionConfimation(
        interaction, 
        `Voulez vous vraiment donner avec \`${giverChar.name}\` ${money}<:septims:${septims}> à \`${receiverChar.name}\` ?`
      );

      if (choice) {
        const rmMoney = await removeMoneyToCharacter(giver.id, giverChar, money);
  
        if (!rmMoney) {
          return interaction.editReply({
            content: `Vous ne disposez pas de ${money} <:septims:${septims}> ! Transaction impossible.`,
            components: []
          });
        }
  
        await addMoneyToCharacter(receiver.id, receiverChar, money);
        interaction.editReply({
          content: `Vous avez bien donné avec \`${giverChar.name}\` ${money}<:septims:${septims}> à \`${receiverChar.name}\`.`,
          components: []
        });
      }
      return;
    }
  }
};

export default econnmy;