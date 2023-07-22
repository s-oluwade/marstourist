import { RequestHandler } from "express";
import DataModel from "../models/data";
import env from "../util/validateEnv";
import mongoose from "mongoose";
const imageDownloader = require('image-downloader');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require('fs');

export const getSiteData: RequestHandler = async (req, res, next) => {
    
    try {
        const data = await DataModel.find().exec();
        res.json(data[0]);
    } catch (error) {
        res.json(null);
    }
}
