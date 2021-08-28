import { CommandInteraction, ContextMenuInteraction, Message, WebhookEditMessageOptions } from 'discord.js';

export async function replyAndFetchIt(interaction: CommandInteraction | ContextMenuInteraction, replyObj: WebhookEditMessageOptions): Promise<Message> {
  let reply = null;

  if (interaction.replied) {
    reply = await interaction.editReply(replyObj);
  } else {
    reply = await interaction.reply({ ...replyObj, fetchReply: true });
  }
  
  if (reply.type !== 'APPLICATION_COMMAND') throw new Error('No app command');
  return reply;
}