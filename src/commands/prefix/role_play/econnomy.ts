import { PrefixCommand } from '../../../interfaces/commands';
import { isPositiveInt } from '../../../utils/helpers';
import { getUserFromMention } from '../../../utils/mentions';
import { isAdminOrModo } from '../../../utils/permissions';
import { selectChar } from '../../../messages/character';
import confirmation from '../../../messages/confirmation';
import { addMoneyToCharacter, removeMoneyToCharacter } from '../../../firebase/users';
import { septims } from '../../../config/env';

const econnmy: PrefixCommand = {
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
    const money = +args[1];

    try {

      if (args[0] === 'add') {
        const char = await selectChar(message, user);
        if (!char) return;
  
        await addMoneyToCharacter(user.id, char, money);
        message.reply(`Vous avez bien ajouté ${money} <:septims:${septims}> à \`${char.name}\`.`);
        return;
      }
  
      else if (args[0] === 'remove') {
        const char = await selectChar(message, user);
        if (!char) return;
  
        const res = await removeMoneyToCharacter(user.id, char, money);
        if (res) {
          message.reply(`Vous avez bien retiré ${money} <:septims:${septims}> à \`${char.name}\`.`);
        } else {
          return message.reply(`Vous ne pouvez pas retirer ${money} <:septims:${septims}> à \`${char.name}\` car il ne dispose pas ce de montant.`);
        }
        return;
      }
  
      else if (args[0] === 'give' && getUserFromMention(args[2], client)) {
        const giver = await selectChar(message, message.author, 'Séléctionner le personnage qui va donné ');
        if (!giver) return;
  
        const receiver = await selectChar(message, user, 'Séléctionner le personnage qui va recevoir ');
        if (!receiver) return;
  
        const choice = await confirmation(message, `Voulez vous vraiment donner ${money} <:septims:${septims}> à \`${receiver.name}\` ?`);
        if (choice) {
          const rmMoney = await removeMoneyToCharacter(message.author.id, giver, money);
  
          if (!rmMoney) {
            return message.reply(`Vous ne disposez pas de ${money} <:septims:${septims}> ! Transaction impossible.`);
          }
  
          await addMoneyToCharacter(user.id, receiver, money);
          message.reply(`Vous avez bien donné ${money} <:septims:${septims}> à \`${receiver.name}\`.`);
        }
        return;
      }
      
      else {
        return message.reply(`Wrong arguments use \`${client.prefix}help ${this.name}\` for usage informations`);
      }
    } catch (error) {
      console.log(error);
      message.reply('Somthings went wrong');
    }
  }
};

export default econnmy;