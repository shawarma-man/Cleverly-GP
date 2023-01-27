import { Request, Response, NextFunction } from "express";


const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || user.type !== "admin") {
        return res.status(401).send("Unauthorized");
    }

    return next();
}

export default requireAdmin;