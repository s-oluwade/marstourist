import { RequestHandler } from 'express';
import env from "../util/validateEnv";
import NotificationsModel from '../models/notifications';
const jwt = require("jsonwebtoken");

export const getNotifications: RequestHandler = async (req, res, next) => {
    try {
        const data = await NotificationsModel.findOne().exec();
        res.json(data?.notifications);
    } catch (error) {
        res.json(null);
    }
}

// export const createNotificationsCollection: RequestHandler = async (req, res, next) => {
//     try {
//         await NotificationsModel.create({
//             notifications: new Map<string, string[]>()
//         });
//     } catch (error) {
//         console.error(error);
//         res.json(null);
//     }
// };

export const addNotification: RequestHandler<{ userId: string }, unknown, string[], unknown> = async (req, res, next) => {
    const notifications = req.body;
    const user = req.params.userId;

    try {
        const notif = await NotificationsModel.findOne().exec();
        if (notif && notif.notifications) {
            const usersNotifications = notif.notifications.get(user);
            if (usersNotifications) {
                usersNotifications.concat(notifications);
                notif.notifications.set(user, usersNotifications);
                res.json(await notif.save());
            }
            else {
                notif.notifications.set(user, notifications);
                res.json(await notif.save());
            }
        }

    } catch (error) {
        console.error(error);
        res.json(null);
    }
}