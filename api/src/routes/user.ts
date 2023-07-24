import express from "express";
import * as UserController from "../controllers/user";
import { requiresAdminAuth } from "../middleware/adminAuth";
const multer = require("multer");
const photosMiddleware = multer({dest:'uploads'});

const router = express.Router();

router.get("/", UserController.getUser);

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.put("/", UserController.updateUserCredentials);

router.put("/profile", UserController.updateUserProfile);

router.put("/add-credit", UserController.addCredit);

// not in use
// router.post("/uploadPhotoByLink", UserController.uploadPhotoByLink);

router.put("/uploadPhoto", photosMiddleware.array('photos', 100), UserController.uploadPhoto);

export default router;