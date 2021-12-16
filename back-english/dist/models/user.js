"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: false },
    password: { type: String, required: true },
});
exports.default = mongoose_1.model('User', schema);
//# sourceMappingURL=user.js.map