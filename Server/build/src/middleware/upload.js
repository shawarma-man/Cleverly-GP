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
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const maxSize = 100000000;
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const processFile = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).single("file");
const processFileMiddleware = util_1.default.promisify(processFile);
function processVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield processFileMiddleware(req, res);
        }
        catch (err) {
            console.error(err);
            res.status(500).send({ message: err.message });
        }
    });
}
exports.default = processVideo;
