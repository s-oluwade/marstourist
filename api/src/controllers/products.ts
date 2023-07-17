import { RequestHandler } from "express";
import Product from "../models/product";
import mongoose from "mongoose";
import env from "../util/validateEnv";

export const getProducts: RequestHandler = async (req, res, next) => {
    mongoose.connect(env.MONGO_CONNECTION_STRING);

    const title = req.query.title;
    const brand = req.query.brand;
    const category = req.query.category;
    const description = req.query.description;
    const discountPercentage = req.query.discountPercentage;
    const price = req.query.price;
    const ratings = req.query.ratings;
    const stock = req.query.stock;
    
    let params: { [key: string]: any } = { title, brand, category, description, discountPercentage, price, ratings, stock };
    
    for (const key of Object.keys(params)) {
        if (params[key] === undefined) {
            delete params[key];
        }
    }

    try {
        // if no query parameters, get all products
        const products = await Product.find({ ...params }).exec();
        // else get all products that match the query parameters
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

interface ProductBody {
    title: string,
    brand: string,
    category: string,
    description?: string,
    discountPercentage?: number,
    images: string[],
    price?: number,
    stock?: number,
    thumbnail?: string,
}

export const addProducts: RequestHandler<unknown, unknown, ProductBody[], unknown> = async (req, res, next) => {
    mongoose.connect(env.MONGO_CONNECTION_STRING);

    try {
        const added = await Product.create(req.body);

        res.status(200).json(added.length);
    } catch (error) {
        next(error);
    }
};