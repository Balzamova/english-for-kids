import './css/header-admin.css';
import BaseComponent from '../base-component';

export default class HeaderAdmin extends BaseComponent {
  menu = new BaseComponent('div', ['header__menu-admin']);

  categories = new BaseComponent('span', ['header__admin_span', 'header-categories', 'active']);

  words = new BaseComponent('span', ['header__admin_span', 'header-cards']);

  logout = new BaseComponent('button', ['header__admin_btn', 'logout']);

  constructor() {
    super('div', ['header__container']);
    this.renderMenu();
  }

  renderMenu(): void {
    this.logout.element.innerText = 'logout';
    this.categories.element.innerText = 'categories';
    this.words.element.innerText = 'words';

    this.menu.element.append(this.categories.element);
    this.menu.element.append(this.words.element);

    this.element.append(this.menu.element);
    this.element.append(this.logout.element);
  }
}
