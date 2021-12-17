import ICard from '../interfaces/ICard';
import cards from '../constants/cards';
import sort from '../helpers/sort';

export function getCards(): Promise<ICard[]> {
  return Promise.resolve(cards);
}

export function getCardById(id: number): Promise<ICard | undefined> {
  const card = cards.find((c) => c.id === id);
  return Promise.resolve(card);
}

export function deleteCard(id: number): Promise<void> {
  const index = cards.findIndex((card) => card.id === id);
  if (index < 0) {
    return Promise.reject(new Error('Category not found'));
  }

  cards.splice(index, 1);
  return Promise.resolve();
}

export function createCard(card: ICard): Promise<ICard> {
  const isExist = typeof cards
    .find((c) => c.word.toLowerCase() === card.word.toLowerCase()) !== 'undefined';

  if (isExist) {
    return Promise.reject(new Error(`Category with word ${card.word} is already exists`));
  }

  const newId = Date.now();
  const model = { ...card, id: newId };
  cards.push(model);
  sort(cards);

  return Promise.resolve(model);
}

export function updateCard(card: ICard): Promise<ICard> {
  let newWord = '';
  let newTranslation = '';
  let newImage = '';
  let newAudio = '';

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === card.id) {
      newWord = card.word;
      newTranslation = card.translation;
      newImage = card.image;
      newAudio = card.audio;

      cards.splice(i, 1);
    }
  }

  const model = {
    ...card,
    word: newWord,
    translation: newTranslation,
    image: newImage,
    audioSrc: newAudio,
  };
  cards.push(model);
  sort(cards);

  return Promise.resolve(model);
}
