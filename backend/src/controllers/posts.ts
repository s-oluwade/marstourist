import { RequestHandler } from 'express';
import PostModel from '../models/post';
import UserModel from "../models/user";
import env from "../util/validateEnv";
const jwt = require("jsonwebtoken");

export const getPosts: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;

    if (userId) {
        console.log("get user post for user " + userId);
        try {
            const data = await PostModel.find({ owner: userId });
            console.log(data[0]);
            res.json(data);
        } catch (error) {
            res.json(null);
        }
    }
    else {
        console.log("get all posts");
        try {
            const data = await PostModel.find({});
            res.json(data);
        } catch (error) {
            res.json(null);
        }
    }

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
        console.log("User token not found");
        res.json(null);
    }
};

export const updatePost: RequestHandler<unknown, unknown, PostBody, unknown> = async (req, res, next) => {
    const { token } = req.cookies;
    // const content = req.body.content;
    // const topic = req.body.topic;
    // const likes = req.body.likes;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;



        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};
