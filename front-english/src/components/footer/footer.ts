import './css/footer.css';
import BaseComponent from '../base-component';

export default class Footer extends BaseComponent {
  constructor() {
    super('footer', ['footer']);

    const footer = `
      <ul class='footer__list'>
        <li class='footer__item'>
          <a class='footer__link' href='https://docs.rs.school/' target='blank'>
            © Rolling Scopes School
          </a>
        </li>
        <li class='footer__item'>
          <a class='footer__link' href='https://github.com/Balzamova' target='blank'>
            © Anastasiia Balzamova
          </a>
        </li>
      </ul>
    `;

    this.element.insertAdjacentHTML('afterbegin', footer);
  }
}
