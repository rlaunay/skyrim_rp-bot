import { MessageActionRow, MessageButton } from 'discord.js';

export function createConfirmButton(): MessageActionRow {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('valid')
        .setEmoji('✅')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('refuse')
        .setEmoji('❌')
        .setStyle('SECONDARY')
    );
}