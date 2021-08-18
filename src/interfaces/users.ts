export class Character {
  constructor(
    readonly id: string,
    public name: string,
    public money: number,
    public status: number
  ) {}
}

type CharData = {
  name: string,
  money: number,
  status: number
}

export const characterConverter = {
  toFirestore: (char: Character): CharData  => {
    return {
      name: char.name,
      money: char.money,
      status: char.status
    };
  },
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot): Character => {
    const data = snapshot.data();
    return new Character(snapshot.id, data.name, data.money, data.status);
  }
};