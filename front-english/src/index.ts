import App from './app';
import './style.css';

window.onload = async () => {
  const appElement = document.querySelector('body');

  if (!appElement) {
    throw Error('App element not found');
  }

  new App(appElement);
};
