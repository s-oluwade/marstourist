import {RequestHandler} from 'express';
import PostModel from '../models/post';
import env from '../util/validateEnv';
import UserModel from '../models/user';
import mongoose from 'mongoose';
const jwt = require('jsonwebtoken');

export const getPosts: RequestHandler = async (req, res, next) => {
  const id = req.params.userId;
  let posts = await PostModel.find({}).exec();

  if (id) {
    try {
      // posts = await PostModel.find({ userId: new mongoose.Types.ObjectId(id) }).exec();
      posts.filter((post) => post.userId === new mongoose.Types.ObjectId(id));
      res.json(posts);
    } catch (error) {
      res.json(null);
    }
  } else {
    // Just an update for posts thumbnail and user name
    for (const post of posts) {
      const user = await UserModel.findById(post.userId).exec();
      if (user) {
        // update post user thumbnail if missing
        if (user.thumbnail && !post.thumbnail) {
          post.set('thumbnail', user.thumbnail);
        }
        // update post user name if missing
        if (!post.owner) {
          post.set('owner', user.fullname);
        }
        await post.save();
      }
    }
    res.json(posts);
  }
};

interface PostBody {
  content: string;
  topic?: string;
  likes?: [string];
}

export const createPost: RequestHandler<unknown, unknown, PostBody, unknown> = async (req, res, next) => {
  const {token} = req.cookies;
  const content = req.body.content;
  const topic = req.body.topic || '';
  const likes = req.body.likes || [];

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      try {
        const post = await PostModel.create({
          userId: decodedUser.id,
          content,
          topic,
          likes,
        });

        res.json(post);
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  } else {
    console.log('User not signed in');
    res.json(null);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      try {
        const post = await PostModel.findByIdAndDelete(postId);

        res.json(post);
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  }
};

export const likePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any; name: string}) => {
      if (err) throw err;

      try {
        let post = await PostModel.findById(postId).exec();

        if (post) {
          if (post.likes.map((like) => like.userId.toString()).includes(decodedUser.id)) {
            post.likes = post.likes.filter((like) => like.userId.toString() !== decodedUser.id);
          } else {
            post.likes.push({userId: decodedUser.id, name: decodedUser.name});
          }
          res.json(await post.save());
        } else {
          res.json(null);
        }
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  }
};
