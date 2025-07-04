"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const book_routes_1 = __importDefault(require("./app/routes/book.routes"));
const borrow_routes_1 = __importDefault(require("./app/routes/borrow.routes"));
const errorHandler_1 = require("./app/middlewares/errorHandler");
const app = (0, express_1.default)();
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
//routes
app.use("/api/books", book_routes_1.default);
app.use("/api/borrow", borrow_routes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ message: "App is running!", success: true });
});
//not found handler 
app.use((req, res) => {
    res.status(404).json({ message: "Route not found", success: false });
});
//error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
