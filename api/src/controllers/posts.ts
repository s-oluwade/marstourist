import { RequestHandler } from 'express';
import PostModel from '../models/post';
import env from "../util/validateEnv";
import ProfileNamesModel from '../models/profileNames';
import ProfilePicturesModel from '../models/profilePictures';
import mongoose from 'mongoose';
const jwt = require("jsonwebtoken");

export const getPosts: RequestHandler = async (req, res, next) => {
    
    const userId = req.params.userId;

    if (userId) {
        try {
            const post = await PostModel.find({ owner: new mongoose.Types.ObjectId(userId) }).exec();
            res.json(post);
        } catch (error) {
            res.json(null);
        }
    }
    else {
        try {
            const posts = await PostModel.find({}).exec();
            res.json(posts);
        } catch (error) {
            res.json(null);
        }
    }
}

export const getNames: RequestHandler = async (req, res, next) => {

    try {
        const data = await ProfileNamesModel.find({}).exec();
        const map = {} as {[key: string]:string};

        for (const each of data) {
            map[each.owner.toString()] = each.name;
        }

        res.json(map);
    } catch (error) {
        res.json(null);
    }
}

export const getPictures: RequestHandler = async (req, res, next) => {

    try {
        const data = await ProfilePicturesModel.find({}).exec();

        const map = {} as {[key: string]:string};

        for (const each of data) {
            map[each.owner.toString()] = each.picture || '';
        }

        res.json(map);
    } catch (error) {
        res.json(null);
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