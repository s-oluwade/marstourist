import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import CartModel from "../models/cart";
import ProfileNames from "../models/profileNames";
import ProfilePictures from "../models/profilePictures";
import UserModel from "../models/user";
import env from "../util/validateEnv";
import PurchasedModel from "../models/purchased";
import mongoose from "mongoose";
const imageDownloader = require('image-downloader');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);

export const getUsers: RequestHandler = async (req, res, next) => {
    // admin already verified. just fetch users
    try {
        const users = await UserModel.find({}).select("+email").exec();
        res.status(200).json([users]);
    } catch (error) {
        next(error);
    }
};

export const getUser: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const user = await UserModel.findById(decodedUser.id).select("+email").exec();

            res.status(200).json(user);
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};

export const getCart: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            let cart = await CartModel.findOne({ owner: decodedUser.id }).exec();
            if (!cart) {
                cart = await CartModel.create({ owner: decodedUser.id, productIds: [] });
                res.status(200).json(cart);
            }
            else {
                if (!cart.products.get("total")) {
                    cart.products.set("total", {count: 0, timestamp: new Date().getTime()});
                    res.json(await cart.save());
                }
                else {
                    res.json(cart);
                }
            }
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};

export const addToCart: RequestHandler<unknown, unknown, { item: string }, unknown> = async (req, res, next) => {
    const itemToAdd = req.body.item;
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const cart = (await CartModel.find({ owner: decodedUser.id }).exec())[0];
            const cartItem = cart.products.get(itemToAdd);

            if (cartItem) {
                cartItem.count += 1;
                cartItem.timestamp = Date.now();
                cart.products.set(itemToAdd, cartItem);
            }
            else {
                cart.products.set(itemToAdd, {
                    count: 1,
                    timestamp: Date.now(),
                })
            }

            const total = cart.products.get("total");
            if (total) {
                total.count += 1;
                total.timestamp = Date.now();
                cart.products.set("total", total);
            }
            else {
                cart.products.set("total", { count: 1, timestamp: Date.now() });
            }

            res.status(200).json(await cart.save());
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};

export const removeFromCart: RequestHandler<unknown, unknown, [string, number], unknown> = async (req, res, next) => {
    const toRemove = req.body;      // [itemToRemove, howManyItems]
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const cart = (await CartModel.find({ owner: decodedUser.id }).exec())[0];

            const itemToRemove = toRemove[0];
            const howManyItems = toRemove[1];
            const item = cart.products.get(itemToRemove);
            if (item) {
                if (item.count <= howManyItems) {
                    cart.products.delete(itemToRemove);
                }
                else {
                    item.count -= howManyItems;
                    cart.products.set(itemToRemove, item);
                }

                const total = cart.products.get("total");
                if (total) {
                    total.count = total.count - howManyItems;
                    cart.products.set("total", total);
                }
            }

            res.status(200).json(await cart.save());
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};

interface LoginBody {
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ email: email }).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid password");
        }

        jwt.sign({
            email: user.email,
            id: user._id
        }, env.JWT_SECRET, {}, (err: any, token: any) => {
            if (err) throw err;

            res.cookie('token', token).json(user);
        });
    } catch (error) {
        next(error);
    }
};

interface RegisterBody extends LoginBody {
    fullname?: string;
    username?: string,
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> = async (req, res, next) => {
    const fullname = req.body.fullname;
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!fullname || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        if (username) {
            const existingUsername = await UserModel.findOne({ username: username }).exec();
            if (existingUsername) {
                throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
            }
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            fullname: fullname,
            username: username,
            email: email,
            password: passwordHashed,
            credit: 100,
        });

        await ProfileNames.create({ owner: newUser._id, name: newUser.fullname });
        await ProfilePictures.create({ owner: newUser._id, picture: newUser.photo });

        jwt.sign({
            email: newUser.email,
            id: newUser._id,
        }, env.JWT_SECRET, {}, async (err: any, token: any) => {
            if (err) throw err;
            const user = {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                username: newUser.username,
            }

            res.cookie('token', token).json(user);
        });

    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    res.cookie('token', '').json(true);
};

export const uploadPhotoByLink: RequestHandler = async (req, res, next) => {

    const { link } = req.body;
    const newName = Date.now() + '.jpg';

    await imageDownloader.image({
        url: link,
        dest: __dirname + '/../../uploads/' + newName,
    });

    res.json(newName);
}

export const uploadPhoto: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const uploadedFiles = [];
            if (typeof req.files === 'object') {

                let values = Object.values(req.files)

                for (let i = 0; i < values.length; i++) {
                    const { path, originalname } = values[i];
                    const parts = originalname.split('.');
                    const ext = parts[parts.length - 1];
                    const newPath = path + '.' + ext;
                    fs.renameSync(path, newPath);
                    uploadedFiles.push(newPath.replace('uploads/', ''));
                }
            }

            const user = await UserModel.findById(decodedUser.id);

            if (!user) throw new Error;

            user.set('photo', uploadedFiles[0]);

            const userPictures = await ProfilePictures.findOne({ owner: decodedUser.id });
            if (userPictures) {
                userPictures.set("picture", uploadedFiles[0]);
                userPictures.save();
            }

            res.json(await user.save());
        })
    }
}

interface UserCredBody {
    fullname?: string;
    username?: string;
}

export const updateUserCredentials: RequestHandler<unknown, unknown, UserCredBody, unknown> = async (req, res, next) => {
    const { token } = req.cookies;

    let {
        fullname,
        username,
    } = req.body;

    const locations = ['olympus mons', 'jezero', 'gale', 'gusev', 'meridiani', 'olympus mons', 'capri chasma', 'coloe', 'shalbatana', 'valles marineris', 'cavi angusti', 'medusae fossae', 'nicholson', 'zunil', 'milankovic', 'terra sirenum', 'eberswalde'];
    function isAlphanumeric(str: string) {
        return str.match(/^[a-zA-Z0-9]+$/) !== null;
    }

    if (fullname === undefined || fullname.trim() === "") {
        delete req.body.fullname;
    }
    else if (!/[^a-zA-Z]/.test(fullname)) {
        throw createHttpError(400, "Name must contain only alphabets");
    }
    if (username === undefined) {
        delete req.body.username;
    }
    else if (!isAlphanumeric(username) && username.trim() === "") {
        throw createHttpError(400, "Username must be alphanumeric");
    }

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userDoc = await UserModel.findById(decodedUser.id);
            if (!userDoc) throw new Error;

            try {
                userDoc.set(req.body);
                res.status(200).json(await userDoc.save());
            } catch (error) {
                console.log(error);
                res.json(error);
            }
        })
    }
    else {
        res.json(null);
    }
}

interface UserDataBody {
    location?: string;
    bio?: string;
}

export const updateUserProfile: RequestHandler<unknown, unknown, UserDataBody, unknown> = async (req, res, next) => {
    const { token } = req.cookies;

    let {
        bio,
        location,
    } = req.body;

    const locations = ['olympus mons', 'jezero', 'gale', 'gusev', 'meridiani', 'olympus mons', 'capri chasma', 'coloe', 'shalbatana', 'valles marineris', 'cavi angusti', 'medusae fossae', 'nicholson', 'zunil', 'milankovic', 'terra sirenum', 'eberswalde'];

    if (bio === undefined || bio === "") {
        bio = "";
    }
    else if (location === undefined || !locations.includes(location)) {
        location = "anon";
    }

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userDoc = await UserModel.findById(decodedUser.id);
            if (!userDoc) throw new Error;

            userDoc.set({
                bio,
                location,
            });

            res.status(200).json(await userDoc.save());
        })
    }
    else {
        res.json(null);
    }
}

export const addCredit: RequestHandler<unknown, unknown, { credit: number }, unknown> = async (req, res, next) => {
    const { token } = req.cookies;

    if (!req.body.credit) throw new Error;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const userDoc = await UserModel.findById(decodedUser.id);
            if (!userDoc) throw new Error;

            userDoc.set({
                credit: userDoc.credit + req.body.credit,
            });

            res.status(200).json(await userDoc.save());
        })
    }
    else {
        res.json(null);
    }
}

interface CartItem {
    productId: string;
    quantity: number;
}

export const buyProducts: RequestHandler<unknown, unknown, [CartItem[], number], unknown> = async (req, res, next) => {
    const { token } = req.cookies;

    if (!req.body) throw new Error;

    const cartitems = req.body[0];
    const cost = req.body[1];

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            try {
                for (const item of cartitems) {
                    const purchasedItem = await PurchasedModel.findOne({ productId: item.productId }).exec();
                    if (purchasedItem) {
                        // product.quantity += item.quantity;  // should work but i'm not sure
                        purchasedItem.set({
                            quantity: purchasedItem.quantity + item.quantity,
                        })

                        purchasedItem.save();
                    }
                    else {
                        await PurchasedModel.create({
                            owner: decodedUser.id,
                            ...item,
                        });
                    }
                }

                const cart = await CartModel.findOne({owner: decodedUser.id});

                if (cart) {
                    cart.products = new Map<string, { count: number; timestamp: number; }>;
                    await cart.save();
                }

                const userDoc = await UserModel.findById(decodedUser.id);
                if (!userDoc) throw new Error;

                userDoc.set({
                    credit: cost > userDoc.credit ? 0 : userDoc.credit - cost,
                });

                res.json(await userDoc.save());
            } catch (error) {
                next(error);
            }

        })
    }
    else {
        res.json(null);
    }
}

export const getPurchase: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            const purchased = await PurchasedModel.find({ owner: decodedUser.id }).exec();

            res.status(200).json(purchased);
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};