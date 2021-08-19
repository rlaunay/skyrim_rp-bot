import { Command } from '../../../interfaces/commands';
import { isPositiveInt } from '../../../utils/helpers';
import { getUserFromMention } from '../../../utils/mentions';
import { isAdminOrModo } from '../../../utils/permissions';
import { selectChar } from '../../../messages/character';
import confirmation from '../../../messages/confirmation';
import { addMoneyToCharacter, removeMoneyToCharacter } from '../../../firebase/users';

const econnmy: Command = {
  name: 'money',
  description: 'Allows the management of a user\'s characters money',
  aliases: ['m', 'bal'],
  usages: ['add <amount> <@user>', 'remove <amount> <@user>', 'give <amount> <@user>'],
  guildOnly: true,
  args: true,
  async execute (message, args) {
    const { client } = message;
    const user = getUserFromMention(args[2], client) || message.author;

    if (['add', 'remove'].includes(args[0]) && message.member && !isAdminOrModo(message.member)) {
      return message.reply('Vous n\'avez pas les droits pour cette command');
    }

    if ((args.length < 2 || args.length > 3) && !isPositiveInt(args[1])) {
      return message.reply(`Wrong arguments use \`${client.prefix}help ${this.name}\` for usage informations`);
    }

    const money = args[1];

    if (args[0] === 'add') {
      const char = await selectChar(message, user);
      if (!char) return;

      const choice = await confirmation(message, `Voulez vous vraiment ajouter ${money} :septims: à \`${char.name}\` ?`);
      if (choice) {
        const res = await addMoneyToCharacter(user.id, char, +money);
        if (res) {
          message.reply(`Vous avez bien ajouté ${money} :septims: à \`${char.name}\`.`);
        } else {
          message.reply('Une erreur est survenue lors de l\'ajout de septims');
        }
      }
      return;
    }

    else if (args[0] === 'remove') {
      const char = await selectChar(message, user);
      if (!char) return;

      const choice = await confirmation(message, `Voulez vous vraiment retirer ${money} :septims: à \`${char.name}\` ?`);
      if (choice) {
        const res = await removeMoneyToCharacter(user.id, char, +money);
        if (res.ok) {
          message.reply(`Vous avez bien retiré ${money} :septims: à \`${char.name}\`.`);
        } else {
          if (res.message === 'moneyLimit') {
            return message.reply(`Vous ne pouvez pas retirer ${money} :septims: à \`${char.name}\` car il ne dispose pas ce de montant.`);
          }
          message.reply('Une erreur est survenue lors du retrait de septims');
        }
      }
      return;
    }

    else if (args[0] === 'give' && getUserFromMention(args[2], client)) {
      const giver = await selectChar(message, message.author, 'Séléctionner le personnage qui va donné ');
      if (!giver) return;

      const receiver = await selectChar(message, user, 'Séléctionner le personnage qui va recevoir ');
      if (!receiver) return;

      const choice = await confirmation(message, `Voulez vous vraiment donner ${money} :septims: à \`${receiver.name}\` ?`);
      if (choice) {
        const rmMoney = await removeMoneyToCharacter(message.author.id, giver, +money);

        if (!rmMoney.ok && rmMoney.message === 'moneyLimit') {
          return message.reply(`Vous ne disposez pas de ${money} :septims: ! Transaction impossible.`);
        }

        const addMoney = await addMoneyToCharacter(user.id, receiver, +money);

        if (rmMoney.ok && addMoney) {
          message.reply(`Vous avez bien donné ${money} :septims: à \`${receiver.name}\`.`);
        } else {
          message.reply('Une erreur est survenue lors du dons de septims');
        }
      }
      return;
    }
    
    else {
      return message.reply(`Wrong arguments use \`${client.prefix}help ${this.name}\` for usage informations`);
    }
  }
};

export default econnmy;