import {object, string, TypeOf} from 'zod'

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'username is required'
        }),
        password: string({
            required_error: 'password is required'
        }).min(6, 'password must be at least 6 characters'),
        passwordConfirmation: string({
            required_error: 'password confirmation is required'
        }),
        email: string({
            required_error: 'email is required'
        }).email('email must be a valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'passwords must match',
        path: ['passwordConfirmation'],
    }),
})

export type CreateUserInput = Omit<
TypeOf<typeof createUserSchema>,
"body.passwordConfirmation"
>;