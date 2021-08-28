import { db, admin } from './config';
import { Character, characterConverter } from './../interfaces/users';

export const getUser = async (id: string): Promise<Character[] | null> => {
  const charsRef = await db.collection(`users/${id}/characters`).withConverter(characterConverter).get();
  if (charsRef.size > 0) {
    return charsRef.docs.map((doc) => ({ ...doc.data() }));
  }
  return null;
};

export const createCharacter = async (discordId: string, discordTag: string, charName: string): Promise<boolean> => {
  const userRef = db.collection('users').doc(discordId);
  const charsRef = db.collection(`users/${discordId}/characters`);
  const char = await charsRef.get();
  if (char.size >= 9) {
    return false;
  }

  await charsRef.doc().set({ name: charName, money: 1000, status: 1 });
  await userRef.set({ discordTag });
  return true;

};

export const delCharacter = async (discordId: string, char: Character): Promise<void> => {
  await db.collection(`users/${discordId}/characters`).doc(char.id).delete();
};

export const updateCharStatus = async (discordId: string, char: Character): Promise<void> => {
  await db.collection(`users/${discordId}/characters`).doc(char.id).update({
    status: char.status === 1 ? 0 : 1,
  });
};

export const addMoneyToCharacter = async (discordId: string, char: Character, money: number): Promise<void> => {
  await db.collection(`users/${discordId}/characters`).doc(char.id).update({
    money: admin.firestore.FieldValue.increment(+money),
  });
};


export const removeMoneyToCharacter = async (discordId: string, char: Character, money: number): Promise<boolean> => {
  const charRef = db.collection(`users/${discordId}/characters`).doc(char.id).withConverter(characterConverter);
  const charData = (await charRef.get()).data();
  if (!charData) throw new Error();
  if (charData.money < +money) {
    return false;
  }
  await charRef.update({
    money: +charData.money - +money,
  });
  return true;
};