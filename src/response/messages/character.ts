import { 
  Message, 
  User, 
  SelectMenuInteraction
} from 'discord.js';
import { getUser } from '../../firebase/users';
import { Character } from '../../interfaces/users';
import { createCharCanvas } from '../attachements/charProfil';
import { createSelectorResponse } from '../components/selector';

export async function messageSelectChar(message: Message, user: User, heading = 'Personnage(s) de '): Promise<Character | undefined> {
  const allUserChars = await getUser(user.id);
  if (!allUserChars) {
    message.reply(`<@${user.id}> ne possède pas encore de personnages.`);
    return;
  }

  const replyOptions = createSelectorResponse(user, allUserChars, heading);

  const reply = await message.reply(replyOptions);

  const filter = (i: SelectMenuInteraction) => {
    return i.user.id === message.author.id && i.customId === 'selectchar';
  };

  try {
    const res = await reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 10000 });
    await res.deferUpdate();
    await reply.delete();
    return allUserChars[+res.values[0]];
  } catch (error) {
    await reply.edit({ content: 'temps ecouler', components: [] });
  }
}

export const messageDiplayChar = async (message: Message, user: User, character: Character): Promise<void> => {
  const attachement = await createCharCanvas(user, character);
  await message.reply({ files: [attachement] });
};