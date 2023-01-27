"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewCourseSchema = void 0;
const zod_1 = require("zod");
exports.reviewCourseSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        rating: (0, zod_1.number)({
            required_error: 'rating is required'
        }),
        comment: (0, zod_1.string)({
            required_error: 'comment is required'
        })
    })
});
