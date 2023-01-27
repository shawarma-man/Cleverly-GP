"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiscountHandler = exports.deleteDiscountHandler = exports.createDiscountHandler = exports.deleteVideoHandler = exports.getVideoHandler = exports.updateVideoHandler = exports.uploadVideoHandler = exports.getTryCoursesHandler = exports.getRecommendationsHandler = exports.getQuizSubmissionsHandler = exports.submitQuizHandler = exports.getQuizHandler = exports.addQuizToCourseHandler = exports.deleteReviewHandler = exports.reviewCourseHandler = exports.enrollCourseHandler = exports.deleteCourseHandler = exports.getCourseByCategoryHandler = exports.searchCourseHandler = exports.updateCourseHandler = exports.getCourseHandler = exports.createCourseHandler = void 0;
const course_service_1 = require("../service/course.service");
const logger_1 = __importDefault(require("../utils/logger"));
const courses_model_1 = __importDefault(require("../models/courses.model"));
const user_service_1 = require("../service/user.service");
const storage_1 = __importDefault(require("../../config/storage"));
const findDuration_1 = require("../utils/findDuration");
const upload_1 = __importDefault(require("../middleware/upload"));
const lodash_1 = require("lodash");
///////////////////////// (Post) */api/courses* /////////////////////////
function createCourseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const course = yield (0, course_service_1.createCourse)(Object.assign(Object.assign({}, req.body), { instructor: user }));
            if (course) {
                yield (0, user_service_1.findAndUpdateUser)({ _id: user._id }, { $push: { publishedCourses: course } }, {
                    new: true,
                });
            }
            return res.send(course);
        }
        catch (e) {
            logger_1.default.error(e);
            return res.status(409).send(e.message);
        }
    });
}
exports.createCourseHandler = createCourseHandler;
///////////////////////// (GET)*/api/courses/:courseId* /////////////////////////
function getCourseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, course_service_1.findCourse)({ _id: req.params.courseId }, true);
        if (!result)
            return res.status(404).send("Course not found");
        return res.send(result);
    });
}
exports.getCourseHandler = getCourseHandler;
///////////////////////// (PATCH) */api/courses/:courseId* /////////////////////////
function updateCourseHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== userId && res.locals.user.type !== "admin") {
            return res.status(403).send("You are not allowed to edit this Course");
        }
        try {
            yield (0, course_service_1.findAndUpdateCourse)({
                _id: courseId
            }, {
                $set: Object.assign({}, req.body)
            }, { new: true });
            return res.status(200).send("Course updated");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.updateCourseHandler = updateCourseHandler;
///////////////////////// (GET) */api/courses/search/:searchTerm* /////////////////////////
function searchCourseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.params.searchTerm);
        try {
            const result = yield (0, course_service_1.findCourse)({
                name: { $regex: req.params.searchTerm, $options: "i" },
            }, false);
            if (!result)
                return res.status(404).send("Course not found");
            res.json(result);
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.searchCourseHandler = searchCourseHandler;
///////////////////////// (GET) */api/courses/category/:category* /////////////////////////
function getCourseByCategoryHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = req.params.category;
        try {
            const result = yield (0, course_service_1.findCourse)({ category: category }, false);
            if (!result)
                return res.status(404).send("Course not found");
            res.json(result);
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.getCourseByCategoryHandler = getCourseByCategoryHandler;
///////////////////////// (DELETE) */api/courses/:courseId* /////////////////////////
function deleteCourseHandler(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        console.log((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id);
        if (String((_b = course.instructor) === null || _b === void 0 ? void 0 : _b._id) !== userId && res.locals.user.type !== "admin") {
            return res.status(403).send("You are not allowed to delete this Course");
        }
        yield (0, course_service_1.deleteCourse)({ courseId });
        return res.status(200).send("Course deleted");
    });
}
exports.deleteCourseHandler = deleteCourseHandler;
///////////////////////// (POST) */api/courses/:courseId/enroll* /////////////////////////
function enrollCourseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (isEnrolled) {
            return res.status(403).send("You are already enrolled in this course");
        }
        const isPublished = yield (0, user_service_1.findUser)({ _id: user._id, publishedCourses: course }, true);
        if (isPublished) {
            return res.status(403).send("You are the instructor of this course");
        }
        if (user.bala > 0) {
            return res.status(403).send("This course is not free");
        }
        try {
            yield (0, user_service_1.findAndUpdateUser)({ _id: user._id }, { $push: { ownedCourses: course } }, {
                new: true,
            });
            yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $push: { students: user }, $inc: { students_count: 1 } }, {
                new: true,
            });
            return res.status(200).send("Course enrolled");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.enrollCourseHandler = enrollCourseHandler;
///////////////////////// (Post) */api/courses/:courseId/review* /////////////////////////
function reviewCourseHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (!isEnrolled) {
            return res.status(403).send("You are not enrolled in this course");
        }
        const isReviewed = yield (0, course_service_1.findCourse)({ _id: courseId, reviews: { $elemMatch: { _id: user._id } } }, true);
        if (isReviewed) {
            return res.status(403).send("You have already reviewed this course");
        }
        if (req.body.rating > 5 || req.body.rating < 1) {
            return res.status(403).send("Rating should be between 1 and 5");
        }
        let newRating = 0;
        newRating = (course.rating * course.review_count + req.body.rating) / (course.review_count + 1);
        try {
            yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $push: { reviews: Object.assign({ _id: user._id, username: user.username }, req.body) }, $inc: { review_count: 1 }, rating: newRating }, { new: true });
            return res.status(200).send("Course reviewed");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.reviewCourseHandler = reviewCourseHandler;
///////////////////////// (DELETE) */api/courses/:courseId/review* /////////////////////////
function deleteReviewHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (!isEnrolled) {
            return res.status(403).send("You are not enrolled in this course");
        }
        const isReviewed = yield courses_model_1.default.findOne({ _id: courseId, reviews: { $elemMatch: { _id: user._id } } });
        if (!isReviewed) {
            return res.status(403).send("You have not reviewed this course");
        }
        let newRating = 0;
        newRating = (course.rating * course.review_count - isReviewed.rating) / (course.review_count - 1);
        try {
            yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $pull: { reviews: { _id: user._id } }, $inc: { review_count: -1 }, rating: newRating }, { new: true });
            return res.status(200).send("Review deleted");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.deleteReviewHandler = deleteReviewHandler;
///////////////////////// (Post) */api/courses/:courseId/quiz* /////////////////////////
function addQuizToCourseHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const courseId = req.params.courseId;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== userId && res.locals.user.type !== "admin") {
            return res.status(403).send("You are not allowed to edit this Course");
        }
        let q_num = Object.keys(req.body.questions).length;
        try {
            yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $push: { quizes: Object.assign({ num_questions: q_num }, req.body) } }, { new: true });
            return res.status(200).send("quiz added");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.addQuizToCourseHandler = addQuizToCourseHandler;
///////////////////////// (GET) */api/courses/:courseId/:quizId* /////////////////////////
function getQuizHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const quizId = req.params.quizId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (!isEnrolled) {
            return res.status(403).send("You are not enrolled in this course");
        }
        const quiz = course.quizes.find((quiz) => quiz._id == quizId);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        return res.status(200).json(quiz);
    });
}
exports.getQuizHandler = getQuizHandler;
///////////////////////// (Post) */api/courses/:courseId/:quizId/submit* /////////////////////////
function submitQuizHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const quizId = req.params.quizId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (!isEnrolled) {
            return res.status(403).send("You are not enrolled in this course");
        }
        const quiz = course.quizes.find((quiz) => quiz._id == quizId);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        const isSubmitted = yield (0, course_service_1.findCourse)({ _id: courseId, quizes: { $elemMatch: { _id: quizId, submissions: { $elemMatch: { _id: user._id } } } } }, true);
        if (isSubmitted) {
            return res.status(403).send("You have already submitted this quiz");
        }
        let score = 0;
        if (quiz.num_questions != Object.keys(req.body).length) {
            return res.status(403).send("You have not answered all questions");
        }
        for (let i = 0; i < quiz.num_questions; i++) {
            if (quiz.questions[i].answer == req.body[i]) {
                score++;
            }
        }
        try {
            yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId, quizes: { $elemMatch: { _id: quizId } } }, { $push: { "quizes.$.submissions": { _id: user._id, username: user.username, score, answers: req.body } } }, { new: true });
            return res.status(200).send("Quiz submitted");
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
exports.submitQuizHandler = submitQuizHandler;
///////////////////////// (GET) */api/courses/:courseId/:quizId/submissions* /////////////////////////
function getQuizSubmissionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const quizId = req.params.quizId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const isEnrolled = yield (0, course_service_1.findCourse)({ _id: courseId, students: user }, true);
        if (!isEnrolled) {
            return res.status(403).send("You are not enrolled in this course");
        }
        const quiz = course.quizes.find((quiz) => quiz._id == quizId);
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        return res.status(200).json(quiz.submissions);
    });
}
exports.getQuizSubmissionsHandler = getQuizSubmissionsHandler;
///////////////////////// (GET) */api/courses/recommendations* /////////////////////////
function getRecommendationsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        ///test
        const course = yield courses_model_1.default.findOne({ students: user }).lean();
        if (!course) {
            const recommendation = yield courses_model_1.default.find({ 'instructor._id': { $ne: user._id } }).limit(5).lean();
            return res.status(200).json(recommendation);
        }
        else {
            const recommendation = yield courses_model_1.default.aggregate([
                {
                    $match: {
                        "category": course.category,
                        "_id": { $ne: course._id },
                        "instructor._id": { $ne: user._id }
                    }
                },
                {
                    $project: {
                        name: 1,
                        rating: 1,
                        review_count: 1,
                        price: 1,
                        instructor: 1,
                        category: 1,
                        distance: {
                            $sqrt: {
                                $add: [
                                    { $pow: [{ $subtract: [Number(course.rating), "$rating"] }, 2] },
                                    { $pow: [{ $subtract: [Number(course.review_count), "$review_count"] }, 2] }
                                ]
                            }
                        }
                    }
                },
                {
                    $match: {
                        distance: { $ne: null }
                    }
                },
                {
                    $sort: { distance: 1 },
                },
                {
                    $limit: 5
                }
            ]);
            if (recommendation.length < 5) {
                const fill = yield courses_model_1.default.find({ category: { $ne: course.category }, 'instructor._id': { $ne: user._id }, _id: { $ne: course._id } }).limit(5 - recommendation.length).lean();
                recommendation.push(...fill);
            }
            return res.send((0, lodash_1.omit)(recommendation, "distance"));
        }
    });
}
exports.getRecommendationsHandler = getRecommendationsHandler;
///////////////////////// (GET) */api/courses/tryCourses* /////////////////////////
function getTryCoursesHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const courses = yield courses_model_1.default.find({ students: user }).lean();
        const coursesIds = courses.map((course) => course._id);
        const recommendations = yield courses_model_1.default.find({ _id: { $nin: coursesIds }, 'instructor._id': { $ne: user._id } }).limit(5).lean();
        return res.status(200).json(recommendations);
    });
}
exports.getTryCoursesHandler = getTryCoursesHandler;
///////////////////////// (POST) */api/courses/:courseId/videos* /////////////////////////
function uploadVideoHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        try {
            yield (0, upload_1.default)(req, res);
            const info = JSON.parse(req.body.info);
            if (!info || !info.name || !info.description) {
                return res.status(400).send('No info provided');
            }
            if (!req.file) {
                return res.status(400).send({ message: "Please upload a file!" });
            }
            const originalName = req.file.originalname;
            const extension = originalName.split('.').pop();
            // const uniqueId = uuidv4();
            const uniqueName = `${info.name}`;
            const bucket = storage_1.default.bucket("cleverly_videos");
            const blob = bucket.file(`${course.name}/${uniqueName}.${extension}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream.on("error", (err) => {
                res.status(500).send({ message: err.message });
            });
            blobStream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                const [publicUrl] = yield blob.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491',
                });
                if (!req.file) {
                    return res.status(400).send({ message: "Please upload a file!" });
                }
                const duration = yield (0, findDuration_1.getDurationFromBuffer)(req.file.buffer);
                yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $push: { videos: { name: info.name, description: info.description, video: publicUrl, extension: extension, duration: duration } } }, { new: true });
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    url: publicUrl,
                });
            }));
            blobStream.end(req.file.buffer);
        }
        catch (err) {
            console.log(err);
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }
            if (!req.file) {
                return res.status(400).send({ message: "Please upload a file!" });
            }
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
        }
    });
}
exports.uploadVideoHandler = uploadVideoHandler;
;
///////////////////////// (PATCH) */api/courses/:courseId/videos* /////////////////////////
function updateVideoHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const videoId = req.params.videoId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const video = course.videos.find((video) => String(video._id) === videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).send('No name or description provided');
        }
        yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId, 'videos._id': videoId }, { $set: { 'videos.$.name': name, 'videos.$.description': description } }, { new: true });
        res.status(200).send('Video updated');
    });
}
exports.updateVideoHandler = updateVideoHandler;
///////////////////////// (GET) */api/courses/:courseId/videos* /////////////////////////
function getVideoHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const videoId = req.params.videoId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const video = course.videos.find((video) => String(video._id) === videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }
        res.status(200).send(video);
    });
}
exports.getVideoHandler = getVideoHandler;
///////////////////////// (DELETE) */api/courses/:courseId/videos* /////////////////////////
function deleteVideoHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const videoId = req.params.videoId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const video = course.videos.find((video) => String(video._id) === videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }
        const bucket = storage_1.default.bucket('cleverly_videos');
        const blob = bucket.file(`${course.name}/${video.name}.${video.extension}`);
        yield blob.delete();
        yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $pull: { videos: { _id: videoId } } }, { new: true });
        res.status(200).send('Video deleted');
    });
}
exports.deleteVideoHandler = deleteVideoHandler;
///////////////////////// (POST) */api/courses/:courseId/discount* /////////////////////////
function createDiscountHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const { code, discount } = req.body;
        if (!code || !discount) {
            return res.status(400).send('No code or discount provided');
        }
        if (discount > 100 || discount < 0) {
            return res.status(400).send('Discount must be between 0 and 100');
        }
        yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $push: { discounts: { code, discount } } }, { new: true });
        res.status(200).send('Discount created');
    });
}
exports.createDiscountHandler = createDiscountHandler;
///////////////////////// (DELETE) */api/courses/:courseId/discount* /////////////////////////
function deleteDiscountHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const discountId = req.params.discountId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const discount = course.discounts.find((discount) => String(discount._id) === discountId);
        if (!discount) {
            return res.status(404).send('Discount not found');
        }
        yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId }, { $pull: { discounts: { _id: discountId } } }, { new: true });
        res.status(200).send('Discount deleted');
    });
}
exports.deleteDiscountHandler = deleteDiscountHandler;
///////////////////////// (PATCH) */api/courses/:courseId/discount* /////////////////////////
function updateDiscountHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const courseId = req.params.courseId;
        const discountId = req.params.discountId;
        const user = res.locals.user;
        const course = yield courses_model_1.default.findOne({ _id: courseId }).lean();
        if (!course) {
            return res.status(404).send('Course not found');
        }
        if (String((_a = course.instructor) === null || _a === void 0 ? void 0 : _a._id) !== user._id && res.locals.user.type !== 'admin') {
            return res.status(403).send('You are not allowed to edit this Course');
        }
        const discount = course.discounts.find((discount) => String(discount._id) === discountId);
        if (!discount) {
            return res.status(404).send('Discount not found');
        }
        const { code, discount: newDiscount } = req.body;
        if (!code || !newDiscount) {
            return res.status(400).send('No code or discount provided');
        }
        yield (0, course_service_1.findAndUpdateCourse)({ _id: courseId, 'discounts._id': discountId }, { $set: { 'discounts.$.code': code, 'discounts.$.discount': newDiscount } }, { new: true });
        res.status(200).send('Discount updated');
    });
}
exports.updateDiscountHandler = updateDiscountHandler;
