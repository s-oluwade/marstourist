import { RequestHandler } from "express";
import DataModel from "../models/data";
import GunModel from "../models/guns";
const imageDownloader = require('image-downloader');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require('fs');

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
