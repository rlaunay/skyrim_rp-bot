import { PrefixCommand } from '../../../interfaces/commands';
import { messageSelectChar, messageDiplayChar } from '../../../response/messages/character';
import messageConfirmation from '../../../response/messages/confirmation';
import { getUserFromMention } from '../../../utils/mentions';
import { isAdminOrModo } from '../../../utils/permissions';
import { delCharacter, updateCharStatus, createCharacter } from '../../../firebase/users';


const characters: PrefixCommand = {
  name: 'personnage',
  description: 'Permets la gestion des personnages d\'un utilisateur',
  aliases: ['perso'],
  usages: ['<@user>', 'new <@user> <nom_perso>', 'del <@user>', 'status <@user>'],
  cooldown: 5,
  guildOnly: true,
  async execute(message, args) {
    const { client } = message;
    const user = getUserFromMention(args[0], client) || getUserFromMention(args[1], client) || message.author;

    if (['new', 'del', 'status'].includes(args[0]) && message.member && !isAdminOrModo(message.member)) {
      return message.reply('Vous n\'avez pas les droits pour cette commande.');
    }

    if (!args.length || getUserFromMention(args[0], client)) {
      const char = await messageSelectChar(message, user);
      if (!char) return;
  
      return messageDiplayChar(message, user, char);
    }
  
    else if (args[0] === 'new' && args.length >= 3 && getUserFromMention(args[1], client)) {
      const charName = args.slice(2).join(' ');
   
      const res = await createCharacter(user.id, user.tag, charName);
      if (!res) return message.reply(`${user.username} possède déjà 9 personnages ! Impossible d'en ajouter un nouveau.`);
      return message.reply(`Vous avez bien créé le personnage \`${charName}\` pour ${user.username}.`);
    }
  
    else if (args[0] === 'del') {
      const char = await messageSelectChar(message, user, 'Quel(s) personnage(s) voulez-vous supprimer ?');
      if (!char) return;
  
      const choice = await messageConfirmation(message, `Voulez-vous vraiment supprimer le personnage \`${char.name}\` pour ${user.username} ?`);
          
      if (choice) {
        await delCharacter(user.id, char);
        message.reply(`Vous avez bien supprimé le personnage \`${char.name}\` pour ${user.username}.`);
      }
      return;
    }
  
    else if (args[0] === 'status') {
      const char = await messageSelectChar(message, user, 'À quel(s) personnage(s) voulez-vous changer le status.');
      if (!char) return;
  
      await updateCharStatus(user.id, char);
      message.reply(`Vous avez bien changer le statut du personnage \`${char.name}\` pour ${user.username}.`);
      return;
    }
  
    else {
      return message.reply(`Mauvais arguments, utilisez ${client.prefix}help ${this.name} pour plus d'informations.`);
    }
  }
};

export default characters;