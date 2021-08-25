import { CommandInteraction, ContextMenuInteraction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, User } from 'discord.js';
import { getUser } from '../firebase/users';
import { Character } from '../interfaces/users';
import { createCharEmbed } from '../messages/character';

const emote = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export const charInteractionSelect = async (
  inter: CommandInteraction | ContextMenuInteraction, 
  user: User,
  isFirst = true,
  heading = 'Personnage(s) de '
): Promise<Character | undefined> => {
  const allUserChars = await getUser(user.id);
  if (!allUserChars) {
    inter.reply(`<@${user.id}> ne possède pas encore de personnages.`);
    return;
  }

  let content = `\`${heading}\`<@${user.id}>\` :\`\nஜ══════════════════ஜ\n> `;
  const options: MessageSelectOptionData[] = [];


  allUserChars.forEach((char, i) => {
    const status = char.status === 1 ? ':green_circle:' : ':red_circle:';
    content += `\n>  〘${emote[i]}〙➤ ${char.name} ${status} \n> `;
    options.push({ emoji: emote[i], label: char.name, value: i.toString() });
  });
  content += '\nஜ══════════════════ஜ';

  const selector = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('selectchar')
        .setPlaceholder('Nothing selected')
        .addOptions(options)
    );

  if (isFirst) {
    await inter.reply({ content: content, components: [selector] });
  } else {
    await inter.editReply({ content: content, components: [selector] });
  }

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
  await inter.editReply({ content: null, embeds: [createCharEmbed(user, character, inter.client)], components: [] });
};