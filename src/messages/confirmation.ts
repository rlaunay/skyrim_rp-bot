import { Message, MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';

export default async function confirmation(message: Message, text: string): Promise<boolean> {
  const buttons = new MessageActionRow()
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

  const reply = await message.reply({ content: text, components: [buttons] });

  const filter = (i: MessageComponentInteraction) => i.user.id === message.author.id;

  try {
    const collected = await reply.awaitMessageComponent({ filter,  componentType: 'BUTTON', time: 10000 });
    await reply.delete();
    if (collected.customId === 'valid') {
      return true;
    } else {
      const cancel = await message.reply('Commande annulée');
      setTimeout(() => cancel.delete(), 3000);
      return false;
    }
  } catch (error) {
    reply.delete();
    return false;
  }
}