import { Endpoints } from './components/constants/endpoints';
import { state } from './components/constants/state';
import ICard from './components/models/ICard';
import ICategory from './components/models/ICategory';
import ILoaded from './components/models/Iloaded';
import IUser from './components/models/IUser';

export default class RestApi {
  async getCategories(): Promise<ICategory[]> {
    const response = await fetch(Endpoints.categories);
    const data = await response.json();
    const array: ICategory[] = [];

    for (let i = 0; i < data.length; i++) {
      const cat: ICategory = { id: data[i].id, name: data[i].name };
      array.push(cat);
    }

    return array;
  }

  async removeCategory(id: number): Promise<void> {
    const response = await fetch(`${Endpoints.categories}/${id}`, {
      method: 'DELETE',
    });

    await response.json();
  }

  async updateCategory(cat: ICategory): Promise<ICategory> {
    const body = { id: +cat.id, name: cat.name };

    const response = await fetch(`${Endpoints.categories}/${+cat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const newCategory = await response.json();

    return newCategory;
  }

  async createCategory(category: ICategory): Promise<ICategory> {
    const body = { name: category.name };

    const response = await fetch(`${Endpoints.categories}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const newCategory = await response.json();
    return newCategory;
  }

  async getCards(): Promise<ICard[]> {
    const response = await fetch(Endpoints.cards);
    const data = await response.json();
    const array: ICard[] = [];

    for (let i = 0; i < data.length; i++) {
      const card: ICard = {
        id: data[i].id,
        categoryId: data[i].categoryId,
        word: data[i].word,
        translation: data[i].translation,
        image: data[i].image,
        audio: data[i].audio,
      };
      array.push(card);
    }

    return array;
  }

  async removeCard(id: number): Promise<void> {
    const response = await fetch(`${Endpoints.cards}/${id}`, {
      method: 'DELETE',
    });

    await response.json();
  }

  async getCardById(id: number): Promise<ICard> {
    const response = await fetch(`${Endpoints.cards}/${id}`);
    const data = await response.json();
    return data;
  }

  async updateCard(card: ICard): Promise<ICard> {
    const body = {
      id: +card.id,
      categoryId: +card.categoryId,
      word: card.word,
      translation: card.translation,
      image: card.image,
      audio: card.audio,
    };

    const response = await fetch(`${Endpoints.cards}/${card.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const newCard = await response.json();
    return newCard;
  }

  async createCard(card: ICard): Promise<ICard> {
    const body = {
      id: +card.id,
      categoryId: +card.categoryId,
      word: card.word,
      translation: card.translation,
      image: card.image,
      audio: card.audio,
    };

    const response = await fetch(`${Endpoints.cards}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const newCard = await response.json();
    return newCard;
  }

  async loadDataToServer(id: number): Promise<ILoaded> {
    const file = document.getElementById(`sound-input-${id}`) as HTMLInputElement;
    const formData = new FormData();

    if (file?.files && file.files[0]) {
      formData.append(file.name, file.files[0]);
    }

    const response = await fetch(Endpoints.uploads, {
      method: 'POST',
      body: formData,
    });

    const loaded: ILoaded = await response.json();
    return loaded;
  }

  async loginHandler(user: IUser) {
    let path = '';

    if (state.needRegistry) {
      path = Endpoints.authRegistry;
    } else {
      path = Endpoints.authLogin;
    }

    const response = await fetch(`${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const answer = await response.json();
    return answer;
  }
}
