export class Temps {
  constructor(
    readonly channelId: string,
    readonly name: string,
    readonly beau: number,
    readonly humide: number,
    readonly froid: number
  ) {}
}

export const tempsConverter = {
  toFirestore: (temps: Temps): Temps  => {
    return {
      ...temps
    };
  },
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot): Temps => {
    const data = snapshot.data();
    return new Temps(data.channelId, data.name, data.beau, data.humide, data.froid);
  }
};