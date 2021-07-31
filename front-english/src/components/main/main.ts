import './css/auth-container.css';
import BaseComponent from '../base-component';
import AuthContainer from './auth-container';
import Page from './page';

export default class Main extends BaseComponent {
  page = new Page('');

  auth = new AuthContainer();

  message = new BaseComponent('div', ['auth__message']);

  constructor() {
    super('main', ['main']);
  }

  createPage(id: string): void {
    this.page = new Page(id);
    const main = document.querySelector('.main') as HTMLElement;
    main.append(this.page.element);
  }

  destroyPage(): void {
    const child = document.querySelector('.page');
    child?.parentNode?.removeChild(child);
  }

  addAuthPage(): void {
    const auth = new AuthContainer();
    this.element.append(auth.element);
  }

  destroyAuthPage(): void {
    const child = document.querySelector('.auth__container');
    child?.parentNode?.removeChild(child);
  }

  showMessage(inner: string, isError: boolean): void {
    if (isError) {
      this.message.element.classList.add('error');
    } else {
      this.message.element.classList.remove('error');
    }

    this.message.element.innerHTML = inner;
    this.element.append(this.message.element);

    setTimeout(() => {
      this.message.element.parentNode?.removeChild(this.message.element);
    }, 4000);
  }
}
