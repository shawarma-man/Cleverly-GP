"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({
            required_error: 'username is required'
        }),
        password: (0, zod_1.string)({
            required_error: 'password is required'
        }).min(6, 'password must be at least 6 characters'),
        passwordConfirmation: (0, zod_1.string)({
            required_error: 'password confirmation is required'
        }),
        email: (0, zod_1.string)({
            required_error: 'email is required'
        }).email('email must be a valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'passwords must match',
        path: ['passwordConfirmation'],
    }),
});
