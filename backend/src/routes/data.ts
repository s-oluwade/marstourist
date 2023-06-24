import express from "express";
import * as DataController from "../controllers/data";
const multer = require("multer");
const photosMiddleware = multer({dest:'uploads'});

const router = express.Router();

router.get("/guns", DataController.getGuns);

router.get("/siteData", DataController.getSiteData);

router.get("/userData", DataController.getUserData);

router.put("/userData", DataController.updateUserProfile);

router.put("/userPhoto", DataController.updateUserPhoto);

router.post("/uploadPhotoByLink", DataController.uploadPhotoByLink);

router.post("/uploadPhoto", photosMiddleware.array('photos', 100), DataController.uploadPhoto);

export default router;