import { Temps, tempsConverter } from '../interfaces/temps';
import { db } from './config';

export const getTemps = async (): Promise<Temps | undefined> => {
  try {
    const res = await db.collection('temps').doc('sNwuGx1UfAO3eDfZaNyg').withConverter(tempsConverter).get();
    if (!res.exists) return;
    return res.data();
  } catch (error) {
    console.log(error);
  }
};