"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    var _a, _b, _c;
    const NODE_ENV = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
    if (NODE_ENV === "development") {
        console.error("💥 Error:", JSON.stringify(err));
    }
    const { name } = err, restErr = __rest(err, ["name"]);
    (0, response_1.errorResponse)(res, {
        statusCode: (_b = err.statusCode) !== null && _b !== void 0 ? _b : 500,
        message: (_c = err.message) !== null && _c !== void 0 ? _c : "Internal server error",
        error: {
            name: name,
            errors: restErr.errors,
        },
    });
};
exports.errorHandler = errorHandler;
