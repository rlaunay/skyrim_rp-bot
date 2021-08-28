import { CommandInteraction, ContextMenuInteraction, Message, WebhookEditMessageOptions } from 'discord.js';

export async function replyAndFetchIt(interaction: CommandInteraction | ContextMenuInteraction, replyObj: WebhookEditMessageOptions): Promise<Message> {
  if (interaction.replied) {
    await interaction.editReply(replyObj);
  } else {
    await interaction.reply(replyObj);
  }

  const reply = await interaction.fetchReply();
  if (reply.type !== 'APPLICATION_COMMAND') throw new Error('No app command');
  return reply;
}