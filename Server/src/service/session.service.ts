import SessionModel from "../models/session.model";
import config from "config";
import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import { SessionDocument } from "../models/session.model";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });

    return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean();
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>, isOne = true) {
    if (isOne) return SessionModel.updateOne(query, update);
    else return SessionModel.updateMany(query, update);
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

    if (!decoded || !get(decoded, "session")) return false;

    const session = await SessionModel.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user }, true);

    if (!user) return false;

    const accessToken = signJwt(
        { ...user, session: session._id },
        "accessTokenPrivateKey",
        { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );

    return accessToken;
}