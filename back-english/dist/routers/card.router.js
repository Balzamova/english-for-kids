"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_config_1 = require("./card.config");
const status_codes_1 = require("../config/status-codes");
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cards = yield card_config_1.getCards();
    return res.json(cards);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = Number(req.params.id);
    if (!cardId) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    const card = yield card_config_1.getCardById(cardId);
    if (!card) {
        return res.sendStatus(status_codes_1.StatusCodes.NotFound);
    }
    return res.json(card);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = Number(req.params.id);
    if (!cardId) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        yield card_config_1.deleteCard(cardId);
        return res.sendStatus(status_codes_1.StatusCodes.Ok);
    }
    catch (e) {
        return res.status(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.word) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        const card = yield card_config_1.createCard(data);
        return res.json(card);
    }
    catch (e) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const card = yield card_config_1.getCardById(data.id);
    if (!card) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        const newData = yield card_config_1.updateCard(data);
        return res.json(newData);
    }
    catch (e) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
exports.default = router;
//# sourceMappingURL=card.router.js.map