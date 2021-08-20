import { PrefixCommand } from '../../../interfaces/commands';
import { selectChar, diplayChar } from '../../../messages/character';
import confirmation from '../../../messages/confirmation';
import { getUserFromMention } from '../../../utils/mentions';
import { isAdminOrModo } from '../../../utils/permissions';
import { delCharacter, updateCharStatus, createCharacter } from '../../../firebase/users';


const characters: PrefixCommand = {
  name: 'character',
  description: 'Allows the management of a user\'s characters',
  aliases: ['personnage', 'char', 'perso'],
  usages: ['<@user>', 'new <@user> <character_name>', 'del <@user>', 'status <@user>'],
  cooldown: 5,
  guildOnly: true,
  async execute(message, args) {
    const { client } = message;
    const user = getUserFromMention(args[0], client) || getUserFromMention(args[1], client) || message.author;

    if (['new', 'del', 'status'].includes(args[0]) && message.member && !isAdminOrModo(message.member)) {
      return message.reply('Vous n\'avez pas les droits pour cette command');
    }

    if (!args.length || getUserFromMention(args[0], client)) {
      const char = await selectChar(message, user);
      if (!char) return;

      return diplayChar(message, user, char);
    }

    else if (args[0] === 'new' && args.length >= 3 && getUserFromMention(args[1], client)) {
      const charName = args.slice(2).join(' ');
      const choice = await confirmation(message, `Voulez vous vraiment créer le personnage \`${charName}\` pour ${user.tag}`);

      if (choice) {
        const res = await createCharacter(user.id, user.tag, charName);
        if (!res) return message.reply(`${user.tag} possède déjà 9 personnages ! Impossible d'en ajouter un nouveau.`);
        message.reply(`Vous avez bien créé le personnage \`${charName}\` pour ${user.tag}.`);
      }
      return;
    }

    else if (args[0] === 'del') {
      const char = await selectChar(message, user, 'Quels personnages voulez vous supprimez ?');
      if (!char) return;

      const choice = await confirmation(message, `Voulez vous vraiment supprimer le personnage \`${char.name}\` pour ${user.tag}`);
        
      if (choice) {
        const del = await delCharacter(user.id, char);
        if (del) {
          message.reply(`Vous avez bien supprimé le personnage \`${char.name}\` pour ${user.tag}.`);
        } else {
          message.reply('Une erreur est survenue lors de la suppression');
        }
      }
      return;
    }

    else if (args[0] === 'status') {
      const char = await selectChar(message, user, 'A quels personnages voulez vous changer le status ?');
      if (!char) return;

      const choice = await confirmation(message, `Voulez vous vraiment changer le statut du personnage \`${char.name}\` pour ${user.tag}`);
      if (choice) {
        const status = await updateCharStatus(user.id, char);
        if (status) {
          message.reply(`Vous avez bien changer le statut du personnage \`${char.name}\` pour ${user.tag}.`);
        } else {
          message.reply('Une erreur est survenue lors du changement de status');
        }
      }
      return;
    }

    else {
      return message.reply(`Wrong arguments use \`${client.prefix}help ${this.name}\` for usage informations`);
    }
  }
};

export default characters;