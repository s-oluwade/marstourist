import express from "express";
import * as PostsController from "../controllers/posts";

const router = express.Router();

router.get("/", PostsController.getPosts);

router.get("/:userId", PostsController.getPosts);

router.post("/", PostsController.createPost);

router.delete("/:postId", PostsController.deletePost);

router.put("/like/:postId", PostsController.likePost);

export default router;
