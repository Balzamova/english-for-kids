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
const category_config_1 = require("./category.config");
const status_codes_1 = require("../config/status-codes");
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_config_1.getCategories();
    res.json(categories);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const catId = Number(req.params.id);
    if (!catId) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    const cat = yield category_config_1.getCategoryById(catId);
    if (!cat) {
        return res.sendStatus(status_codes_1.StatusCodes.NotFound);
    }
    return res.json(cat);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const catId = Number(req.params.id);
    if (!catId) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        yield category_config_1.deleteCategory(catId);
        return res.sendStatus(status_codes_1.StatusCodes.Ok);
    }
    catch (e) {
        return res.status(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.name) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        const category = yield category_config_1.createCategory(data);
        return res.json(category);
    }
    catch (e) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const category = yield category_config_1.getCategoryById(data.id);
    if (!category) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        const newData = yield category_config_1.updateCategory(data);
        return res.json(newData);
    }
    catch (e) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest).send(e);
    }
}));
exports.default = router;
//# sourceMappingURL=category.router.js.map