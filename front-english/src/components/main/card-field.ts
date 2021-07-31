import './css/card.css';
import BaseComponent from '../base-component';
import Card from './card';
import RestApi from '../../api';
import { state } from '../constants/state';

export default class CardField extends BaseComponent {
  api = new RestApi();

  constructor(id: number) {
    super('div', ['card__field']);
    this.createCards(id);
  }

  async createCards(id: number): Promise<void> {
    const cards = await this.api.getCards();
    const cardArray: Card[] = [];

    for (let i = 0; i < cards.length; i++) {
      if (id === cards[i].categoryId) {
        const url = `${cards[i].image}`;
        const card = new Card(url, cards[i].word, cards[i].translation);
        cardArray.push(card);
      }
    }

    cardArray.forEach((card) => {
      this.element.append(card.element);
    });

    this.toggleCardsInfo(state.playState);
  }

  toggleCardsInfo(isPlayState: boolean): void {
    const titles = document.querySelectorAll('.card__title-front');
    const btns = document.querySelectorAll('.card__btn');

    if (isPlayState) {
      titles.forEach((title) => {
        title.classList.add('none');
      });

      btns.forEach((btn) => {
        btn.classList.add('none');
      });
    } else {
      titles.forEach((title) => {
        title.classList.remove('none');
      });

      btns.forEach((btn) => {
        btn.classList.remove('none');
      });
    }
  }
}
