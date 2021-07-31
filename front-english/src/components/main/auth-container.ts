import './css/auth-container.css';
import BaseComponent from '../base-component';
import { state } from '../constants/state';
import { Actions } from '../constants/actions';

export default class AuthContainer extends BaseComponent {
  constructor() {
    super('div', ['auth__container']);

    this.createAuthWindow();
  }

  createAuthWindow(): void {
    let header = '';
    let button = '';
    let placeholderLogin = '';
    let placeholderPassword = '';

    if (state.needRegistry) {
      header = Actions.registry;
      button = Actions.registry;
      placeholderLogin = 'your new login';
      placeholderPassword = 'your new password';
    } else {
      header = Actions.login;
      button = Actions.enter;
      placeholderLogin = 'admin';
      placeholderPassword = 'admin';
    }

    this.element.innerHTML = `
      <form class="auth__form">
        <h2 class="auth__header">${header}</h2>
        <label class="auth__label">Enter login
          <input 
            type="text"
            id="auth-login"
            class="auth__input"
            placeholder="${placeholderLogin}">
        </label>
        <label class="auth__label">Enter password
          <input 
            type="password"
            id="auth-password"
            class="auth__input"
            placeholder="${placeholderPassword}">
        </label>

        <div class="auth__footer">
          <button class="auth__btn auth-cancel">Cancel</button>
          <button type="submit" class="auth__btn auth-${button}">${button}</button>
        </div>
      </form>
    `;

    this.element.addEventListener('click', (event) => event.preventDefault());
  }
}
