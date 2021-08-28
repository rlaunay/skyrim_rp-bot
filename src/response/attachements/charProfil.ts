import Canvas from 'canvas';
import { MessageAttachment, User } from 'discord.js';
import path from 'path';
import { Character } from '../../interfaces/users';

Canvas.registerFont(path.join(__dirname, '..', '..', '..', 'public', 'fonts', 'Roboto-Bold.ttf'), {
  family: 'Roboto',
  weight: 'bold'
});

Canvas.registerFont(path.join(__dirname, '..', '..', '..', 'public', 'fonts', 'Roboto-Regular.ttf'), {
  family: 'Roboto',
  weight: 'regular'
});

export const createCharCanvas = async (user: User, character: Character): Promise<MessageAttachment> => {
  const canvas = Canvas.createCanvas(500, 200);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage(path.join(__dirname, '..', '..', '..', 'public', 'img', 'profil.png'));
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.font = 'bold 18px Roboto';
  context.fillStyle = '#C0A860';
  context.fillText(user.tag, 200, 50);

  context.font = '14px Roboto';
  context.fillStyle = '#C0A860';
  context.fillText(character.name, 240, 91);

  context.font = '14px Roboto';
  context.fillStyle = '#C0A860';
  context.fillText(character.money.toString(), 225, 119);

  context.font = '14px Roboto';
  context.fillStyle = '#C0A860';
  const status = character.status === 1 ? 'Actif' : 'Inactif';
  context.fillText(status, 250, 147);

  context.beginPath();
  context.arc(100, 100, 75, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
  context.drawImage(avatar, 25, 25, 150, 150);

  const attachement = new MessageAttachment(canvas.toBuffer(), path.join(__dirname, '..', '..', '..', 'public', 'img', 'profil.png'));
  return attachement;
};