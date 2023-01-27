"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({}),
});
