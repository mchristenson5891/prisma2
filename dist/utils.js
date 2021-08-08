"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = exports.APP_SECRET = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.APP_SECRET = "appsecret321";
function getUserId(context) {
    const authHeader = context.req.get("Authorization");
    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const verifiedToken = jsonwebtoken_1.verify(token, exports.APP_SECRET);
        return verifiedToken && Number(verifiedToken.userId);
    }
}
exports.getUserId = getUserId;
//# sourceMappingURL=utils.js.map