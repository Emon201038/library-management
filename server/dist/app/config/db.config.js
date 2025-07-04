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
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = require("../../secret");
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connect(secret_1.DB_URL).then(() => {
            console.log("Connected to DB is successful");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.error("DB connection error", err);
        });
    }
    catch (error) {
        console.error('error:', error);
    }
});
exports.default = connectDb;
