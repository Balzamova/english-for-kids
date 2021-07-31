import './css/header.css';
import BaseComponent from '../base-component';

export default class HeaderItem extends BaseComponent {
  constructor() {
    super('li', ['header__item']);
  }
}
