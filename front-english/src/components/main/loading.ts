import './css/loader.css';
import BaseComponent from '../base-component';
import { state } from '../constants/state';

export default class Loading extends BaseComponent {
  loader = new BaseComponent('div', ['loader']);

  constructor() {
    super('div', ['loading']);

    this.element.innerText = '';

    if (!state.isAppLoaded) {
      this.element.innerText = 'Loading...';
    }

    this.element.append(this.loader.element);
  }
}
