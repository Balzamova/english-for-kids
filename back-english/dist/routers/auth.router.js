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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const status_codes_1 = require("../config/status-codes");
const router = express_1.Router();
router.post('/login', [express_validator_1.check('login', 'Enter login'), express_validator_1.check('password', 'Enter password').exists()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(status_codes_1.StatusCodes.BadRequest)
                .json({ message: 'Incorrect inputs in form' });
        }
        const { email, login, password } = req.body;
        const user = yield user_1.default.findOne({ login });
        if (!user) {
            return res
                .status(status_codes_1.StatusCodes.BadRequest)
                .json({ message: 'User not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(status_codes_1.StatusCodes.BadRequest)
                .json({ message: 'Password incorrect, try again' });
        }
        res.status(status_codes_1.StatusCodes.Ok).json({ userId: user.id });
    }
    catch (e) {
        res.status(status_codes_1.StatusCodes.Error).json({ message: 'Login error' });
    }
}));
router.post('/register', [
    express_validator_1.check('login', 'Wrong login').isLength({ min: 4 }),
    express_validator_1.check('password', 'Short password').isLength({ min: 4 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(status_codes_1.StatusCodes.BadRequest).json({
                errors: errors.array(),
                message: 'Incorrect inputs in registry form. Try again',
            });
        }
        const { email, login, password } = req.body;
        const candidate = yield user_1.default.findOne({ login });
        if (candidate) {
            return res.status(status_codes_1.StatusCodes.BadRequest).json({ message: 'User with same login exists' });
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({ email, login, password: hashPassword });
        yield user.save();
        return res.status(status_codes_1.StatusCodes.Ok).json({ message: 'New user created' });
    }
    catch (e) {
        res.status(status_codes_1.StatusCodes.Error).json({ message: 'Register error' });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.router.js.map