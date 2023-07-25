import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAdminAuth: RequestHandler = (req, res, next) => {
    console.log("Admin Auth");
    console.log(req.cookies);
    if (req.session.adminId) {
        next();
    } else {
        next(createHttpError(401, "Admin not authenticated"));
    }
};