import { Temps, tempsConverter } from '../interfaces/temps';
import { db } from './config';

export const getTemps = async (): Promise<Temps[] | undefined> => {
  const snap = await db.collection('meteos').withConverter(tempsConverter).get();
  return snap.docs.map((temp) => ({ ...temp.data() }));
};