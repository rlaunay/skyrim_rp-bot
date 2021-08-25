import { Message, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, User, MessageEmbed, SelectMenuInteraction, Client } from 'discord.js';
import { septims } from '../config/env';
import { getUser } from '../firebase/users';
import { Character } from '../interfaces/users';

const emote = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export const selectChar = async (message: Message, user: User, heading = 'Personnage(s) de '): Promise<Character | undefined> => {
  const allUserChars = await getUser(user.id);
  if (!allUserChars) {
    message.reply(`<@${user.id}> ne possède pas encore de personnages.`);
    return;
  }

  let reply = `\`${heading}\`<@${user.id}>\` :\`\nஜ══════════════════ஜ\n> `;
  const options: MessageSelectOptionData[] = [];


  allUserChars.forEach((char, i) => {
    const status = char.status === 1 ? ':green_circle:' : ':red_circle:';
    reply += `\n>  〘${emote[i]}〙➤ ${char.name} ${status} \n> `;
    options.push({ emoji: emote[i], label: char.name, value: i.toString() });
  });
  reply += '\nஜ══════════════════ஜ';

  const selector = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('selectchar')
        .setPlaceholder('Nothing selected')
        .addOptions(options)
    );

  const messagReply = await message.reply({ content: reply, components: [selector] });
  if (!messagReply) return;

  const filter = (i: SelectMenuInteraction) => {
    return i.user.id === message.author.id && i.customId === 'selectchar';
  };

  try {
    const res = await messagReply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 10000 });
    await res.deferUpdate();
    await messagReply.delete();
    return allUserChars[+res.values[0]];
  } catch (error) {
    console.log('no interaction');
    messagReply.delete();
  }
};

export const createCharEmbed = (user: User, character: Character, client: Client): MessageEmbed => {
  const status = character.status === 1 ? 'Atcif' : 'Inactif';
  const charEmbed = new MessageEmbed()
    .setColor('#2ecc71')
    .setTitle(`Informations du personnage de (${user.tag}) :`)
    .setThumbnail(user.avatarURL() || '')
    .addFields(
      { name: 'Nom :', value: character.name, inline: false },
      { name: 'Septims :', value: `${character.money} ${client.emojis.cache.get(septims)}`, inline: false },
      { name: 'Status :', value: status, inline: false },
    );

  return charEmbed;
};

export const diplayChar = async (message: Message, user: User, character: Character): Promise<void> => {
  message.reply({ embeds: [createCharEmbed(user, character, message.client)] });
};