import { PrefixCommand } from '../../../interfaces/commands';

const ping: PrefixCommand = {
  name: 'ping',
  description: 'Send ping command',
  execute: async (message) => {
    const before = Date.now();
    const response = await message.reply('Pong');
    const after = Date.now();

    response.edit(`Pong **(${after - before}ms)**`);
  }
};

export default ping;