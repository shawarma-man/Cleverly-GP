import { number, object, string, TypeOf } from 'zod'

export const reviewCourseSchema = object({
    body: object({
        rating: number({
            required_error: 'rating is required'
        }),
        comment: string({
            required_error: 'comment is required'
        })
    })
})