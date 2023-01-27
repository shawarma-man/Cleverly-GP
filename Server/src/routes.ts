import { Express, Request, Response } from "express";
import { addCourseToInstructor, addQuestionToQuizHandler, addQuizToCourseHandler, createCourseHandler, createDiscountHandler, createMeetingHandler, deleteCourseHandler, deleteDiscountHandler, deleteMeetingHandler, deleteReviewHandler, deleteVideoHandler, getCourseByCategoryHandler, getCourseByInstructorHandler, getCourseHandler, getMeetingHandler, getMyScoreHandler, getQuizHandler, getQuizSubmissionsHandler, getRecommendationsHandler, getTopCoursesHandler, getTryCoursesHandler, getVideoHandler, reviewCourseHandler, searchCourseHandler, submitQuizHandler, updateCourseHandler, updateDiscountHandler, updateVideoHandler, uploadVideoHandler } from "./controller/course.controller";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import { addBalance, addCardHandler, addToCartHandler, changePasswordHandler, checkOutHandler, createCouponHandler, createUserHandler, deleteCouponHandler, deleteUserHandler, getCartHandler, getCouponsHandler, getProfileHandler, getUserHandler, getUsersHandler, removeFromCartHandler, requestVerifyEmailHandler, updateUserHandler, verifyEmailHandler } from "./controller/user.controller";
import requireAdmin from "./middleware/admin";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { reviewCourseSchema } from "./schema/review.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import multer from 'multer';
import { requestPasswordReset, resetPassword, verifyResetToken } from "./controller/ResetToken.controller";

// const upload = multer({
//     dest: 'uploads/' // Destination directory for the uploaded files
// });
function routes(app: Express) {
    app.get('/healthCheck', (req: Request, res: Response) => res.sendStatus(200));
    app.post('/api/tmp', requireUser, addCourseToInstructor);
    ///////////////////////////COUPON ROUTES////////////////////////////
    app.post('/api/coupon', requireUser, createCouponHandler);//tested
    app.delete('/api/coupon/:couponCode', requireAdmin, deleteCouponHandler);//tested
    app.get('/api/coupon', requireUser, getCouponsHandler);//tested
    ///////////////////////////USERS ROUTES////////////////////////////
    app.post('/api/users', validateResource(createUserSchema), createUserHandler);//tested
    app.get('/api/users', requireUser, getUsersHandler);//tested
    app.get('/api/users/:userId', requireUser, getUserHandler);//tested
    app.get('/api/users/profile/get', requireUser, getProfileHandler);
    app.delete('/api/users/:userId', requireUser, deleteUserHandler);//tested
    app.patch('/api/users/update', requireUser, updateUserHandler);//tested
    app.patch('/api/users/password', requireUser, changePasswordHandler);//tested

    app.post('/api/users/cart/add/:courseId', requireUser, addToCartHandler);//tested
    app.post('/api/users/cart/checkout', requireUser, checkOutHandler);//tested
    app.delete('/api/users/cart/remove/:courseId', requireUser, removeFromCartHandler);//tested
    app.get('/api/users/cart/get', requireUser, getCartHandler); //optional ?discount //tested
    app.post('/api/users/card/add', requireUser, addCardHandler);
    app.post('/api/users/balance/add', requireUser, addBalance);//tested
    app.post('/api/users/email/send', requestVerifyEmailHandler);
    app.get('/api/users/email/verify/:token', verifyEmailHandler);
    app.post('/api/users/password/send', requestPasswordReset);
    app.post('/api/users/password/verify', verifyResetToken);
    app.post('/api/users/password/reset', resetPassword);
    ///////////////////////////COURSES ROUTES////////////////////////////
    app.get('/api/courses/recommendations', requireUser, getRecommendationsHandler);
    app.get('/api/courses/tryCourses', requireUser, getTryCoursesHandler);
    app.get('/api/courses/topCourses', requireUser, getTopCoursesHandler);

    app.get("/api/courses/search/:searchTerm", requireUser, searchCourseHandler);
    app.get("/api/courses/category/:category", requireUser, getCourseByCategoryHandler);
    app.get("/api/courses/instructor/:instructor", requireUser, getCourseByInstructorHandler);

    app.get('/api/courses/:courseId', requireUser, getCourseHandler);
    app.post('/api/courses', requireUser, createCourseHandler);
    app.delete('/api/courses/:courseId', requireUser, deleteCourseHandler);
    app.patch('/api/courses/:courseId', requireUser, updateCourseHandler);

    app.post('/api/courses/:courseId/videos', requireUser, uploadVideoHandler);
    app.delete('/api/courses/:courseId/videos', requireUser, deleteVideoHandler);
    app.patch('/api/courses/:courseId/videos', requireUser, updateVideoHandler);
    app.get('/api/courses/:courseId/videos', requireUser, getVideoHandler);

    app.post('/api/courses/:courseId/discount', requireUser, createDiscountHandler);
    app.delete('/api/courses/:courseId/discount', requireUser, deleteDiscountHandler);
    app.patch('/api/courses/:courseId/discount', requireUser, updateDiscountHandler);

    app.post('/api/courses/:courseId/quiz', requireUser, addQuizToCourseHandler);
    app.patch('/api/courses/:courseId/:quizId', requireUser, addQuestionToQuizHandler);
    app.get('/api/courses/:courseId/:quizId', requireUser, getQuizHandler);
    app.post('/api/courses/:courseId/:quizId/submit', requireUser, submitQuizHandler);
    app.get('/api/courses/:courseId/:quizId/submissions', requireUser, getQuizSubmissionsHandler);
    app.get('/api/courses/:courseId/:quizId/score', requireUser, getMyScoreHandler);

    app.post('/api/courses/:courseId/zoom/add', requireUser, createMeetingHandler);
    app.get('/api/courses/:courseId/zoom/get', requireUser, getMeetingHandler);
    app.delete('/api/courses/:courseId/zoom/delete', requireUser, deleteMeetingHandler);

    app.post('/api/courses/:courseId/review', validateResource(reviewCourseSchema), requireUser, reviewCourseHandler);
    app.delete('/api/courses/:courseId/review', requireUser, deleteReviewHandler);
    ///////////////////////////SESSIONS ROUTES////////////////////////////
    app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler);
    app.get('/api/sessions', requireUser, getUserSessionsHandler);
    app.delete('/api/sessions', requireUser, deleteSessionHandler);

}

export default routes