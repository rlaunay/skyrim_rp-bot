import { CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, User } from 'discord.js';
import { getUser } from '../../firebase/users';
import { Character } from '../../interfaces/users';
import { createCharCanvas } from '../attachements/charProfil';
import { createSelectorResponse } from '../components/selector';
import { replyAndFetchIt } from './reply';

export async function interactionSelectChar (
  inter: CommandInteraction | ContextMenuInteraction, 
  user: User,
  heading = 'Personnage(s) de '
): Promise<Character | undefined> {
  const allUserChars = await getUser(user.id);
  if (!allUserChars) {
    await replyAndFetchIt(inter, { content: `<@${user.id}> ne possède pas encore de personnages.`, components: [] });
    return;
  }

  const replyOptions = createSelectorResponse(user, allUserChars, heading);
  const reply = await replyAndFetchIt(inter, replyOptions);

  const filter = (i: SelectMenuInteraction) => {
    return i.user.id === inter.user.id && i.customId === 'selectchar';
  };

  try {
    const res = await reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 10000 });
    await res.deferUpdate();
    return allUserChars[+res.values[0]];
  } catch (error) {
    await inter.editReply({ content: 'temps ecouler', components: [] });
  }
}

export const interactionDisplayChar = async (inter: CommandInteraction | ContextMenuInteraction, user: User, character: Character): Promise<void> => {
  await inter.editReply({ content: null, files: [await createCharCanvas(user, character)], components: [] });
};