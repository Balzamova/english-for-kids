import './css/switcher.css';
import BaseComponent from '../base-component';
import { Modes } from '../constants/modes';
import { state } from '../constants/state';

export default class Switcher extends BaseComponent {
  switcher = new BaseComponent('div', ['switch']);

  title = new BaseComponent('div', ['switch__title']);

  constructor() {
    super('div', ['switcher']);

    this.title.element.innerText = Modes.train;

    this.element.append(this.switcher.element);
    this.element.append(this.title.element);
  }

  switch(): void {
    if (state.playState) {
      this.title.element.innerText = Modes.play;
    } else {
      this.title.element.innerText = Modes.train;
    }

    this.switcher.element.classList.toggle('active');
    this.title.element.classList.toggle('active');

    const body = document.querySelector('body');
    body?.classList.toggle('play');
  }
}
