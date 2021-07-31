import BaseComponent from '../base-component';
import './css/burger.css';

export default class Burger extends BaseComponent {
  span = new BaseComponent('span', ['burger__span']);

  constructor() {
    super('div', ['burger']);

    this.element.append(this.span.element);
  }

  toggle(): void {
    const list = document.querySelector('.header__list') as HTMLElement;

    this.element.classList.toggle('active');
    list.classList.toggle('active');
  }

  close(): void {
    const list = document.querySelector('.header__list') as HTMLElement;
    this.element.classList.remove('active');
    list.classList.remove('active');
  }
}
