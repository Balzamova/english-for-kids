import BaseComponent from '../base-component';
import { state } from '../constants/state';
import Container from '../main/container';
import Controls from '../main/controls';
import Burger from './burger';
import HeaderAdmin from './header-admin';
import HeaderList from './header-menu';
import Switcher from './switcher';

export default class Header extends BaseComponent {
  headerContainer = new BaseComponent('div', ['header__container']);

  menu = new BaseComponent('div', ['header__menu']);

  burger = new Burger();

  list = new HeaderList();

  switcher = new Switcher();

  headerAdmin = new HeaderAdmin();

  controls = new Controls();

  container = new Container(0);

  title = new BaseComponent('h1', ['header__title']);

  constructor() {
    super('header', ['header']);

    this.destroyHeader();
  }

  destroyHeader(): void {
    const child = document.querySelector('.header__container');
    child?.parentNode?.removeChild(child);

    if (state.isAdminPage) {
      this.addHeaderAdmin();
    } else {
      this.addHeaderMain();
    }
  }

  addHeaderMain(): void {
    this.title.element.innerText = 'English for kids';
    this.element.classList.remove('admin');

    this.element.append(this.headerContainer.element);

    this.headerContainer.element.append(this.menu.element);
    this.headerContainer.element.append(this.title.element);
    this.headerContainer.element.append(this.switcher.element);

    this.menu.element.append(this.burger.element);
    this.menu.element.append(this.list.element);
  }

  addHeaderAdmin(): void {
    this.element.classList.add('admin');
    this.element.append(this.headerAdmin.element);
  }
}
