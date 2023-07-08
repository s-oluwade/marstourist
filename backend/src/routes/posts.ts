import express from "express";
import * as PostsController from "../controllers/posts";

const router = express.Router();

router.get("/", PostsController.getPosts);

router.get("/:userId", PostsController.getPosts);

router.post("/", PostsController.createPost);

// router.delete("/", PostsController.deletePost);

// router.put("/", PostsController.editPost);

export default router;
