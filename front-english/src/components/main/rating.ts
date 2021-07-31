import './css/rating.css';
import BaseComponent from '../base-component';

export default class Rating extends BaseComponent {
  success = '<div class="star star-correct"></div>';

  error = '<div class="star star-error"></div>';

  constructor() {
    super('div', ['rating']);
  }

  addRatingStar(state: boolean): void {
    const rating = document.querySelector('.rating') as HTMLDivElement;

    if (rating && state) {
      rating.insertAdjacentHTML('beforeend', this.success);
    }

    if (rating && !state) {
      rating.insertAdjacentHTML('beforeend', this.error);
    }
  }

  removeStars(): void {
    const stars = document.querySelectorAll('.star');

    stars.forEach((star) => {
      star.parentNode?.removeChild(star);
    });
  }
}
