"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_controller_1 = require("./controller/course.controller");
const session_controller_1 = require("./controller/session.controller");
const user_controller_1 = require("./controller/user.controller");
const admin_1 = __importDefault(require("./middleware/admin"));
const requireUser_1 = __importDefault(require("./middleware/requireUser"));
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const review_schema_1 = require("./schema/review.schema");
const session_schema_1 = require("./schema/session.schema");
const user_schema_1 = require("./schema/user.schema");
// const upload = multer({
//     dest: 'uploads/' // Destination directory for the uploaded files
// });
function routes(app) {
    app.get('/healthCheck', (req, res) => res.sendStatus(200));
    ///////////////////////////COUPON ROUTES////////////////////////////
    app.post('/api/coupon', admin_1.default, user_controller_1.createCouponHandler);
    app.delete('/api/coupon/:couponCode', admin_1.default, user_controller_1.deleteCouponHandler);
    app.get('/api/coupon', admin_1.default, user_controller_1.getCouponsHandler);
    ///////////////////////////USERS ROUTES////////////////////////////
    app.post('/api/users', (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler); //tested
    app.get('/api/users', requireUser_1.default, user_controller_1.getUsersHandler); //tested
    app.get('/api/users/:userId', requireUser_1.default, user_controller_1.getUserHandler); //tested
    app.delete('/api/users/:userId', admin_1.default, user_controller_1.deleteUserHandler);
    app.patch('/api/users/:userId', requireUser_1.default, user_controller_1.updateUserHandler);
    app.post('/api/users/cart/add/:courseId', requireUser_1.default, user_controller_1.addToCartHandler);
    app.delete('/api/users/cart/remove/:courseId', requireUser_1.default, user_controller_1.removeFromCartHandler);
    app.get('/api/users/cart/get', requireUser_1.default, user_controller_1.getCartHandler); //optional ?discount
    app.post('/api/users/balance/add', requireUser_1.default, user_controller_1.addBalance);
    ///////////////////////////COURSES ROUTES////////////////////////////
    app.get('/api/courses/recommendations', requireUser_1.default, course_controller_1.getRecommendationsHandler); //tested
    app.get('/api/courses/tryCourses', requireUser_1.default, course_controller_1.getTryCoursesHandler);
    app.get("/api/courses/search/:searchTerm", requireUser_1.default, course_controller_1.searchCourseHandler);
    app.get("/api/courses/category/:category", requireUser_1.default, course_controller_1.getCourseByCategoryHandler);
    app.get('/api/courses/:courseId', requireUser_1.default, course_controller_1.getCourseHandler); //tested
    app.post('/api/courses', requireUser_1.default, course_controller_1.createCourseHandler); //tested
    app.delete('/api/courses/:courseId', requireUser_1.default, course_controller_1.deleteCourseHandler); //tested
    app.patch('/api/courses/:courseId', requireUser_1.default, course_controller_1.updateCourseHandler);
    app.post('/api/courses/:courseId/videos', requireUser_1.default, course_controller_1.uploadVideoHandler);
    app.delete('/api/courses/:courseId/videos', requireUser_1.default, course_controller_1.deleteVideoHandler);
    app.patch('/api/courses/:courseId/videos', requireUser_1.default, course_controller_1.updateVideoHandler);
    app.get('/api/courses/:courseId/videos', requireUser_1.default, course_controller_1.getVideoHandler);
    app.post('/api/courses/:courseId/discount', requireUser_1.default, course_controller_1.createDiscountHandler);
    app.delete('/api/courses/:courseId/discount', requireUser_1.default, course_controller_1.deleteDiscountHandler);
    app.patch('/api/courses/:courseId/discount', requireUser_1.default, course_controller_1.updateDiscountHandler);
    app.post('/api/courses/:courseId/quiz', requireUser_1.default, course_controller_1.addQuizToCourseHandler); //tested
    app.get('/api/courses/:courseId/:quizId', requireUser_1.default, course_controller_1.getQuizHandler); //tested
    app.post('/api/courses/:courseId/:quizId/submit', requireUser_1.default, course_controller_1.submitQuizHandler); //tested
    app.get('/api/courses/:courseId/:quizId/submissions', requireUser_1.default, course_controller_1.getQuizSubmissionsHandler); //tested
    app.post('/api/courses/:courseId/enroll', requireUser_1.default, course_controller_1.enrollCourseHandler); //tested
    app.post('/api/courses/:courseId/review', (0, validateResource_1.default)(review_schema_1.reviewCourseSchema), requireUser_1.default, course_controller_1.reviewCourseHandler); //tested
    app.delete('/api/courses/:courseId/review', requireUser_1.default, course_controller_1.deleteReviewHandler); //tested
    ///////////////////////////SESSIONS ROUTES////////////////////////////
    app.post('/api/sessions', (0, validateResource_1.default)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionHandler); //tested
    app.get('/api/sessions', requireUser_1.default, session_controller_1.getUserSessionsHandler); //tested
    app.delete('/api/sessions', requireUser_1.default, session_controller_1.deleteSessionHandler); //tested
}
exports.default = routes;
