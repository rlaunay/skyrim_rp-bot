import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, User, WebhookEditMessageOptions } from 'discord.js';
import { Character } from '../../interfaces/users';

const emotes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export function createSelectorResponse(user: User, char: Character[], heading: string): WebhookEditMessageOptions {
  let reply = `\`${heading}\`<@${user.id}>\` :\`\nஜ══════════════════ஜ\n> `;
  const options: MessageSelectOptionData[] = [];


  char.forEach((char, i) => {
    const status = char.status === 1 ? ':green_circle:' : ':red_circle:';
    reply += `\n>  〘${emotes[i]}〙➤ ${char.name} ${status} \n> `;
    options.push({ emoji: emotes[i], label: char.name, value: i.toString() });
  });
  reply += '\nஜ══════════════════ஜ';

  const selector = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('selectchar')
        .setPlaceholder('Nothing selected')
        .addOptions(options)
    );

  return { content: reply, components: [selector] };
}
