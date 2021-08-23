import { UserCommand } from '../../../interfaces/commands';
import { charInteractionSelect, interactionDisplayChar } from '../../../interactions/characterSelector';

const characters: UserCommand = {
  name: 'perso',
  type: 2,
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);

    const char = await charInteractionSelect(interaction, user);
    if (!char) return;

    return await interactionDisplayChar(interaction, user, char);
  }
};

export default characters;