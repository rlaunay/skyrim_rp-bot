import { CommandInteraction, Interaction } from 'discord.js';
import Event from '../interfaces/event';
import { replyAndFetchIt } from '../response/interactions/reply';

const interactionCreate: Event = {
  name: 'interactionCreate',
  async execute(interaction: Interaction | CommandInteraction) {
    if (interaction.isCommand()) {
      
      const { commandName, client: { slashCommands } } = interaction;
      const command = slashCommands.get(commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await replyAndFetchIt(interaction, { 
          content: 'Une erreur est survenue, veuillez réessayer plus tard!', 
          components: [], 
          embeds: [], 
          files: [] 
        });
      }

    }

    if (interaction.isContextMenu()) {
      const { commandName, client: { userCommands } } = interaction;
      const command = userCommands.get(commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await replyAndFetchIt(interaction, { 
          content: 'Une erreur est survenue, veuillez réessayer plus tard', 
          components: [], 
          embeds: [], 
          files: [] 
        });
      }

    }
  }
};

export default interactionCreate;