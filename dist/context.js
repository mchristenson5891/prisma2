"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const db_1 = require("./db");
function createContext(req) {
    return Object.assign(Object.assign({}, req), { db: db_1.db });
}
exports.createContext = createContext;
//# sourceMappingURL=context.js.map