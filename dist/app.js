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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const category_router_1 = __importDefault(require("./routers/category.router"));
const card_router_1 = __importDefault(require("./routers/card.router"));
const file_router_1 = __importDefault(require("./routers/file.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const PORT = process.env.PORT || 5000;
const mongoURL = 'mongodb+srv://balzam:1q2w3e4r@cluster0.w9yt2.mongodb.net/english-app?retryWrites=true&w=majority';
const app = express_1.default();
app.use(body_parser_1.urlencoded({ extended: false }));
app.use(body_parser_1.json());
app.use(cors_1.default());
const publicPath = path_1.default.join(__dirname, '/root/audio');
app.use('/api/auth', auth_router_1.default);
app.use('/api/static', express_1.default.static(publicPath));
app.use('/api/categories', category_router_1.default);
app.use('/api/cards', card_router_1.default);
app.use('/api/uploads', file_router_1.default);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            app.listen(PORT, () => {
                console.log(`Server started on ${PORT}`);
            });
        }
        catch (e) {
            console.log('Server Error', e);
            process.exit(1);
        }
    });
}
start();
//# sourceMappingURL=app.js.map