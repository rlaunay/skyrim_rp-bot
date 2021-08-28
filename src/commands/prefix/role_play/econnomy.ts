import { PrefixCommand } from '../../../interfaces/commands';
import { isPositiveInt } from '../../../utils/helpers';
import { getUserFromMention } from '../../../utils/mentions';
import { isAdminOrModo } from '../../../utils/permissions';
import { messageSelectChar } from '../../../response/messages/character';
import messageConfirmation from '../../../response/messages/confirmation';
import { addMoneyToCharacter, removeMoneyToCharacter } from '../../../firebase/users';
import { septims } from '../../../config/env';

const econnmy: PrefixCommand = {
  name: 'argent',
  description: 'Permets la gestion de l\'argent des personnages d\'un utilisateur',
  aliases: ['moula', 'm', 'septims'],
  usages: ['add <montant> <@user>', 'remove <montant> <@user>', 'give <montant> <@user>'],
  guildOnly: true,
  args: true,
  async execute (message, args) {
    const { client } = message;
    const user = getUserFromMention(args[2], client) || message.author;

    if (['add', 'remove'].includes(args[0]) && message.member && !isAdminOrModo(message.member)) {
      return message.reply('Vous n\'avez pas les droits pour cette commande.');
    }

    if ((args.length < 2 || args.length > 3) && !isPositiveInt(args[1])) {
      return message.reply(`Mauvais arguments, utilisez ${client.prefix}help ${this.name} pour plus d'informations.`);
    }
    const money = +args[1];

    if (args[0] === 'add') {
      const char = await messageSelectChar(message, user, 'À quel(s) personnage(s) voulez-vous ajouter de l\'argent.');
      if (!char) return;
  
      await addMoneyToCharacter(user.id, char, money);
      message.reply(`Vous avez bien ajouté ${money}<:septims:${septims}> à \`${char.name}\`.`);
      return;
    }
  
    else if (args[0] === 'remove') {
      const char = await messageSelectChar(message, user, 'À quel(s) personnage(s) voulez-vous retirer de l\'argent.');
      if (!char) return;
  
      const res = await removeMoneyToCharacter(user.id, char, money);
      if (res) {
        message.reply(`Vous avez bien retiré ${money}<:septims:${septims}> à \`${char.name}\`.`);
      } else {
        return message.reply(`Vous ne pouvez pas retirer ${money}<:septims:${septims}> à \`${char.name}\` car il ne dispose pas ce de montant.`);
      }
      return;
    }
  
    else if (args[0] === 'give' && getUserFromMention(args[2], client)) {
      const giver = await messageSelectChar(message, message.author, 'Sélectionner le personnage qui va donner de l\'argent\nPersonnage(s) de ');
      if (!giver) return;
  
      const receiver = await messageSelectChar(message, user, 'Sélectionner le personnage qui va recevoir de l\'argent\nPersonnage(s) de ');
      if (!receiver) return;
  
      const choice = await messageConfirmation(message, `Voulez vous vraiment donner avec \`${giver.name}\` ${money}<:septims:${septims}> à \`${receiver.name}\` ?`);
      if (choice) {
        const rmMoney = await removeMoneyToCharacter(message.author.id, giver, money);
  
        if (!rmMoney) {
          return message.reply(`Vous ne disposez pas de ${money}<:septims:${septims}> ! Transaction impossible.`);
        }
  
        await addMoneyToCharacter(user.id, receiver, money);
        message.reply(`Vous avez bien donné avec \`${giver.name}\` ${money}<:septims:${septims}> à \`${receiver.name}\`.`);
      }
      return;
    }
      
    else {
      return message.reply(`Mauvais arguments, utilisez ${client.prefix}help ${this.name} pour plus d'informations.`);
    }
  }
};

export default econnmy;