import BaseComponent from '../base-component';
import Controls from './controls';
import CardField from './card-field';
import Rating from './rating';
import { Effects } from '../constants/effects';
import { state } from '../constants/state';
import { pages } from '../constants/pages';
import Main from './main';
import RestApi from '../../api';

export default class Container extends BaseComponent {
  buttons = new Controls();

  rating = new Rating();

  cardField: CardField;

  audio: HTMLAudioElement = new Audio();

  effect: HTMLAudioElement = new Audio();

  api = new RestApi();

  constructor(id: number) {
    super('div', ['container']);

    this.audio.classList.add('audio');
    this.audio.classList.add('effect');

    this.cardField = new CardField(id);

    this.element.append(this.buttons.element);
    this.element.append(this.rating.element);
    this.element.append(this.cardField.element);
    this.element.append(this.audio);
    this.element.append(this.effect);
  }

  async getArrayToPlay(): Promise<number[]> {
    const cards = await this.api.getCards();
    let length = 0;

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].categoryId === state.currentCategory) {
        length++;
      }
    }

    const array: number[] = [];

    for (let i = 0; i < length; i++) {
      array.push(i);
    }

    return array;
  }

  async getRandomArray(): Promise<number[]> {
    const arr: number[] = await this.getArrayToPlay();
    let j;
    let temp;

    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }

    return arr;
  }

  async repeatSound(): Promise<void> {
    const url = state.cards[state.index].audio;
    this.playAudio(url);
  }

  playEffect(success: boolean): void {
    let good = '';
    let bad = '';

    if (state.endGame) {
      good = Effects.success;
      bad = Effects.failure;
    } else {
      good = Effects.correct;
      bad = Effects.error;
    }

    if (success) {
      this.effect.src = good;
    } else {
      this.effect.src = bad;
    }

    const playPromise = this.effect.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.checkErrors(success);
      })
        .catch();
    }
  }

  playAudio(url: string): void {
    this.audio.src = `${url}`;
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.clickAnswer();
      })
        .catch(() => {
        });
    }
  }

  trainAudio(url: string): void {
    this.audio.src = `${url}`;
    this.audio.play();
  }

  train(event: Event): void {
    const target = event.target as HTMLImageElement;
    let name;

    if (!target.alt) {
      name = (target.children[0] as HTMLImageElement).alt;
    } else {
      name = target.alt;
    }

    let index = 0;

    for (let i = 0; i < state.cards.length; i++) {
      if (state.cards[i].word === name) {
        index = i;
      }
    }

    const url = state.cards[index].audio;
    this.trainAudio(url);
  }

  flippToBack(event: Event): void {
    const target = event.target as HTMLDivElement;
    const name = target.dataset.name as string;

    this.flipp(name, true);
  }

  flippToFront(name: string): void {
    const element = document.querySelector(`#${name}`) as HTMLDivElement;

    element.addEventListener('mouseleave', () => {
      element.classList.remove('flipped');
    });
  }

  flipp(name: string, isFlipped: boolean): void {
    const elemsToFlip = document.querySelectorAll(`.${name}`);

    elemsToFlip.forEach((el) => {
      if (isFlipped) {
        el.classList.add('flipped');
      } else {
        el.classList.remove('flipped');
      }
    });

    this.flippToFront(name);
  }

  playGame(): void {
    state.index = state.randomArray[state.randomArray.length - 1] as number;
    const url = state.cards[state.index].audio;

    this.playAudio(url);
  }

  clickAnswer(): void {
    const field = document.querySelector('.card__field') as HTMLDivElement;

    field.addEventListener('click', (event) => {
      this.compareCards(event);
    });
  }

  compareCards(event: Event): void {
    const elem = event.target as HTMLImageElement;
    const clicked = elem.alt;

    if (!state.gameActive) { return; }

    if (!elem.classList.contains('hide')) {
      if (state.cards[state.index].word === clicked) {
        state.randomArray.pop();
        this.playEffect(true);
        this.hideImage(true);
      } else {
        this.playEffect(false);
      }
    }
  }

  checkErrors(success: boolean): void {
    if (!success) {
      state.errors++;
    }

    this.addStar(success);
  }

  addStar(success: boolean): void {
    this.rating.addRatingStar(success);
  }

  hideImage(needHide: boolean): void {
    const images = document.querySelectorAll('.card__img-front');
    const ind = state.index % images.length;
    const image = images[ind];

    if (needHide) {
      image.classList.add('hide');
      this.checkFinish();
    } else {
      images.forEach((el) => {
        el.classList.remove('hide');
      });
    }
  }

  checkFinish(): void {
    if (!state.randomArray.length) {
      this.gameFinish();
    } else {
      setTimeout(() => {
        this.playGame();
      }, 1000);
    }
  }

  gameFinish(): void {
    state.endGame = true;

    if (state.errors) {
      this.playEffect(false);
    } else {
      this.playEffect(true);
    }

    this.showFinalPicture();
  }

  showFinalPicture(): void {
    state.gameActive = false;
    const main = new Main();

    main.destroyPage();
    main.createPage(pages.endGame.id);

    if (state.errors) {
      main.page.addFinalPage(false);
    } else {
      main.page.addFinalPage(true);
    }

    setTimeout(() => {
      const myEvent = new CustomEvent('finish', { bubbles: true, composed: true });
      document.dispatchEvent(myEvent);
    }, 4000);
  }
}
