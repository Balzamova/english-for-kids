import './css/admin-card.css';
import BaseComponent from '../base-component';
import RestApi from '../../api';
import ICard from '../models/ICard';

export default class AdminCard extends BaseComponent {
  remove = new BaseComponent('div', ['card__remove']);

  front = new BaseComponent('div', ['card__front']);

  back = new BaseComponent('div', ['card__back', 'none']);

  word = new BaseComponent('h2', ['admin__card_name', 'title']);

  translation = new BaseComponent('h2', ['admin__card_name', 'title']);

  sound = new BaseComponent('h2', ['admin__card_name', 'title']);

  image = new BaseComponent('div', ['admin__card_name', 'title']);

  update = new BaseComponent('button', ['card__update']);

  wordLabel = new BaseComponent('label', ['admin__card_label']);

  wordInput = document.createElement('input') as HTMLInputElement;

  translationLabel = new BaseComponent('label', ['admin__card_label']);

  translationInput = document.createElement('input') as HTMLInputElement;

  soundLabel = new BaseComponent('div', ['admin__card_label', 'load']);

  soundBtn = new BaseComponent('label', ['admin__card_load']);

  soundInput = document.createElement('input') as HTMLInputElement;

  imageLabel = new BaseComponent('div', ['admin__card_label', 'load']);

  imageBtn = new BaseComponent('label', ['admin__card_load']);

  imageInput = document.createElement('input') as HTMLInputElement;

  buttons = new BaseComponent('div', ['buttons']);

  cancel = new BaseComponent('button', ['card__cancel']);

  create = new BaseComponent('button', ['card__create']);

  preview = new BaseComponent('div', ['preview']);

  api = new RestApi();

  constructor(params: ICard) {
    super('div', ['admin__card']);

    this.initMainElements(params);
  }

  initMainElements(params: ICard): void {
    this.element.id = `card-${params.id}`;
    this.front.element.id = `word-front-${params.id}`;
    this.back.element.id = `word-back-${params.id}`;

    this.remove.element.id = `card-remove-${params.id}`;

    this.word.element.id = `word-title-${params.id}`;
    this.word.element.innerHTML = `Word:
      <span id="word-${params.id}">${params.word}</span>
    `;

    this.translation.element.id = `translation-title-${params.id}`;
    this.translation.element.innerHTML = `Translation:
      <span id="translation-${params.id}">${params.translation}</span>
    `;

    this.sound.element.id = `sound-title-${params.id}`;
    this.sound.element.innerHTML = `Sound:
      <div id="sound-${params.id}" class="sound__text">${this.getAudioName(params.audio)}</div>
      <div id="play-${params.id}" class="play__btn"></div>
    `;

    this.image.element.id = `image-title-${params.id}`;
    this.image.element.innerHTML = `Image:
        <img
          id="card-image-${params.id}"
          class="admin__card_img"
          src="${params.image}"
          alt="${params.word}"
      />
    `;

    this.initCreatingElements(params);
  }

  initCreatingElements(params: ICard): void {
    this.wordLabel.element.id = `word-label-${params.id}`;
    this.wordLabel.element.innerText = 'Word:';
    this.wordInput.id = `word-input-${params.id}`;
    this.wordInput.className = 'admin__card_input none';
    this.wordInput.type = 'text';
    this.wordInput.value = params.word;

    this.translationLabel.element.id = `translation-label-${params.id}`;
    this.translationLabel.element.innerText = 'Translation:';
    this.translationInput.id = `translation-input-${params.id}`;
    this.translationInput.className = 'admin__card_input none';
    this.translationInput.type = 'text';
    this.translationInput.value = params.translation;

    this.soundLabel.element.id = `sound-label-${params.id}`;
    this.soundLabel.element.innerText = 'Sound:';
    this.soundBtn.element.id = `load-sound-${params.id}`;
    this.soundBtn.element.innerText = 'Select file';
    this.soundInput.id = `sound-input-${params.id}`;
    this.soundInput.type = 'file';
    this.soundInput.accept = '.mp3';
    this.soundInput.name = 'sound';

    this.imageLabel.element.id = `image-label-${params.id}`;
    this.imageLabel.element.innerText = 'Image:';
    this.imageBtn.element.id = `load-image-${params.id}`;
    this.imageBtn.element.innerText = 'Select file';
    this.imageInput.id = `image-input-${params.id}`;
    this.imageInput.type = 'file';
    this.imageInput.accept = '.jpg, .jpeg, .png';
    this.imageInput.name = 'img';

    this.preview.element.id = `preview-${params.id}`;

    this.update.element.id = `card-update-${params.id}`;
    this.update.element.innerText = 'Change';

    this.buttons.element.id = `buttons-${params.id}`;
    this.cancel.element.id = `card-cancel-${params.id}`;
    this.cancel.element.innerText = 'Cancel';
    this.create.element.id = `card-create-${params.id}`;
    this.create.element.innerText = 'Create';

    this.addElements(params);
  }

  addElements(params: ICard): void {
    this.wordLabel.element.append(this.wordInput);
    this.translationLabel.element.append(this.translationInput);

    this.soundLabel.element.insertAdjacentHTML('afterbegin', `
      <div class="done__svg none" id="sound-done-${params.id}"></div>
    `);
    this.imageLabel.element.insertAdjacentHTML('afterbegin', `
      <div class="done__svg none" id="image-done-${params.id}"></div>
    `);

    this.soundLabel.element.append(this.soundBtn.element);
    this.soundBtn.element.append(this.soundInput);
    this.imageLabel.element.append(this.imageBtn.element);
    this.imageBtn.element.append(this.imageInput);

    this.buttons.element.append(this.cancel.element);
    this.buttons.element.append(this.create.element);

    this.front.element.append(this.word.element);
    this.front.element.append(this.translation.element);
    this.front.element.append(this.sound.element);
    this.front.element.append(this.image.element);
    this.front.element.append(this.update.element);

    this.back.element.append(this.wordLabel.element);
    this.back.element.append(this.translationLabel.element);
    this.back.element.append(this.soundLabel.element);
    this.back.element.append(this.imageLabel.element);
    this.back.element.append(this.preview.element);
    this.back.element.append(this.buttons.element);

    this.element.append(this.remove.element);
    this.element.append(this.front.element);
    this.element.append(this.back.element);

    if (!params.id) { this.openCardCreator(); }
  }

  getAudioName(name: string): string {
    const normal = name.split('/').pop() as string;
    return normal;
  }

  openCardCreator(): void {
    this.front.element.classList.add('none');
    this.back.element.classList.remove('none');
  }
}
