import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';

export async function createUser(input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword' | 'firstName'
        | 'lastName' | 'bio' | 'profilePic' | 'ownedCourses' | 'publishedCourses' | 'type' | 'cart' | 'card' | 'isVerified'>>) {
    try {
        const user = await UserModel.create(input);
        return omit(user.toJSON(), 'password', 'ownedCourses', 'publishedCourses');
    } catch (error: any) {
        throw new Error(error);
    }
}
export async function validatePassword({ email, password }: { email: string, password: string }) {
    const user = await UserModel.findOne({ email });

    if (!user) {
        return false;
    }
    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return false;
    }
    return omit(user.toJSON(), 'password', 'ownedCourses', 'publishedCourses');
}

export async function findUser(query: FilterQuery<UserDocument>, isOne: boolean, limit?: number) {
    if (isOne) {
        return UserModel.findOne(query).lean();
    }
    else {
        return UserModel.find(query).lean();
    }
}

export async function deleteUser(query: FilterQuery<UserDocument>) {
    return UserModel.deleteOne(query);
}

export async function findAndUpdateUser(
    query: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options: QueryOptions
) {
    return UserModel.findOneAndUpdate(query, update, options);
}

