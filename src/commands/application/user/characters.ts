import { UserCommand } from '../../../interfaces/commands';
import { interactionSelectChar, interactionDisplayChar } from '../../../response/interactions/character';

const characters: UserCommand = {
  name: 'perso',
  type: 2,
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);

    const char = await interactionSelectChar(interaction, user);
    if (!char) return;

    return await interactionDisplayChar(interaction, user, char);
  }
};

export default characters;