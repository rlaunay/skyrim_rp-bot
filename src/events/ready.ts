import Bot from '../bot/client';
import Event from './../interfaces/event';
import calendar from '../job/calendar';

const ready: Event = {
  name: 'ready',
  once: true,
  execute(client: Bot) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    calendar(client);
  }
};

export default ready;