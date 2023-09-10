import { RequestHandler } from 'express';
import PostModel from '../models/post';
import env from "../util/validateEnv";
import mongoose from 'mongoose';
const jwt = require("jsonwebtoken");

export const getPosts: RequestHandler = async (req, res, next) => {
    
    const userId = req.params.userId;
    
    

    // USE PRISMA CLIENT TO GET POST
}

interface PostBody {
    content: string;
    topic?: string;
    likes?: [string];
}

export const createPost: RequestHandler<unknown, unknown, PostBody, unknown> = async (req, res, next) => {

    const { token } = req.cookies;
    const content = req.body.content;
    const topic = req.body.topic || "";
    const likes = req.body.likes || [];

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            try {
                const post = await PostModel.create({
                    owner: decodedUser.id,
                    content,
                    topic,
                    likes,
                });

                res.json(post);
            } catch (error) {
                console.error(error);
                res.json(null);
            }
        })
    }
    else {
        console.log("User not signed in");
        res.json(null);
    }
};

export const deletePost: RequestHandler = async (req, res, next) => {

    const postId = req.params.postId;
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;
            
            try {
                const post = await PostModel.findByIdAndDelete(postId);

                res.json(post);
            } catch (error) {
                console.error(error);
                res.json(null);
            }
        })
    }
}

export const likePost: RequestHandler = async (req, res, next) => {

    const postId = req.params.postId;
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;
            
            try {
                let post = await PostModel.findById(postId).exec();

                if (post) {
                    if (post.likes.includes(decodedUser.id)) {
                        post.likes = post.likes.filter(id => id.toString() !== decodedUser.id);
                    }
                    else {
                        post.likes.push(decodedUser.id);
                    }

                    res.json(await post.save());
                }
                else {
                    res.json(null);
                }
                
            } catch (error) {
                console.error(error);
                res.json(null);
            }
        })
    }
}