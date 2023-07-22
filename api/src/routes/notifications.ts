import express from "express";
import * as NotificationsController from "../controllers/notifications";

const router = express.Router();

router.get("/", NotificationsController.getNotifications);

router.post("/add/:userId", NotificationsController.addNotification);

router.put("/remove/:userId", NotificationsController.removeNotification);

export default router;
