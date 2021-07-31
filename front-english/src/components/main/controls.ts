import './css/controls.css';
import BaseComponent from '../base-component';
import { state } from '../constants/state';

export default class Controls extends BaseComponent {
  start = new BaseComponent('button', ['start', 'none']);

  repeat = new BaseComponent('button', ['repeat', 'none']);

  constructor() {
    super('div', ['btns']);

    this.start.element.innerText = 'start';

    this.element.append(this.start.element);
    this.element.append(this.repeat.element);

    this.switchStart();
  }

  checkBtn(): HTMLElement {
    const startBtn = document.querySelector('.start') as HTMLElement;
    let btn: HTMLElement;

    if (startBtn) {
      btn = startBtn;
    } else {
      btn = this.start.element;
    }

    return btn;
  }

  toggle(): void {
    const startBtn = document.querySelector('.start') as HTMLElement;
    const repeatBtn: HTMLElement = document.querySelector('.repeat') as HTMLElement;

    startBtn.classList.toggle('none');
    repeatBtn.classList.toggle('none');
  }

  switchStart(): void {
    const btn = this.checkBtn();

    if (btn && state.playState) {
      btn.classList.remove('none');
    }

    if (btn && !state.playState) {
      btn.classList.add('none');
    }

    const repeatBtn: HTMLElement | null = document.querySelector('.repeat');

    if (repeatBtn) {
      repeatBtn.classList.add('none');
    }
  }
}
