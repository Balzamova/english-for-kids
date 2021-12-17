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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const status_codes_1 = require("../config/status-codes");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'dist/root/audio');
    },
    filename: (req, file, cd) => {
        const originName = file.originalname;
        const newName = `${originName.split('.')[0]}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cd(null, newName);
    },
});
const upload = multer_1.default({ storage });
const cpUpload = upload.fields([
    { name: 'sound', maxCount: 1 },
]);
const router = express_1.Router();
router.post('/', cpUpload, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filedata = req.files;
    if (!filedata) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
    try {
        const sound = filedata.sound[0];
        res.send({ name: sound.filename });
    }
    catch (e) {
        return res.sendStatus(status_codes_1.StatusCodes.BadRequest);
    }
}));
exports.default = router;
//# sourceMappingURL=file.router.js.map