import { CommandInteraction, MessageComponentInteraction } from 'discord.js';
import { createConfirmButton } from '../components/buttons';
import { replyAndFetchIt } from './reply';

export default async function interactionConfimation(inter: CommandInteraction, text: string): Promise<boolean> {
  const buttons = createConfirmButton();

  const reply = await replyAndFetchIt(inter, { content: text, components: [buttons] });

  const filter = (i: MessageComponentInteraction) => i.user.id === inter.user.id;

  try {
    const collected = await reply.awaitMessageComponent({ filter,  componentType: 'BUTTON', time: 10000 });
    if (collected.customId === 'valid') {
      return true;
    } else {
      await inter.editReply({ content: 'Commande annulée', components: [] });
      return false;
    }
  } catch (error) {
    await inter.editReply({ content: 'Temps expiré!', components: [] });
    return false;
  }
}