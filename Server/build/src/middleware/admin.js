"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAdmin = (req, res, next) => {
    const user = res.locals.user;
    if (!user || user.type !== "admin") {
        return res.status(401).send("Unauthorized");
    }
    return next();
};
exports.default = requireAdmin;
