import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
import { SlashCommand } from '../../../../interfaces/commands';
import { isAdminOrModo } from '../../../../utils/permissions';
import { charInteractionSelect } from '../../../../interactions/characterSelector';
import { addMoneyToCharacter, removeMoneyToCharacter } from '../../../../firebase/users';
import confirmationInteract from '../../../../interactions/confirmation';

const econnmy: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('money')
    .setDescription('Gestion de l\'argent des perso')
    .addSubcommand(subCommand => 
      subCommand
        .setName('add')
        .setDescription('Ajoute de l\'argent à un perso')
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
        .setDescription('Retire de l\'argent à un perso')
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
        .setDescription('Donne de l\'argent à un autre perso')
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
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (['add', 'remove'].includes(interaction.options.getSubcommand()) && !isAdminOrModo(interaction.member as GuildMember)) {
      return interaction.reply('Vous n\'avez pas les droits pour cette command');
    }

    const user = interaction.options.getUser('user') || interaction.user;
    const money = interaction.options.getInteger('montant', true);
    if (money < 0) return interaction.reply('Le montant doit être supérieur à 0');

    try {
      if (interaction.options.getSubcommand() === 'add') {
        const char = await charInteractionSelect(interaction, user);
        if (!char) return;

        await addMoneyToCharacter(user.id, char, money);
        return interaction.editReply({
          content: `Vous avez bien ajouté ${money} :septims: à \`${char.name}\`.`,
          components: []
        });
      }

      if (interaction.options.getSubcommand() === 'remove') {
        const char = await charInteractionSelect(interaction, user);
        if (!char) return;
        
        const res = await removeMoneyToCharacter(user.id, char, money);
        if (res) {
          return interaction.editReply({
            content: `Vous avez bien retiré ${money} :septims: à \`${char.name}\`.`,
            components: []
          });
        }
        return interaction.editReply({
          content: `Vous ne pouvez pas retirer ${money} :septims: à \`${char.name}\` car il ne dispose pas ce de montant.`,
          components: []
        });
      }

      if (interaction.options.getSubcommand() === 'give') {
        const giver = interaction.user;
        const receiver = interaction.options.getUser('user', true);

        const giverChar = await charInteractionSelect(
          interaction, 
          giver,
          true,
          'Séléctionner le personnage qui va donné '
        );
        if (!giverChar) return;
  
        const receiverChar = await charInteractionSelect(
          interaction, 
          receiver,
          false,
          'Séléctionner le personnage qui va recevoir '
        );
        if (!receiverChar) return;
  
        const choice = await confirmationInteract(interaction, `Voulez vous vraiment donner ${money} :septims: à \`${receiverChar.name}\` ?`);
        if (choice) {
          const rmMoney = await removeMoneyToCharacter(giver.id, giverChar, money);
  
          if (!rmMoney) {
            return interaction.editReply({
              content: `Vous ne disposez pas de ${money} :septims: ! Transaction impossible.`,
              components: []
            });
          }
  
          await addMoneyToCharacter(receiver.id, receiverChar, money);
          interaction.editReply({
            content: `Vous avez bien donné ${money} :septims: à \`${receiverChar.name}\`.`,
            components: []
          });
        }
        return;
      }
    } catch (error) {
      console.log(error);
      interaction.reply('somthings went wrong');
    }
  }
};

export default econnmy;