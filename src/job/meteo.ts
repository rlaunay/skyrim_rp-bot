import { Client } from 'discord.js';
import { getTemps } from '../firebase/temps';
import memoized from '../utils/memoize';

const temps = {
  beau: [
    'Ensoleillé',
    'Chaleur'
  ],
  humide: [
    'Couvert',
    'Pluvieux',
    'Brumeux',
    'Orageux'
  ],
  froid: [
    'Blizzard',
    'Tempête',
    'Venteux',
    'Neigeux'
  ]
};

function createRandom(beau: number, humide: number, froid: number) {
  if ((beau+humide+froid) !== 100) return; 

  console.log('ca calcul ici ou quoi');
  const randomArray: string[][] = [];

  for(let i = 1; i <= beau; i++) {
    randomArray.push(temps.beau);
  }

  for(let i = 1; i <= humide; i++) {
    randomArray.push(temps.humide);
  }

  for(let i = 1; i <= froid; i++) {
    randomArray.push(temps.froid);
  }

  return (): string => {
    const randomTempType = randomArray[Math.floor(Math.random() * randomArray.length)];
    return randomTempType[Math.floor(Math.random() * randomTempType.length)];
  };
}

const createRandomMemoized = memoized<(() => string)| undefined>(createRandom);

export default function randomMeteo(client: Client): void {
  channelEditMeteo(client);
  setInterval(() => {
    channelEditMeteo(client);
  }, 60000);
}


async function channelEditMeteo(client: Client) {
  try {
    const meteos = await getTemps();
    if (!meteos) return;

    await Promise.all(meteos.map(async (meteo) => {
      const channel = await client.channels.fetch(meteo.channelId);
      if (!channel || channel && !channel.isVoice()) return;
  
      const randomizeTemp = createRandomMemoized([meteo.beau, meteo.humide, meteo.froid]);
      if (!randomizeTemp) return;
      const res = randomizeTemp();
      channel.edit({ name: res });
    }));
  } catch (error) {
    console.error(error);
  }
}