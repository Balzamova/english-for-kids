"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.createCategory = exports.deleteCategory = exports.getCategoryById = exports.getCategories = void 0;
const categories_1 = __importDefault(require("../constants/categories"));
const sort_1 = __importDefault(require("../helpers/sort"));
function getCategories() {
    return Promise.resolve(categories_1.default);
}
exports.getCategories = getCategories;
function getCategoryById(id) {
    const cat = categories_1.default.find((c) => c.id === id);
    return Promise.resolve(cat);
}
exports.getCategoryById = getCategoryById;
function deleteCategory(id) {
    const catIndex = categories_1.default.findIndex((cat) => cat.id === id);
    if (catIndex < 0) {
        return Promise.reject(new Error('Category not found'));
    }
    categories_1.default.splice(catIndex, 1);
    return Promise.resolve();
}
exports.deleteCategory = deleteCategory;
function createCategory(category) {
    const isExist = typeof categories_1.default
        .find((cat) => cat.name.toLowerCase() === category.name.toLowerCase()) !== 'undefined';
    if (isExist) {
        return Promise.reject(new Error(`Category with name ${category.name} is already exists`));
    }
    const newId = Date.now();
    const model = Object.assign(Object.assign({}, category), { id: newId });
    categories_1.default.push(model);
    sort_1.default(categories_1.default);
    return Promise.resolve(model);
}
exports.createCategory = createCategory;
function updateCategory(category) {
    let newName = '';
    for (let i = 0; i < categories_1.default.length; i++) {
        if (categories_1.default[i].id === category.id) {
            newName = category.name;
            categories_1.default.splice(i, 1);
        }
    }
    const model = Object.assign(Object.assign({}, category), { name: newName });
    categories_1.default.push(model);
    sort_1.default(categories_1.default);
    return Promise.resolve(model);
}
exports.updateCategory = updateCategory;
//# sourceMappingURL=category.config.js.map