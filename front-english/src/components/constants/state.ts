export const state = {
  isAppLoaded: false,
  isAdminPage: false,
  needRegistry: false,
  currentCategory: 0,
  playState: false,
  gameActive: false,
  endGame: false,
  randomArray: [0],
  cards: [
    {
      id: 0,
      categoryId: 0,
      word: '',
      translation: '',
      image: '',
      audio: '',
    },
  ],
  index: 0,
  errors: 0,
  src: '',
};
