import { Request, Response } from 'express';
import util from 'util';
import Multer from 'multer';

const maxSize = 100000000;

const fileFilter = (req: Request, file: Express.Multer.File, cb: Multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).single("file");

const processFileMiddleware = util.promisify(processFile);

export default async function processVideo(req: Request, res: Response) {
    try {
        await processFileMiddleware(req, res);
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
}