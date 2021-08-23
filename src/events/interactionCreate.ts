import { CommandInteraction, Interaction } from 'discord.js';
import Event from '../interfaces/event';

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
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }

    }
  }
};

export default interactionCreate;