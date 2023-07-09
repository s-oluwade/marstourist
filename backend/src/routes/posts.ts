import express from "express";
import * as PostsController from "../controllers/posts";

const router = express.Router();

router.get("/", PostsController.getPosts);

router.get("/profile-names", PostsController.getNames);

router.get("/profile-pictures", PostsController.getPictures);

router.get("/:userId", PostsController.getPosts);

router.post("/", PostsController.createPost);

router.delete("/:postId", PostsController.deletePost);

export default router;
