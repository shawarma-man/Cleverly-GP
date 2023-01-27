import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import CoursesModel, { CoursesDocument, courses } from '../models/courses.model';


export async function findCourse(query: FilterQuery<Document>, isOne: boolean, limit?: number) {
    if (isOne) {
        return CoursesModel.findOne(query).lean();
    } else {
        return CoursesModel.find(query).lean();
    }
}
export async function createCourse(input: DocumentDefinition<CoursesDocument>) {
    try {
        return await CoursesModel.create(input);
    } catch (error: any) {
        throw new Error(error);
    }
}
export async function deleteCourse(query: FilterQuery<CoursesDocument>) {
    return CoursesModel.deleteOne(query);
}

export async function findAndUpdateCourse(
    query: FilterQuery<CoursesDocument>,
    update: UpdateQuery<CoursesDocument>,
    options: QueryOptions
) {
    return CoursesModel.findOneAndUpdate(query, update, options);
}