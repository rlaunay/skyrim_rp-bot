import { CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';

export default async function confirmationInteract(inter: CommandInteraction, text: string): Promise<boolean> {
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

  await inter.editReply({ content: text, components: [buttons] });

  const filter = (i: MessageComponentInteraction) => i.user.id === inter.user.id;

  try {
    const reply = await inter.fetchReply();
    if (reply.type !== 'APPLICATION_COMMAND') throw new Error('No app command');

    const collected = await reply.awaitMessageComponent({ filter,  componentType: 'BUTTON', time: 10000 });
    if (collected.customId === 'valid') {
      return true;
    } else {
      await inter.editReply({ content: 'Commande annulée', components: [] });
      return false;
    }
  } catch (error) {
    await inter.editReply({ content: 'Somthings went wrong!', components: [] });
    return false;
  }
}