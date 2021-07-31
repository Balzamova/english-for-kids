import './css/admin-category-card.css';
import BaseComponent from '../base-component';
import RestApi from '../../api';

export default class AdminCategoryCard extends BaseComponent {
  remove = new BaseComponent('div', ['cat__remove']);

  title = new BaseComponent('h1', ['cat__title']);

  words = new BaseComponent('h2', ['cat__words']);

  buttons = new BaseComponent('div', ['cat__buttons']);

  update = new BaseComponent('button', ['cat__update']);

  add = new BaseComponent('button', ['cat__add']);

  cancel = new BaseComponent('button', ['cat__cancel', 'none']);

  create = new BaseComponent('button', ['cat__create', 'none']);

  label = new BaseComponent('label', ['update-label', 'none']);

  input = new BaseComponent('input', ['update-input', 'none']);

  api = new RestApi();

  constructor(id: number, name: string) {
    super('div', ['cat__container']);

    this.addElements(id, name);
  }

  async addElements(id: number, name: string): Promise<void> {
    const length = await this.checkLength(id);

    this.element.id = `cat-${id}`;
    this.remove.element.id = `remove-${id}`;
    this.title.element.id = `title-${id}`;
    this.title.element.innerText = name;
    this.words.element.id = `words-${id}`;
    this.words.element.innerHTML = `Words: <span class="cat__count">${length}</span>`;
    this.update.element.id = `update-${id}`;
    this.update.element.innerText = 'Update';
    this.add.element.id = `add-${id}`;
    this.add.element.innerText = 'Add word';
    this.cancel.element.id = `cancel-${id}`;
    this.cancel.element.innerText = 'Cancel';
    this.create.element.id = `create-${id}`;
    this.create.element.innerText = 'Create';
    this.label.element.innerText = 'Category Name:';
    this.label.element.id = `update-label-${id}`;
    this.input.element.id = `update-input-${id}`;

    this.buttons.element.append(this.update.element);
    this.buttons.element.append(this.add.element);
    this.buttons.element.append(this.cancel.element);
    this.buttons.element.append(this.create.element);

    this.element.append(this.remove.element);
    this.element.append(this.title.element);
    this.element.append(this.words.element);
    this.element.append(this.label.element);
    this.element.append(this.input.element);
    this.element.append(this.buttons.element);

    if (!id) { this.openCategoryCreator(); }
  }

  async checkLength(id: number): Promise<number> {
    const cards = await this.api.getCards();
    let length = 0;

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].categoryId === id) {
        length++;
      }
    }

    return length;
  }

  openCategoryUpdator(id: number, value: string): void {
    const title = document.getElementById(`title-${id}`) as HTMLElement;
    const remove = document.getElementById(`remove-${id}`) as HTMLElement;
    const words = document.getElementById(`words-${id}`) as HTMLElement;
    const update = document.getElementById(`update-${id}`) as HTMLElement;
    const add = document.getElementById(`add-${id}`) as HTMLElement;
    const cancel = document.getElementById(`cancel-${id}`) as HTMLElement;
    const create = document.getElementById(`create-${id}`) as HTMLElement;
    const label = document.getElementById(`update-label-${id}`) as HTMLElement;
    const input = document.getElementById(`update-input-${id}`) as HTMLInputElement;

    title.classList.add('none');
    remove.classList.add('none');
    words.classList.add('none');
    update.classList.add('none');
    add.classList.add('none');
    cancel.classList.remove('none');
    create.classList.remove('none');
    label.classList.remove('none');
    input.classList.remove('none');

    input.value = value;
  }

  cancelCategoryUpdator(id: number): void {
    const title = document.getElementById(`title-${id}`) as HTMLElement;
    const remove = document.getElementById(`remove-${id}`) as HTMLElement;
    const words = document.getElementById(`words-${id}`) as HTMLElement;
    const update = document.getElementById(`update-${id}`) as HTMLElement;
    const add = document.getElementById(`add-${id}`) as HTMLElement;
    const cancel = document.getElementById(`cancel-${id}`) as HTMLElement;
    const create = document.getElementById(`create-${id}`) as HTMLElement;
    const label = document.getElementById(`update-label-${id}`) as HTMLElement;
    const input = document.getElementById(`update-input-${id}`) as HTMLInputElement;

    title.classList.remove('none');
    remove.classList.remove('none');
    words.classList.remove('none');
    update.classList.remove('none');
    add.classList.remove('none');

    cancel.classList.add('none');
    create.classList.add('none');
    label.classList.add('none');
    input.classList.add('none');
  }

  openCategoryCreator(): void {
    this.title.element.classList.add('none');
    this.remove.element.classList.add('none');
    this.words.element.classList.add('none');
    this.update.element.classList.add('none');
    this.add.element.classList.add('none');
    this.cancel.element.classList.remove('none');
    this.create.element.classList.remove('none');
    this.label.element.classList.remove('none');
    this.input.element.classList.remove('none');
  }
}
