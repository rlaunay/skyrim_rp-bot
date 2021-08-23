import { CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, User } from 'discord.js';
import { getUser } from '../firebase/users';
import { Character } from '../interfaces/users';
import { createCharEmbed, createSelector } from '../messages/character';

export const charInteractionSelect = async (inter: CommandInteraction | ContextMenuInteraction, user: User, heading = 'Personnage(s) de '): Promise<Character | undefined> => {
  const allUserChars = await getUser(user.id);
  if (!allUserChars) {
    inter.reply(`<@${user.id}> ne possède pas encore de personnages.`);
    return;
  }

  await createSelector(inter, allUserChars, user, heading);
  const reply = await inter.fetchReply();
  if (reply.type !== 'APPLICATION_COMMAND') return;

  const filter = (i: SelectMenuInteraction) => {
    return i.user.id === inter.user.id && i.customId === 'selectchar';
  };

  try {
    const res = await reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 10000 });
    await res.deferUpdate();
    return allUserChars[+res.values[0]];
  } catch (error) {
    console.log('no interaction');
    inter.deleteReply();
  }
};

export const interactionDisplayChar = async (inter: CommandInteraction | ContextMenuInteraction, user: User, character: Character): Promise<void> => {
  await inter.editReply({ content: null, embeds: [createCharEmbed(user, character)], components: [] });
};