import './style.css';
import BaseComponent from './components/base-component';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Main from './components/main/main';
import Controls from './components/main/controls';
import Container from './components/main/container';
import Rating from './components/main/rating';
import RestApi from './api';
import { pages } from './components/constants/pages';
import { state } from './components/constants/state';
import { Actions } from './components/constants/actions';
import Loading from './components/main/loading';
import { Message } from './components/constants/user-message';
import IUser from './components/models/IUser';

const CLASS_ACTIVE = 'active';

export default class App {
  private readonly baseWrapper = new BaseComponent('div', ['wrapper']);

  private loading = new Loading();

  private readonly header = new Header();

  private main = new Main();

  private readonly footer = new Footer();

  private readonly controls = new Controls();

  private readonly container = new Container(0);

  api = new RestApi();

  constructor(private readonly rootElement: Element) {
    this.rootElement.appendChild(this.baseWrapper.element);

    this.addLoaderElement();
  }

  async addLoaderElement(): Promise<void> {
    this.baseWrapper.element.append(this.loading.element);
    await this.api.getCategories();

    setTimeout(() => {
      this.addComponents();
    }, 1000);
  }

  destroyLoadingSpinner(): void {
    const loading = document.querySelector('.loading') as HTMLElement;
    if (this.baseWrapper.element.contains(loading)) {
      this.baseWrapper.element.removeChild(loading);
    }
  }

  addComponents(): void {
    state.isAppLoaded = true;
    this.destroyLoadingSpinner();
    this.baseWrapper.element.append(this.header.element);
    this.baseWrapper.element.append(this.main.element);
    this.baseWrapper.element.append(this.footer.element);

    this.header.list.renderMenu();
    this.main.createPage(pages.main.id);
    this.main.page.addMainPage();

    this.listenMainHeader();
    this.listenEndGame();
    this.listenAdminPage();
  }

  listenMainHeader(): void {
    this.baseWrapper.element.addEventListener('click', (event) => {
      const elem = event.target as HTMLDivElement;

      if (elem.classList.contains('burger')) {
        this.header.burger.toggle();
      } else if (!elem.classList.contains('header__list')) {
        if (!state.isAdminPage) {
          this.header.burger.close();
        }
      }

      if (
        elem.classList.contains('switcher')
        || elem.classList.contains('switch')
        || elem.classList.contains('switch__title')
      ) {
        state.playState = !state.playState;
        this.header.switcher.switch();
        this.controls.switchStart();
        this.container.cardField.toggleCardsInfo(state.playState);

        if (state.gameActive) {
          new Rating().removeStars();
          this.container.hideImage(false);
          state.gameActive = false;
        }
      }

      if (
        elem.classList.contains('header__item')
        || elem.classList.contains('main__card')
        || elem.classList.contains('main__card-img')
        || elem.classList.contains('main__card-title')
      ) {
        this.header.list.activateMenuItem(event);
        this.checkPageToCreate(event);
        this.container.cardField.toggleCardsInfo(state.playState);
      }
    });
  }

  listenAdminPage(): void {
    this.baseWrapper.element.addEventListener('click', (event) => {
      const elem = event.target as HTMLDivElement;

      if (elem.classList.contains('logout')) {
        state.isAdminPage = false;
        this.activateAdminHeaderItem(true);
        this.header.destroyHeader();
        this.checkPageToCreate(event);
        this.header.list.renderMenu();
        this.header.list.activateMenuItem(null);
      }

      if (elem.classList.contains('admin__back')) {
        this.checkPageToCreate(event);
        this.activateAdminHeaderItem(true);
      }

      if (elem.classList.contains('cat__add')) {
        const target = event.target as HTMLElement;
        const id = +target.id.split('-')[1];
        state.currentCategory = id;
        this.openWordsPage(id);
      }

      if (elem.classList.contains('play__btn')) {
        this.playSound(event);
      }
    });
  }

  openAuthModal(): void {
    this.main.addAuthPage();
    this.listenAuthForm();
  }

  listenAuthForm(): void {
    this.baseWrapper.element.addEventListener('click', (event) => {
      const elem = event.target as HTMLDivElement;

      if (elem.classList.contains('auth-enter')) {
        this.checkLoginData(event);
      }

      if (elem.classList.contains('auth-registry')) {
        this.checkLoginData(event);
      }

      if (elem.classList.contains('auth-cancel')) {
        state.needRegistry = false;
        this.main.destroyAuthPage();
      }
    });
  }

  checkLoginData(event: Event): void {
    const login = document.getElementById('auth-login') as HTMLInputElement;
    const password = document.getElementById('auth-password') as HTMLInputElement;

    if (!login.value || !password.value) {
      this.main.showMessage(Message.loginEmpty, true);
      this.listenAuthForm();
    } else {
      const user: IUser = { email: login.value, login: login.value, password: password.value };
      this.checkAction(event, user);
    }
  }

  checkAction(event: Event, user: IUser): void {
    const target = event.target as HTMLElement;

    if (target.innerText.toLowerCase() === Actions.enter) {
      this.checkUser(event, user);
    } else {
      this.createUser(user);
    }
  }

  async createUser(user: IUser): Promise<void> {
    const loading = new Loading();
    this.baseWrapper.element.append(loading.element);

    const answer = await this.api.loginHandler(user);

    if (answer.message === Message.userCreated) {
      this.switchAuthModals(Message.userCreated, false);
    } else {
      this.main.showMessage(answer.message, true);
      this.listenAuthForm();
    }

    setTimeout(() => {
      this.destroyLoadingSpinner();
    }, 200);
  }

  switchAuthModals(message: string, isRegistry: boolean): void {
    state.needRegistry = isRegistry;
    this.main.showMessage(message, isRegistry);
    this.main.destroyAuthPage();
  }

  async checkUser(event: Event, user: IUser): Promise<void> {
    const loading = new Loading();
    this.baseWrapper.element.append(loading.element);

    const answer = await this.api.loginHandler(user);

    if (answer.userId) {
      this.openAdminPage(event);
      this.main.showMessage(Message.welcome, false);
    } else if (answer.message === Message.passwordIncorrect) {
      this.main.showMessage(Message.passwordIncorrect, true);
      this.listenAuthForm();
    } else {
      this.switchAuthModals(Message.userNotFound, true);
      this.openAuthModal();
    }

    setTimeout(() => {
      this.destroyLoadingSpinner();
    }, 200);
  }

  openAdminPage(event: Event): void {
    state.isAdminPage = true;
    this.main.destroyAuthPage();
    this.header.destroyHeader();
    this.checkPageToCreate(event);
  }

  checkPageToCreate(event: Event): void {
    const target = event.target as HTMLElement;
    const text = target.innerText.toLowerCase();
    let inner = '';

    if (!text) {
      inner = target.dataset.category as string;
    } else if (text === Actions.logout) {
      inner = pages.main.name;
    } else if (text === Actions.back || text === Actions.enter) {
      inner = pages.adminCategory.name;
    } else {
      inner = target.innerText;
    }

    if (text === Actions.login) {
      this.openAuthModal();
    } else {
      this.main.destroyPage();
      this.createNewPage(inner);
    }
  }

  async createNewPage(inner: string): Promise<void> {
    if (inner === pages.main.name) {
      this.main.createPage(pages.main.id);
      this.main.page.addMainPage();
    } else if (inner === pages.adminCategory.name) {
      this.main.createPage(pages.adminCategory.id);
      this.main.page.addAdminCategoryPage();
    } else {
      const id = await this.checkCategoryId(inner);

      if (id) {
        state.currentCategory = id;
        this.main.createPage(pages.category.id);
        this.main.page.addCategoryPage(id);
      }
    }
  }

  async checkCategoryId(inner: string): Promise<number> {
    const categories = await this.api.getCategories();
    let id = 0;

    for (let i = 0; i < categories.length; i++) {
      if (inner === categories[i].name) {
        id = categories[i].id;
        return id;
      }
    }

    return id;
  }

  listenEndGame(): void {
    document.addEventListener('finish', this.showMainPage, false);
  }

  showMainPage(): void {
    const main = new Main();
    main.destroyPage();
    main.createPage(pages.main.id);
    main.page.addMainPage();

    const headers = document.querySelectorAll('.header__item');
    headers.forEach((item) => {
      item.classList.remove(CLASS_ACTIVE);
    });

    const item = document.querySelector('.header__item');
    item?.classList.add(CLASS_ACTIVE);
  }

  activateAdminHeaderItem(isCategories: boolean): void {
    const categories = document.querySelector('.header-categories') as HTMLElement;
    const words = document.querySelector('.header-cards') as HTMLElement;

    if (isCategories) {
      categories.classList.add(CLASS_ACTIVE);
      words.classList.remove(CLASS_ACTIVE);
    } else {
      categories.classList.remove(CLASS_ACTIVE);
      words.classList.add(CLASS_ACTIVE);
    }
  }

  openWordsPage(id: number): void {
    this.main.destroyPage();
    this.main.createPage(pages.adminCard.id);
    this.main.page.addAdminCardsPage(id);
    this.activateAdminHeaderItem(false);
  }

  async getAudioUrl(id: number): Promise<string> {
    const card = await this.api.getCardById(id);
    return card.audio;
  }

  async playSound(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const id = +target.id.split('-')[1];
    const url = await this.getAudioUrl(id);

    if (!url) {
      this.container.playEffect(false);
    }

    this.container.playAudio(url);
  }
}
