import { Client, StageChannel, VoiceChannel } from 'discord.js';
import { CronJob } from 'cron'; 
import { channelId } from './../config/env';

async function updateChan(chan: VoiceChannel | StageChannel) {
  const date = new Date();

  const skyrimDay = [
    'Sundas',
    'Morndas',
    'Tirdas',
    'Middas',
    'Turdas',
    'Fredas',
    'Loredas',
  ];

  const skyrimMonth = [
    'Primétoile',
    'Clairciel',
    'Semailles',
    'Ondepluie',
    'Plantaisons',
    'Mi-l\'an',
    'Hautzénith',
    'Vifazur',
    'Âtrefeu',
    'Soufflegivre',
    'Sombreciel',
    'Soirétoile',
  ];

  const nbr = date.getDate();
  const day = date.getDay();
  const month = date.getMonth();

  console.log(
    `Date mise à jour: ${skyrimDay[day]} ${nbr} ${skyrimMonth[month]}`,
  );

  try {
    await chan.edit({
      name: `${skyrimDay[day]} ${nbr} ${skyrimMonth[month]}`,
    });
  } catch (e) {
    console.error(e);
  }
}

export default async function calendar(client: Client): Promise<void> {
  try {
    const channel = await client.channels.fetch(channelId);

    if (channel && channel.isVoice()) {
      const job = new CronJob({
        cronTime: '0 5 1 * * *',
        onTick: () => {
          updateChan(channel);
        },
        timeZone: 'Europe/Paris',
        runOnInit: true,
      });
      job.start();
    } else {
      throw new Error('Calendar channel id must be a voice channel');
    }
  } catch (e) {
    console.log(e);
    throw new Error('Somthing went wrong');
  }
}