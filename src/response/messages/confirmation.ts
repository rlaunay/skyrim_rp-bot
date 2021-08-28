import { Message, MessageComponentInteraction } from 'discord.js';
import { createConfirmButton } from '../components/buttons';

export default async function messageConfirmation(message: Message, text: string): Promise<boolean> {
  const buttons = createConfirmButton();

  const reply = await message.reply({ content: text, components: [buttons] });

  const filter = (i: MessageComponentInteraction) => i.user.id === message.author.id;

  try {
    const collected = await reply.awaitMessageComponent({ filter,  componentType: 'BUTTON', time: 10000 });

    if (collected.customId === 'valid') {
      await reply.delete();
      return true;
    } else {
      await reply.edit({ content: 'Commande annulée', components: [] });
      return false;
    }
  } catch (error) {
    await reply.edit({ content: 'temps ecouler', components: [] });
    return false;
  }
}