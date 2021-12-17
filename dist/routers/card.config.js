"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCard = exports.createCard = exports.deleteCard = exports.getCardById = exports.getCards = void 0;
const cards_1 = __importDefault(require("../constants/cards"));
const sort_1 = __importDefault(require("../helpers/sort"));
function getCards() {
    return Promise.resolve(cards_1.default);
}
exports.getCards = getCards;
function getCardById(id) {
    const card = cards_1.default.find((c) => c.id === id);
    return Promise.resolve(card);
}
exports.getCardById = getCardById;
function deleteCard(id) {
    const index = cards_1.default.findIndex((card) => card.id === id);
    if (index < 0) {
        return Promise.reject(new Error('Category not found'));
    }
    cards_1.default.splice(index, 1);
    return Promise.resolve();
}
exports.deleteCard = deleteCard;
function createCard(card) {
    const isExist = typeof cards_1.default
        .find((c) => c.word.toLowerCase() === card.word.toLowerCase()) !== 'undefined';
    if (isExist) {
        return Promise.reject(new Error(`Category with word ${card.word} is already exists`));
    }
    const newId = Date.now();
    const model = Object.assign(Object.assign({}, card), { id: newId });
    cards_1.default.push(model);
    sort_1.default(cards_1.default);
    return Promise.resolve(model);
}
exports.createCard = createCard;
function updateCard(card) {
    let newWord = '';
    let newTranslation = '';
    let newImage = '';
    let newAudio = '';
    for (let i = 0; i < cards_1.default.length; i++) {
        if (cards_1.default[i].id === card.id) {
            newWord = card.word;
            newTranslation = card.translation;
            newImage = card.image;
            newAudio = card.audio;
            cards_1.default.splice(i, 1);
        }
    }
    const model = Object.assign(Object.assign({}, card), { word: newWord, translation: newTranslation, image: newImage, audioSrc: newAudio });
    cards_1.default.push(model);
    sort_1.default(cards_1.default);
    return Promise.resolve(model);
}
exports.updateCard = updateCard;
//# sourceMappingURL=card.config.js.map