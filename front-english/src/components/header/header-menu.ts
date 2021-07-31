import './css/header.css';
import BaseComponent from '../base-component';
import HeaderItem from './header-item';
import RestApi from '../../api';
import ICategory from '../models/ICategory';

const ACTIVE_CLASS = 'active';

export default class HeaderList extends BaseComponent {
  api = new RestApi();

  loginBtn = new BaseComponent('li', ['header__item', 'header_login']);

  constructor() {
    super('ul', ['header__list']);
  }

  clearMenu(): void {
    const children = document.querySelectorAll('.header__item');

    if (children) {
      children.forEach((child) => {
        child.parentNode?.removeChild(child);
      });
    }
  }

  async renderMenu(): Promise<void> {
    this.clearMenu();
    const categories: ICategory[] = await this.api.getCategories();

    const mainItem = new HeaderItem();
    mainItem.element.innerText = 'Main page';

    const items: HeaderItem[] = [mainItem];
    const count = categories.length;

    for (let i = 0; i < count; i++) {
      const item = new HeaderItem();
      item.element.innerText = categories[i].name;

      items.push(item);
    }

    items.forEach((el) => {
      this.element.append(el.element);
    });

    this.loginBtn.element.innerText = 'Login';

    this.element.append(this.loginBtn.element);

    this.activateMenuItem(null);
  }

  async activateMenuItem(event: Event | null): Promise<void> {
    const items = document.querySelectorAll('.header__item');

    items.forEach((item) => {
      item.classList.remove(ACTIVE_CLASS);
    });

    if (!event) {
      const item = document.querySelector('.header__item');
      item?.classList.add(ACTIVE_CLASS);
    } else {
      const item = await this.getItem(event);
      item.classList.add(ACTIVE_CLASS);
    }
  }

  async getIndex(category: string): Promise<number> {
    const categories: ICategory[] = await this.api.getCategories();
    let index = 0;

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === category) {
        index = i;
      }
    }

    return index;
  }

  async getItem(event: Event): Promise<HTMLElement> {
    const target = event.target as HTMLElement;
    let item: HTMLElement;

    if (target.classList.contains('header__item')) {
      item = target;
    } else {
      const category = target.dataset.category as string;
      const index: number = await this.getIndex(category);
      const items = document.querySelectorAll('.header__item');

      item = items[index + 1] as HTMLElement;
    }

    return item;
  }

  toggleList(): void {
    this.element.classList.toggle(ACTIVE_CLASS);
  }
}
