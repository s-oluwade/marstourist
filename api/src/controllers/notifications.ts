import { RequestHandler } from 'express';
import NotificationsModel from '../models/notifications';
import env from "../util/validateEnv";
import mongoose from 'mongoose';
const jwt = require("jsonwebtoken");

export const getNotifications: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            try {
                const data = await NotificationsModel.findOne({ owner: decodedUser.id }).exec();
                res.json(data?.notifications);
            } catch (error) {
                res.json(null);
            }
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
}

export const addNotification: RequestHandler<{ userId: string }, unknown, string[], unknown> = async (req, res, next) => {
    const notifications = req.body;
    const user = req.params.userId;

    try {
        const userNotification = await NotificationsModel.findOne({ owner: new mongoose.Types.ObjectId(user) }).exec();
        if (userNotification) {
            userNotification.notifications = [...userNotification.notifications, ...notifications];
            res.json((await userNotification.save()).notifications);
        }
        else {
            res.json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const removeNotification: RequestHandler<{ userId: string }, unknown, string[], unknown> = async (req, res, next) => {
    const notifications = req.body;
    const user = req.params.userId;
    
    try {
        let userNotification = await NotificationsModel.findOne({ owner: new mongoose.Types.ObjectId(user) }).exec();
        if (userNotification) {
            let result = userNotification.notifications.filter(notification => !notifications.includes(notification));
            userNotification.notifications = result;
            await userNotification.save();
            res.json(result);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}