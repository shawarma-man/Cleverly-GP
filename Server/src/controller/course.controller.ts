import { Request, Response } from "express";
import { createCourse, deleteCourse, findAndUpdateCourse, findCourse } from "../service/course.service";
import logger from "../utils/logger";
import CoursesModel from '../models/courses.model';
import { findAndUpdateUser, findUser } from "../service/user.service";
import storage from "../../config/storage";
import { getDurationFromBuffer } from "../utils/findDuration";
import processVideo from "../middleware/upload";
import { omit } from "lodash";
import mongoose from "mongoose";
import _ from "lodash";
import { generateAndUploadThumbnail } from "../utils/thumb.extractor";
import { getUserSessionsHandler } from "./session.controller";
import moment from "moment";
///////////////////////// (Post) */api/courses* /////////////////////////
export async function createCourseHandler(
    req: Request,
    res: Response
) {
    const user = res.locals.user;

    try {
        const course = await createCourse({ ...req.body, instructor: user });
        if (course) {
            await findAndUpdateUser({ _id: user._id }, { $push: { publishedCourses: course } }, {
                new: true,
            });
        }
        return res.json(course);
    }
    catch (e: any) {
        logger.error(e);
        return res.status(409).json({ messege: "Connot create Course" });
    }
}
///////////////////////// (GET)*/api/courses/:courseId* /////////////////////////
export async function getCourseHandler(req: Request, res: Response) {
    const result = await CoursesModel.findOne({ _id: req.params.courseId }).lean();

    if (!result) return res.status(404).json({ messege: "Course not found" });
    if (result.students_count === 0) return res.json({ ...result, students: [{ _id: "" }] });
    return res.json(result);
}
///////////////////////// (PATCH) */api/courses/:courseId* /////////////////////////
export async function updateCourseHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const courseId = req.params.courseId;
    const update = req.body;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== userId && res.locals.user.type !== "admin") {
        return res.status(403).json({ messege: "You are not authorized to update this course" });
    }
    try {
        const updateFields = _.omit(update, "rating", "reviews", "students", "instructor", "createdAt", "updatedAt", "__v", "students_count", "review_count", "videos", "quizes", "_id");
        console.log(updateFields);
        const updated = await findAndUpdateCourse({
            _id: courseId
        }, updateFields, { new: true })
        console.log(updated);
        return res.status(200).json({ messege: "Course updated successfully" });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }
}

///////////////////////// (GET) */api/courses/search/:searchTerm* /////////////////////////
export async function searchCourseHandler(req: Request, res: Response) {
    console.log(req.params.searchTerm);
    try {
        const result = await findCourse({
            name: { $regex: req.params.searchTerm as String, $options: "i" },
        }, false);
        if (!result) return res.status(404).json({ messege: "Course not found" });
        res.json(result);
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error occured" });
    }
}
///////////////////////// (GET) */api/courses/category/:category* /////////////////////////
export async function getCourseByCategoryHandler(req: Request, res: Response) {
    const category = req.params.category;
    try {
        const result = await findCourse({ category: category }, false);
        if (!result) return res.status(404).json({ messege: "Course not found" });
        res.json(result);
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error occured" });
    }
}
export async function getCourseByInstructorHandler(req: Request, res: Response) {
    const instructorId = req.params.instructor;
    try {
        const result = await findCourse({ 'instructor._id': instructorId }, false);
        console.log(result);
        if (!result) return res.status(404).json({ messege: "Course not found" });
        res.json(result);
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error occured" });
    }
}
///////////////////////// (DELETE) */api/courses/:courseId* /////////////////////////
export async function deleteCourseHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const courseId = req.params.courseId;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    console.log(course.instructor?._id);
    if (String(course.instructor?._id) !== userId && res.locals.user.type !== "admin") {
        return res.status(403).json({ messege: "You are not authorized to delete this course" });
    }

    await deleteCourse({ courseId });

    return res.status(200).json({ messege: "Course deleted successfully" });
}
///////////////////////// (POST) */api/courses/:courseId/enroll* /////////////////////////
// export async function enrollCourseHandler(req: Request, res: Response) {
//     const user = res.locals.user;
//     const courseId = req.params.courseId;

//     const course = await CoursesModel.findOne({ _id: courseId }).lean();

//     if (!course) {
//         return res.status(404).json({ messege: "Course not found" });
//     }
//     const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
//     if (isEnrolled) {
//         return res.status(403).json({ messege: "You are already enrolled in this course" });
//     }

//     const isPublished = await findUser({ _id: user._id, publishedCourses: course }, true);

//     if (isPublished) {
//         return res.status(403).json({ messege: "You are the instructor of this course" });
//     }
//     if (user.bala > 0) {
//         return res.status(403).send("This course is not free");
//     }

//     try {
//         await findAndUpdateUser({ _id: user._id }, { $push: { ownedCourses: course } }, {
//             new: true,
//         });

//         await findAndUpdateCourse({ _id: courseId }, { $push: { students: user }, $inc: { students_count: 1 } }, {
//             new: true,
//         });
//         return res.status(200).send("Course enrolled");
//     }
//     catch (e: any) {
//         res.status(500).json({ messege: "An unexpected error happened" });
//     }

// }
///////////////////////// (Post) */api/courses/:courseId/review* /////////////////////////
export async function reviewCourseHandler(req: Request, res: Response) {
    const user = res.locals.user;
    const courseId = req.params.courseId;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const isReviewed = await findCourse({ _id: courseId, reviews: { $elemMatch: { _id: user._id } } }, true);
    if (isReviewed) {
        return res.status(403).json({ messege: "You are already reviewed this course" });
    }
    if (req.body.rating > 5 || req.body.rating < 1) {
        return res.status(403).json({ messege: "Rating must be between 1 and 5" });
    }
    let newRating = 0;
    newRating = (course.rating * course.review_count + req.body.rating) / (course.review_count + 1);
    try {
        await findAndUpdateCourse({ _id: courseId }, { $push: { reviews: { _id: user._id, username: user.username, profilePic: user.profilePic, ...req.body } }, $inc: { review_count: 1 }, rating: newRating }, { new: true });
        return res.status(200).json({ messege: "Course reviewed" });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }
}
///////////////////////// (DELETE) */api/courses/:courseId/review* /////////////////////////
export async function deleteReviewHandler(req: Request, res: Response) {
    const user = res.locals.user;
    const courseId = req.params.courseId;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const isReviewed = await CoursesModel.findOne({ _id: courseId, reviews: { $elemMatch: { _id: user._id } } });
    if (!isReviewed) {
        return res.status(403).json({ messege: "You have not reviewed this course" });
    }
    let newRating = 0;
    newRating = (course.rating * course.review_count - isReviewed.rating) / (course.review_count - 1);
    try {
        await findAndUpdateCourse({ _id: courseId }, { $pull: { reviews: { _id: user._id } }, $inc: { review_count: -1 }, rating: newRating }, { new: true });
        return res.status(200).json({ messege: "Review deleted" });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }

}
///////////////////////// (Post) */api/courses/:courseId/quiz* /////////////////////////
export async function addQuizToCourseHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const courseId = req.params.courseId;
    console.log(req.body);
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== userId && res.locals.user.type !== "admin") {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    //check if questions field is string or not
    if (typeof req.body.questions == "string") {
        let questions = JSON.parse(req.body.questions);
        req.body.questions = questions;
    }
    let q_num = Object.keys(req.body.questions).length;
    try {
        const id = new mongoose.Types.ObjectId();
        const quiz = await findAndUpdateCourse({ _id: courseId }, { $push: { quizes: { _id: id, num_questions: q_num, ...req.body } } }, { new: true });
        return res.status(200).json({ messege: "Quiz added", id });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }

}
export async function addQuestionToQuizHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const courseId = req.params.courseId;
    const quizId = req.params.quizId;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== userId && res.locals.user.type !== "admin") {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const quiz = course.quizes.find((quiz: any) => quiz._id == quizId);
    if (!quiz) {
        return res.status(404).json({ messege: "Quiz not found" });
    }
    try {
        const id = new mongoose.Types.ObjectId();
        const quiz = await findAndUpdateCourse({ _id: courseId, "quizes._id": quizId }, { $push: { "quizes.$.questions": { _id: id, ...req.body } }, $inc: { "quizes.$.num_questions": 1 } }, { new: true });
        return res.status(200).json({ messege: "Question added", id });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }

}
///////////////////////// (GET) */api/courses/:courseId/:quizId* /////////////////////////
export async function getQuizHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const quizId = req.params.quizId;
    const user = res.locals.user;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const quiz = course.quizes.find((quiz: any) => quiz._id == quizId);
    if (!quiz) {
        return res.status(404).json({ messege: "Quiz not found" });
    }
    if (quiz.submissions.length == 0) {
        return res.json({ ...quiz, submissions: [{ _id: "" }] });
    }
    return res.status(200).json(quiz);
}
///////////////////////// (Post) */api/courses/:courseId/:quizId/submit* /////////////////////////
export async function submitQuizHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const quizId = req.params.quizId;
    const user = res.locals.user;
    console.log(req.body);
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const quiz = course.quizes.find((quiz: any) => quiz._id == quizId);
    if (!quiz) {
        return res.status(404).json({ messege: "Quiz not found" });
    }
    const isSubmitted = await findCourse({ _id: courseId, quizes: { $elemMatch: { _id: quizId, submissions: { $elemMatch: { _id: user._id } } } } }, true);
    if (isSubmitted) {
        return res.status(403).json({ messege: "You have already submitted this quiz" });
    }
    let score = 0;
    if (quiz.num_questions != Object.keys(req.body).length) {
        return res.status(403).json({ messege: "You have not answered all the questions" });
    }
    for (let i = 0; i < quiz.num_questions; i++) {
        if (quiz.questions[i].answer == req.body[i]) {
            score++;
        }
    }
    try {
        await findAndUpdateCourse({ _id: courseId, quizes: { $elemMatch: { _id: quizId } } }, { $push: { "quizes.$.submissions": { _id: user._id, username: user.username, score, answers: req.body } } }, { new: true });
        return res.status(200).json({ messege: "Quiz submitted" });
    }
    catch (e: any) {
        res.status(500).json({ messege: "An unexpected error happened" });
    }
}
///////////////////////// (GET) */api/courses/:courseId/:quizId/submissions* /////////////////////////
export async function getQuizSubmissionsHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const quizId = req.params.quizId;
    const user = res.locals.user;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const quiz = course.quizes.find((quiz: any) => quiz._id == quizId);
    if (!quiz) {
        return res.status(404).json({ messege: "Quiz not found" });
    }
    if (quiz.submissions.length == 0) {
        return res.json({ submissions: [{ _id: "" }] });
    }
    return res.status(200).json(quiz.submissions);
}
export async function getMyScoreHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const quizId = req.params.quizId;
    const user = res.locals.user;

    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    const isEnrolled = await findCourse({ _id: courseId, students: user }, true);
    if (!isEnrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }
    const quiz = course.quizes.find((quiz: any) => quiz._id == quizId);
    if (!quiz) {
        return res.status(404).json({ messege: "Quiz not found" });
    }
    const submission = quiz.submissions.find((submission: any) => submission._id == user._id);
    if (!submission) {
        return res.status(404).json({ messege: "You have not submitted this quiz" });
    }
    return res.status(200).json(submission);
}
///////////////////////// (GET) */api/courses/recommendations* /////////////////////////
export async function getRecommendationsHandler(req: Request, res: Response) {
    const user = res.locals.user;
    ///test
    const course = await CoursesModel.findOne({ students: user }).lean();
    if (!course) {
        const recommendation = await CoursesModel.find({ 'instructor._id': { $ne: user._id } }).limit(5).lean();
        return res.status(200).json(recommendation);
    }
    else {
        const recommendation = await CoursesModel.aggregate([
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
                    thumbnail: 1,
                    _id: 1,
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
            const fill = await CoursesModel.find({ category: { $ne: course.category }, 'instructor._id': { $ne: user._id }, _id: { $ne: course._id } }).limit(5 - recommendation.length).lean()
            recommendation.push(...fill)
        }
        return res.status(200).json(recommendation);
    }
}
///////////////////////// (GET) */api/courses/tryCourses* /////////////////////////
export async function getTryCoursesHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const courses = await CoursesModel.find({ 'students._id': userId }).lean();
    const coursesIds = courses.map((course: any) => course._id);
    const recommendations = await CoursesModel.find({ _id: { $nin: coursesIds }, 'instructor._id': { $ne: userId } },).limit(5).lean();
    return res.status(200).json(recommendations);
}

export async function getTopCoursesHandler(req: Request, res: Response) {
    const courses = await CoursesModel.find({}).sort({ rating: -1 }).limit(5).lean();
    return res.status(200).json(courses);
}
///////////////////////// (POST) */api/courses/:courseId/videos* /////////////////////////
export async function uploadVideoHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    try {
        await processVideo(req, res);
        const info = JSON.parse(req.body.info);
        if (!info || !info.name || !info.description || !info.thumbnail) {
            console.log("here");
            return res.status(400).json({ messege: "Please provide name and description and a thumbnail url" });
        }
        if (!req.file) {
            console.log("here2");
            return res.status(400).json({ messege: "Please upload a file" });
        }
        const originalName = req.file.originalname;
        const extension = originalName.split('.').pop();
        // const uniqueId = uuidv4();
        const uniqueName = `${info.name}`;
        const bucket = storage.bucket("cleverly_videos");
        const blob = bucket.file(`${course.name}/${uniqueName}.${extension}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on("error", (err) => {
            res.status(500).json({ messege: "Something is wrong! Unable to upload at the moment." });
        });

        blobStream.on("finish", async () => {
            const [publicUrl] = await blob.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            });
            if (!req.file) {
                return res.status(400).json({ messege: "Please upload a file" });
            }
            const gsuri = `gs://cleverly_videos/${course.name}/${uniqueName}.${extension}`;
            const duration = await getDurationFromBuffer(req.file.buffer);
            // const thumbnailUrl = await generateAndUploadThumbnail(gsuri, `${course.name}/${uniqueName}`);
            await findAndUpdateCourse(
                { _id: courseId },
                { $push: { videos: { _id: new mongoose.Types.ObjectId(), name: info.name, description: info.description, video: publicUrl, extension: extension, duration: duration, thumbnail: info.thumbnail } } },
                { new: true }
            );
            res.status(200).json({
                message: "Uploaded the file successfully: " + req.file.originalname,
                url: publicUrl,
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err: any) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).json({
                message: "File size cannot be larger than 2MB!",
            });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file!" });
        }
        res.status(500).json({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};
///////////////////////// (PATCH) */api/courses/:courseId/videos* /////////////////////////
export async function updateVideoHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const videoId = req.params.videoId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const video = course.videos.find((video) => String(video._id) === videoId);
    if (!video) {
        return res.status(404).json({ messege: "Video not found" });
    }
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ messege: "Please provide name and description" });
    }
    await findAndUpdateCourse({ _id: courseId, 'videos._id': videoId }, { $set: { 'videos.$.name': name, 'videos.$.description': description } }, { new: true });

    res.status(200).json({ messege: "Video updated successfully" });
}
///////////////////////// (GET) */api/courses/:courseId/videos* /////////////////////////
export async function getVideoHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const videoId = req.params.videoId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const video = course.videos.find((video) => String(video._id) === videoId);
    if (!video) {
        return res.status(404).json({ messege: "Video not found" });
    }
    res.status(200).json(video);
}
///////////////////////// (DELETE) */api/courses/:courseId/videos* /////////////////////////
export async function deleteVideoHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const videoId = req.params.videoId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const video = course.videos.find((video) => String(video._id) === videoId);
    if (!video) {
        return res.status(404).json({ messege: "Video not found" });
    }
    const bucket = storage.bucket('cleverly_videos');
    const blob = bucket.file(`${course.name}/${video.name}.${video.extension}`);
    await blob.delete();
    await findAndUpdateCourse({ _id: courseId }, { $pull: { videos: { _id: videoId } } }, { new: true });
    res.status(200).json({ messege: "Video deleted successfully" });
}
///////////////////////// (POST) */api/courses/:courseId/discount* /////////////////////////
export async function createDiscountHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const { code, discount } = req.body;
    if (!code || !discount) {
        return res.status(400).json({ messege: "Please provide code and discount" });
    }
    if (discount > 100 || discount < 0) {
        return res.status(400).json({ messege: "Discount must be between 0 and 100" });
    }
    await findAndUpdateCourse({ _id: courseId }, { $push: { discounts: { code, discount, _id: new mongoose.Types.ObjectId(), } } }, { new: true });
    res.status(200).json({ messege: "Discount created successfully" });
}
///////////////////////// (DELETE) */api/courses/:courseId/discount* /////////////////////////
export async function deleteDiscountHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const discountId = req.params.discountId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const discount = course.discounts.find((discount) => String(discount._id) === discountId);
    if (!discount) {
        return res.status(404).json({ messege: "Discount not found" });
    }
    await findAndUpdateCourse({ _id: courseId }, { $pull: { discounts: { _id: discountId } } }, { new: true });
    res.status(200).json({ messege: "Discount deleted successfully" });
}
///////////////////////// (PATCH) */api/courses/:courseId/discount* /////////////////////////
export async function updateDiscountHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const discountId = req.params.discountId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    const discount = course.discounts.find((discount) => String(discount._id) === discountId);
    if (!discount) {
        return res.status(404).json('Discount not found');
    }
    const { code, discount: newDiscount } = req.body;
    if (!code || !newDiscount) {
        return res.status(400).json({ message: 'No code or discount provided' });
    }
    await findAndUpdateCourse({ _id: courseId, 'discounts._id': discountId }, { $set: { 'discounts.$.code': code, 'discounts.$.discount': newDiscount } }, { new: true });
    res.status(200).json({ message: 'Discount updated' });
}

//function that adds all courses to instructor's courses array
export async function addCourseToInstructor(req: Request, res: Response) {
    const user = res.locals.user;
    const course = await CoursesModel.find({ 'students._id': user._id }).lean();
    await findAndUpdateUser({ _id: user._id }, { $push: { ownedCourses: course } }, { new: true });
    res.status(200).json({ messege: "Course added to instructor" });
}

export async function createMeetingHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }

    const { meetingId, meetingPassword, meetingTime, meetingDate } = req.body;
    try {
        await CoursesModel.findOneAndUpdate({ _id: req.params.courseId }, { $set: { zoom: { meetingId: meetingId, meetingPassword, meetingTime, meetingDate } } });
        res.status(200).json({ message: 'Meeting created successfully', meetingId, meetingPassword, meetingTime, meetingDate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating meeting' });
    }
}

export async function getMeetingHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    //check if use is enrolled in course
    const enrolled = course.students.find((student) => String(student._id) === user._id);
    if (!enrolled) {
        return res.status(403).json({ messege: "You are not enrolled in this course" });
    }


    try {
        const course = await CoursesModel.findOne({ _id: req.params.courseId });
        res.status(200).json({ message: 'Meeting retrieved successfully', meeting: course?.zoom });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving meeting' });
    }
}

export async function deleteMeetingHandler(req: Request, res: Response) {
    const courseId = req.params.courseId;
    const user = res.locals.user;
    const course = await CoursesModel.findOne({ _id: courseId }).lean();

    if (!course) {
        return res.status(404).json({ messege: "Course not found" });
    }
    if (String(course.instructor?._id) !== user._id && res.locals.user.type !== 'admin') {
        return res.status(403).json({ messege: "You are not the instructor of this course" });
    }
    try {
        await CoursesModel.findOneAndUpdate({ _id: req.params.courseId }, { $set: { zoom: {} } });
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting meeting' });
    }
}
