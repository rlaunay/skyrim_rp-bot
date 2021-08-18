import { db, admin } from './config';
import { Character, characterConverter } from './../interfaces/users';

export const getUser = async (id: string): Promise<Character[] | null> => {
  try {
    const charsRef = await db.collection(`users/${id}/characters`).withConverter(characterConverter).get();
    if (charsRef.size > 0) {
      return charsRef.docs.map((doc) => ({ ...doc.data() }));
    }
    return null;
  } catch (error) {
    throw new Error('Somthing went wrong');
  }
};

export const createCharacter = async (discordId: string, discordTag: string, charName: string): Promise<boolean> => {
  try {
    const userRef = db.collection('users').doc(discordId);
    const charsRef = db.collection(`users/${discordId}/characters`);
    const char = await charsRef.get();
    if (char.size >= 9) {
      return false;
    }

    await charsRef.doc().set({ name: charName, money: 1000, status: 1 });
    await userRef.set({ discordTag });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const delCharacter = async (discordId: string, char: Character): Promise<boolean> => {
  try {
    await db.collection(`users/${discordId}/characters`).doc(char.id).delete();
    return true;
  } catch (error) {
    return false;
  }
};

export const updateCharStatus = async (discordId: string, char: Character): Promise<boolean> => {
  try {
    await db.collection(`users/${discordId}/characters`).doc(char.id).update({
      status: char.status === 1 ? 0 : 1,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const addMoneyToCharacter = async (discordId: string, char: Character, money: number): Promise<boolean> => {
  try {
    await db.collection(`users/${discordId}/characters`).doc(char.id).update({
      money: admin.firestore.FieldValue.increment(+money),
    });
    return true;
  } catch (error) {
    return false;
  }
};

type RemoveReturn = {
  ok: boolean;
  message?: string;
}

export const removeMoneyToCharacter = async (discordId: string, char: Character, money: number): Promise<RemoveReturn> => {
  try {
    const charRef = db.collection(`users/${discordId}/characters`).doc(char.id).withConverter(characterConverter);
    const charData = (await charRef.get()).data();
    if (!charData) return { ok: false };
    if (charData.money < +money) {
      return { ok: false, message: 'moneyLimit' };
    }
    await charRef.update({
      money: +charData.money - +money,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error };
  }
};