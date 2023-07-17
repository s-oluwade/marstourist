import express from "express";
import * as DataController from "../controllers/data";
const multer = require("multer");
const photosMiddleware = multer({dest:'uploads'});

const router = express.Router();

router.get("/guns", DataController.getGuns);

router.get("/site-data", DataController.getSiteData);

export default router;