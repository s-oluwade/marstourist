import { Express, RequestHandler } from "express";
import createHttpError from "http-errors";
import UserDataModel from "../models/userData";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { email } from "envalid";
import env from "../util/validateEnv";
import DataModel from "../models/data";
import UserModel from "../models/user";
import GunModel from "../models/guns";
import { NextFunction } from "express-serve-static-core";
const imageDownloader = require('image-downloader');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require('fs');

export const getUserData: RequestHandler = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userData = await UserDataModel.find({ owner: decodedUser.id }).exec();
            res.json(userData);
        })
    }
    else {
        res.json(null);
    }
}

export const getSiteData: RequestHandler = async (req, res, next) => {
    try {
        const data = await DataModel.find().exec();
        res.json(data[0]);
    } catch (error) {
        next(error);
    }
}

export const getGuns: RequestHandler = async (req, res, next) => {
    try {
        const data = await GunModel.find().exec();
        res.json(data);
    } catch (error) {
        next(error);
    }
}

export const uploadPhotoByLink: RequestHandler = async (req, res, next) => {

    const { link } = req.body;
    const newName = Date.now() + '.jpg';

    await imageDownloader.image({
        url: link,
        dest: __dirname + '/../../uploads/' + newName,
    });

    res.json(newName);
}

interface UserPhotoBody {
    id: string;
    photo?: string;
}

export const updateUserPhoto: RequestHandler<unknown, unknown, UserPhotoBody, unknown> = async (req, res, next) => {
    const { token } = req.cookies;
    const {
        id,
        photo,
    } = req.body;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userDoc = await UserDataModel.findById(id);
            if (userDoc && decodedUser.id === userDoc.owner) {
                userDoc.set({
                    photo
                });

                res.status(200).json(await userDoc.save());
            }
        })
    }
    else {
        res.json(null);
    }
}

export const uploadPhoto: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
    
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const uploadedFiles = [];
            if (typeof req.files === 'object') {
        
                let values = Object.values(req.files)
        
                for (let i = 0; i < values.length; i++) {
                    const {path, originalname} = values[i];
                    const parts = originalname.split('.');
                    const ext = parts[parts.length - 1];
                    const newPath = path + '.' + ext;
                    fs.renameSync(path, newPath);
                    uploadedFiles.push(newPath.replace('uploads/', ''));
                }
            }
            
            const userData = await UserDataModel.findOne({owner: decodedUser.id});

            if (!userData) throw new Error;

            userData.set('photo', uploadedFiles[0]);
            
            res.json(await userData.save());
        })
    }
}

interface UserDataBody {
    race?: string;
    bio?: string;
    base?: string;
    origin?: string;
}

export const updateUserProfile: RequestHandler<unknown, unknown, UserDataBody, unknown> = async (req, res, next) => {
    const { token } = req.cookies;

    let {
        race,
        bio,
        base,
        origin,
    } = req.body;

    if (race?.toLowerCase() == "unspecified") {
        race = "";
    }
    else if (bio?.toLowerCase() == "unspecified") {
        bio = "";
    }
    else if (base?.toLowerCase() == "unspecified") {
        base = "";
    }
    else if (origin?.toLowerCase() == "unspecified") {
        origin = "";
    }

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userDoc = await UserDataModel.findOne({owner: decodedUser.id});
            if (!userDoc) throw new Error;

            userDoc.set({
                race,
                bio,
                base,
                origin,
            });

            res.status(200).json(await userDoc.save());
        })
    }
    else {
        res.json(null);
    }
}