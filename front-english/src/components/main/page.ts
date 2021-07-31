import './css/page.css';
import BaseComponent from '../base-component';
import MainCard from './main-card';
import Container from './container';
import { state } from '../constants/state';
import RestApi from '../../api';
import AdminCategoryCard from './admin-category-card';
import AdminCard from './admin-card';
import Controls from './controls';
import ICard from '../models/ICard';
import { Actions } from '../constants/actions';
import ICategory from '../models/ICategory';
import { Message } from '../constants/user-message';
import { Endpoints } from '../constants/endpoints';
import ILoaded from '../models/Iloaded';

const CLASS_NONE = 'none';
const PREVIEW_IMG = './img/preview.png';

export default class Page extends BaseComponent {
  api = new RestApi();

  container = new Container(0);

  controls = new Controls();

  constructor(id: string) {
    super('div', ['page']);

    this.element.id = id;
  }

  async addMainPage(): Promise<void> {
    const categories = await this.api.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const card = new MainCard(categories[i].id);

      this.element.append(card.element);
    }
  }

  addCategoryPage(id: number): void {
    const container = new Container(id);
    this.element.append(container.element);

    this.listenCategoryPage();
  }

  listenCategoryPage(): void {
    this.element.addEventListener('click', async (event) => {
      const elem = event.target as HTMLDivElement;

      if (elem.classList.contains('start')) {
        this.controls.toggle();
        this.startGame();
      }

      if (elem.classList.contains('repeat')) {
        this.container.repeatSound();
      }

      if (elem.classList.contains('front')
        || elem.classList.contains('card__img-front')
        || elem.classList.contains('card__title-front')) {
        if (!state.playState) {
          state.cards = await this.getCardsToPlay();
          this.container.train(event);
        }
      }

      if (elem.classList.contains('card__btn-svg')) {
        if (!state.playState) {
          this.container.flippToBack(event);
        }
      }
    });
  }

  async startGame(): Promise<void> {
    state.gameActive = true;
    state.endGame = false;
    state.errors = 0;

    state.cards = await this.getCardsToPlay();
    const arr = await this.container.getRandomArray();
    state.randomArray = arr;

    this.container.playGame();
  }

  async getCardsToPlay(): Promise<ICard[]> {
    const cardsToPlay: ICard[] = [];
    const cards = await this.api.getCards();

    for (let i = 0; i < cards.length; i++) {
      if (state.currentCategory === cards[i].categoryId) {
        cardsToPlay.push(cards[i]);
      }
    }

    return cardsToPlay;
  }

  addFinalPage(isWin: boolean): void {
    let smile = '';
    let message = '';

    if (isWin) {
      smile = 'success';
      message = 'You win!';
    } else {
      smile = 'failure';
      message = `You failed with ${state.errors} errors!`;
    }

    const div = `
      <div class='message'>${message}</div>
      <div class='${smile}'></div>
    `;

    this.element.insertAdjacentHTML('afterbegin', div);
  }

  async addAdminCategoryPage(): Promise<void> {
    const categories = await this.api.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const card = new AdminCategoryCard(categories[i].id, categories[i].name);

      this.element.append(card.element);
    }

    const createCard = new BaseComponent('div', ['create__container']);
    createCard.element.insertAdjacentHTML('afterbegin', `
      <h1>Create new Category</h1>
      <div class="create__btn"></div>
    `);

    this.element.append(createCard.element);

    this.listenAdminCategoryPage();
  }

  async addAdminCardsPage(id: number): Promise<void> {
    const categories = await this.api.getCategories();
    const cards = await this.api.getCards();

    let category = '';

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        category = categories[i].name;
      }
    }

    const container = new BaseComponent('div', ['admin__container']);

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].categoryId === id) {
        const card = new AdminCard(cards[i]);
        container.element.append(card.element);
      }
    }

    const title = `
      <div class="admin__cards_title">
        <h1>Category: <span class="admin__title" id="title-${id}">${category}</span></h1>

        <button class="admin__back">back to categories</button>
      </div>
      `;
    this.element.insertAdjacentHTML('afterbegin', title);

    const createCard = new BaseComponent('div', ['newcard__create']);
    createCard.element.insertAdjacentHTML('afterbegin', `
      <h1>Add new Word</h1>
      <div class="card__add"></div>
    `);

    container.element.append(createCard.element);
    this.element.append(container.element);

    this.listenAdminCardsPage();
  }

  listenAdminCategoryPage(): void {
    this.element.addEventListener('click', (event) => {
      const elem = event.target as HTMLDivElement;

      if (elem.classList.contains('cat__update')
        || elem.classList.contains('cat__remove')) {
        this.checkActionToChangeCategory(event);
      }

      if (elem.classList.contains('create__btn')) {
        this.openCategoryCreator();
      }

      if (elem.classList.contains('cat__cancel')) {
        this.cancelCategoryUpdator(event);
      }

      if (elem.classList.contains('cat__create')) {
        this.submitCategoryUpdator(event);
      }
    });
  }

  listenAdminCardsPage(): void {
    this.element.addEventListener('click', (event) => {
      const elem = event.target as HTMLDivElement;
      if (elem.classList.contains('card__remove')
        || (elem.classList.contains('card__update'))
        || (elem.classList.contains('card__add'))) {
        this.checkActionToChangeCard(event);
      }

      if (elem.classList.contains('card__cancel')) {
        this.closeCardUpdator(event);
      }

      if (elem.classList.contains('card__create')) {
        this.submitCardUpdator(event);
      }
    });
  }

  checkActionToChangeCategory(event: Event): void {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[1];
    const action = target.id.split('-')[0];
    const value = document.getElementById(`title-${id}`)?.innerText as string;

    if (action === Actions.remove) {
      this.removeCategory(id);
    } else {
      this.openCategoryUpdator(id, value);
    }
  }

  async removeCategory(id: number): Promise<void> {
    const parent = document.getElementById('adminCategory');
    const category = document.getElementById(`cat-${id}`) as HTMLElement;
    parent?.removeChild(category);

    this.api.removeCategory(id);
    const cards = await this.api.getCards();
    const cardsToRemove = [];

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].categoryId === id) {
        cardsToRemove.push(cards[i]);
      }
    }

    cardsToRemove.forEach((card) => {
      this.api.removeCard(card.id);
    });
  }

  openCategoryUpdator(id: number, value: string): void {
    new AdminCategoryCard(id, '').openCategoryUpdator(id, value);
  }

  openCategoryCreator(): void {
    const createContainer = document.querySelector('.create__container');
    const newCat = new AdminCategoryCard(0, '');

    createContainer?.before(newCat.element);
  }

  cancelCategoryUpdator(event: Event): void {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[1];

    if (!id) {
      this.closeCategoryCreator();
    } else {
      new AdminCategoryCard(id, '').cancelCategoryUpdator(id);
    }
  }

  closeCategoryCreator(): void {
    const parent = document.getElementById('adminCategory');
    const creator = document.getElementById('cat-0') as HTMLElement;
    parent?.removeChild(creator);
  }

  async submitCategoryUpdator(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[1];
    const currentName = document.getElementById(`title-${id}`)?.innerText;
    const input = document.getElementById(`update-input-${id}`) as HTMLInputElement;
    const newName = input.value;
    const newCat: ICategory = { id, name: newName };

    if (!newName) {
      this.showMessage(id, Message.addName);
      return;
    }

    if (newName === currentName) {
      this.showMessage(id, Message.nothingUpdate);
      return;
    }

    if (!id) {
      this.createNewCategory();
    } else {
      this.updateCategory(id);
      await this.api.updateCategory(newCat);
    }
  }

  updateCategory(id: number): void {
    const title = document.getElementById(`title-${id}`) as HTMLElement;
    const input = document.getElementById(`update-input-${id}`) as HTMLInputElement;

    title.innerText = input.value;
    new AdminCategoryCard(id, '').cancelCategoryUpdator(id);
  }

  async createNewCategory(): Promise<void> {
    const input = document.getElementById('update-input-0') as HTMLInputElement;
    if (!input.value) { return; }

    const isUnique = await this.isUniqueCategory(input.value);

    if (isUnique) {
      this.closeCategoryCreator();
      const newCat = { name: input.value } as ICategory;

      const created = await this.api.createCategory(newCat);
      this.showNewCatogory(created);
    } else {
      this.showMessage(0, Message.categoryExists);
    }
  }

  async isUniqueCategory(name: string): Promise<boolean> {
    let isUnique = true;
    const categories = await this.api.getCategories();

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === name) {
        isUnique = false;
        return isUnique;
      }
      isUnique = true;
    }

    return isUnique;
  }

  showNewCatogory(created: ICategory): void {
    const createContainer = document.querySelector('.create__container');
    const newCat = new AdminCategoryCard(created.id, created.name);

    createContainer?.before(newCat.element);
  }

  showMessage(id: number, text: string): void {
    const card = document.getElementById(`card-${id}`) as HTMLElement;
    const category = document.getElementById(`cat-${id}`) as HTMLElement;
    const message = new BaseComponent('div', ['card__message']);
    message.element.innerText = text;

    if (card) {
      card.append(message.element);
      setTimeout(() => {
        card.removeChild(message.element);
      }, 3000);
    }

    if (category) {
      category.append(message.element);
      setTimeout(() => {
        category.removeChild(message.element);
      }, 3000);
    }
  }

  checkActionToChangeCard(event: Event): void {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[2];
    const action = target.id.split('-')[1];

    if (action === Actions.remove) {
      this.removeCard(id);
    } else if (action === Actions.update) {
      this.openCardUpdator(id, true);
      this.addCurrentCardToState(id, true);
      this.listenLoadingChanging(id);
    } else {
      this.openCardCreator();
    }
  }

  openCardCreator(): void {
    const id = state.currentCategory;
    const createContainer = document.querySelector('.newcard__create');
    const openedCard = document.getElementById('card-0');
    const params: ICard = {
      id: 0,
      categoryId: id,
      word: '',
      translation: '',
      image: '',
      audio: '',
    };
    const newCard = new AdminCard(params);

    if (openedCard) { return; }

    createContainer?.before(newCard.element);
    this.listenLoadingChanging(0);
  }

  listenLoadingChanging(id: number): void {
    const image = document.getElementById(`image-input-${id}`) as HTMLImageElement;
    const sound = document.getElementById(`sound-input-${id}`) as HTMLImageElement;

    image.addEventListener('change', (e) => {
      e.preventDefault();
      this.showPreviewImage(e);
    });

    sound.addEventListener('change', (e) => {
      e.preventDefault();
      this.showPreviewSound(e);
    });
  }

  showPreviewImage(event: Event): void {
    const file = event.target as HTMLInputElement;
    const id = file.id.split('-')[2];
    const preview = document.getElementById(`preview-${id}`) as HTMLElement;
    const doneSvg = document.getElementById(`image-done-${id}`) as HTMLElement;
    const reader = new FileReader();

    reader.onloadend = () => {
      const resultString = reader.result as string;

      const img = new Image();
      img.src = resultString;
      img.id = `loaded-img-${id}`;
      img.className = 'loaded__img';

      preview.innerHTML = '';
      preview.append(img);
      doneSvg.classList.remove(CLASS_NONE);
    };

    if (file?.files && file.files[0]) {
      reader.readAsDataURL(file.files[0]);
    }
  }

  showPreviewSound(event: Event): void {
    const file = event.target as HTMLInputElement;
    const id = +file.id.split('-')[2];
    const doneSvg = document.getElementById(`sound-done-${id}`) as HTMLElement;
    const reader = new FileReader();

    reader.onloadend = () => {
      doneSvg.classList.remove(CLASS_NONE);
    };

    if (file?.files && file.files[0]) {
      reader.readAsDataURL(file.files[0]);
    }
  }

  removeCard(id: number): void {
    const parent = document.querySelector('.admin__container') as HTMLElement;
    const card = document.getElementById(`card-${id}`) as HTMLElement;
    parent?.removeChild(card);

    if (id) {
      this.api.removeCard(id);
    }
  }

  openCardUpdator(id: number, isBack: boolean): void {
    const front = document.getElementById(`word-front-${id}`) as HTMLElement;
    const back = document.getElementById(`word-back-${id}`) as HTMLElement;
    const preview = document.getElementById(`preview-${id}`) as HTMLElement;
    const imageDone = document.getElementById(`image-done-${id}`) as HTMLElement;
    const soundDone = document.getElementById(`sound-done-${id}`) as HTMLElement;

    if (isBack) {
      front.classList.add(CLASS_NONE);
      back.classList.remove(CLASS_NONE);
      imageDone.classList.add(CLASS_NONE);
      soundDone.classList.add(CLASS_NONE);
      preview.innerHTML = '';
    } else {
      front.classList.remove(CLASS_NONE);
      back.classList.add(CLASS_NONE);
    }
  }

  async addCurrentCardToState(id: number, needPush: boolean): Promise<void> {
    const card = await this.api.getCardById(id);

    if (needPush) {
      state.cards.push({
        id,
        categoryId: card.categoryId,
        word: card.word,
        translation: card.translation,
        image: '',
        audio: card.audio,
      });
    } else {
      for (let i = 0; i < state.cards.length; i++) {
        if (state.cards[i].id === id) {
          state.cards.splice(i, 1);
        }
      }
    }
  }

  closeCardUpdator(event: Event): void {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[2];

    if (!id) {
      this.removeCard(id);
    } else {
      this.openCardUpdator(id, false);
      this.addCurrentCardToState(id, false);
    }
  }

  async submitCardUpdator(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[2];
    event.preventDefault();

    if (!id) {
      this.checkNewWord();
    } else {
      if (this.needToUpdate(id)) {
        this.updateCard(event);
      } else {
        this.showMessage(id, Message.nothingUpdate);
      }
    }
  }

  async isUniqueWord(word: string): Promise<boolean> {
    let isUnique = true;
    const cards = await this.api.getCards();

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].word === word) {
        isUnique = false;
        return isUnique;
      }
      isUnique = true;
    }

    return isUnique;
  }

  async checkNewWord(): Promise<void> {
    const wordInput = document.getElementById('word-input-0') as HTMLInputElement;
    const translationInput = document.getElementById('translation-input-0') as HTMLInputElement;
    const word = wordInput.value;
    const translation = translationInput.value;

    if (!word || !translation) {
      this.showMessage(0, Message.wordAmpty);
      return;
    }

    const isUnique = await this.isUniqueWord(word);

    if (isUnique) {
      this.showNewCard();
    } else {
      this.showMessage(0, Message.wordExists);
    }
  }

  needToUpdate(id: number): boolean {
    let needToUpdate = false;
    const word = document.getElementById(`word-input-${id}`) as HTMLInputElement;
    const translation = document.getElementById(`translation-input-${id}`) as HTMLInputElement;
    const image = document.getElementById(`loaded-img-${id}`) as HTMLImageElement;
    const sound = document.getElementById(`sound-done-${id}`) as HTMLElement;

    let newWord = false;
    let newTranslation = false;
    let newSound = false;

    for (let i = 0; i < state.cards.length; i++) {
      if (id === state.cards[i].id) {
        if (word.value !== state.cards[i].word) {
          newWord = true;
        }

        if (translation.value !== state.cards[i].translation) {
          newTranslation = true;
        }

        if (!sound.classList.contains(CLASS_NONE)) {
          newSound = true;
        }
      }
    }

    if (newWord || newTranslation || image || newSound) {
      needToUpdate = true;
    }

    return needToUpdate;
  }

  async getImageSrc(id: number): Promise<string> {
    const card = await this.api.getCardById(id);

    return card.image;
  }

  async submitCardForm(event: Event | null): Promise<ILoaded | undefined> {
    event?.preventDefault();
    const target = event?.target as HTMLElement;
    let id = 0;

    if (event) {
      id = +target.id.split('-')[2];
    }

    const sound = document.getElementById(`sound-done-${id}`) as HTMLElement;

    let loadedSound: ILoaded;

    if (!sound.classList.contains(CLASS_NONE)) {
      loadedSound = await this.api.loadDataToServer(id);
      return loadedSound;
    }
  }

  async updateCard(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[2];
    const word = document.getElementById(`word-input-${id}`) as HTMLInputElement;
    const translation = document.getElementById(`translation-input-${id}`) as HTMLInputElement;
    const image = document.getElementById(`loaded-img-${id}`) as HTMLImageElement;
    const sound = document.getElementById(`sound-${id}`) as HTMLElement;
    const wordLabel = document.getElementById(`word-${id}`) as HTMLElement;
    const translationLabel = document.getElementById(`translation-${id}`) as HTMLElement;

    wordLabel.innerText = word.value;
    translationLabel.innerText = translation.value;

    let imageSrc = '';

    if (image && image.src) {
      const cardImage = document.getElementById(`card-image-${id}`) as HTMLImageElement;
      cardImage.src = image.src;
      imageSrc = image.src;
    } else {
      imageSrc = await this.getImageSrc(id);
    }

    const newSound = await this.submitCardForm(event);
    let audioSrc = '';

    if (newSound) { audioSrc = newSound.name; }

    let fullAudioSrc = '';

    if (!audioSrc) {
      for (let i = 0; i < state.cards.length; i++) {
        if (id === state.cards[i].id) {
          fullAudioSrc = state.cards[i].audio;
          audioSrc = fullAudioSrc.split('/').pop() as string;
        }
      }
    } else {
      fullAudioSrc = `${Endpoints.audioServerUrl}/${audioSrc}`;
    }

    sound.innerText = audioSrc;

    const newCard: ICard = {
      id,
      categoryId: state.currentCategory,
      word: word.value,
      translation: translation.value,
      image: imageSrc,
      audio: fullAudioSrc,
    };

    await this.api.updateCard(newCard);
    this.openCardUpdator(id, false);
  }

  async createNewCard(): Promise<ICard> {
    const word = document.getElementById('word-input-0') as HTMLInputElement;
    const translation = document.getElementById('translation-input-0') as HTMLInputElement;
    const image = document.getElementById('loaded-img-0') as HTMLImageElement;

    let imageSrc = PREVIEW_IMG;
    let audioSrc = './audio/error.mp3';

    if (image && image.src) {
      imageSrc = image.src;
    }

    const newSound = await this.submitCardForm(null);
    if (newSound) { audioSrc = `${Endpoints.audioServerUrl}/${newSound.name}`; }

    const card: ICard = {
      id: 0,
      categoryId: state.currentCategory,
      word: word.value,
      translation: translation.value,
      image: imageSrc,
      audio: audioSrc,
    };

    const created = await this.api.createCard(card);
    return created;
  }

  async showNewCard(): Promise<void> {
    const createContainer = document.querySelector('.newcard__create');
    const card: ICard = await this.createNewCard();
    const newCard = new AdminCard(card);

    this.removeCard(0);
    createContainer?.before(newCard.element);
  }
}
