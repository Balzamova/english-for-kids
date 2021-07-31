import './css/main-card.css';
import BaseComponent from '../base-component';
import RestApi from '../../api';

export default class MainCard extends BaseComponent {
  image = '';

  title = '';

  api = new RestApi();

  constructor(id: number) {
    super('div', ['main__card']);

    this.addComponents(id);
  }

  async addComponents(id: number): Promise<void> {
    const categories = await this.api.getCategories();
    let category = '';

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        category = categories[i].name;
      }
    }

    const url = await this.checkUrl(id);

    this.image = `
      <img
        src='${url}'
        class='main__card-img'
        alt='${category}'
        data-category='${category}'/>
    `;

    this.title = `
      <h5 class='main__card-title' data-category='${category}'>${category}</h5>
    `;

    this.element.dataset.category = category;

    this.element.insertAdjacentHTML('afterbegin', this.image);
    this.element.insertAdjacentHTML('beforeend', this.title);
  }

  async checkUrl(id: number): Promise<string> {
    const cards = await this.api.getCards();
    let url = '';

    for (let i = 0; i < cards.length; i++) {
      if (id === cards[i].categoryId) {
        url = cards[i].image;
        return url;
      }
    }

    return url;
  }
}
