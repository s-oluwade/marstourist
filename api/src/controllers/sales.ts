import { RequestHandler } from "express";
import PurchasedModel from "../models/purchased";
import NotificationsModel from "../models/notifications";
import UserModel from "../models/user";
import env from "../util/validateEnv";
const jwt = require("jsonwebtoken");
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getCart: RequestHandler = async (req, res, next) => {

    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
            if (err) throw err;

            

            // USE PRISMA CLIENT TO RETRIEVE
            prisma.cart.findUnique({
                where: { id: decodedUser.id }
            })

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

            // const cart = (await CartModel.find({ owner: decodedUser.id }).exec())[0];
            // const cartItem = cart.products.get(itemToAdd);

            // if (cartItem) {
            //     cartItem.count += 1;
            //     cartItem.timestamp = Date.now();
            //     cart.products.set(itemToAdd, cartItem);
            // }
            // else {
            //     cart.products.set(itemToAdd, {
            //         count: 1,
            //         timestamp: Date.now(),
            //     })
            // }

            // const total = cart.products.get("total");
            // if (total) {
            //     total.count += 1;
            //     total.timestamp = Date.now();
            //     cart.products.set("total", total);
            // }
            // else {
            //     cart.products.set("total", { count: 1, timestamp: Date.now() });
            // }

            // res.status(200).json(await cart.save());

            // USE PRISMA CLIENT TO ADD TO CART
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

            // const cart = (await CartModel.find({ owner: decodedUser.id }).exec())[0];

            // const itemToRemove = toRemove[0];
            // const howManyItems = toRemove[1];
            // const item = cart.products.get(itemToRemove);
            // if (item) {
            //     if (item.count <= howManyItems) {
            //         cart.products.delete(itemToRemove);
            //     }
            //     else {
            //         item.count -= howManyItems;
            //         cart.products.set(itemToRemove, item);
            //     }

            //     const total = cart.products.get("total");
            //     if (total) {
            //         total.count = total.count - howManyItems;
            //         cart.products.set("total", total);
            //     }
            // }

            // res.status(200).json(await cart.save());

            // USE PRISMA CLIENT TO REMOVE FROM CART
            
        })
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};

interface CartItem {
    productId: string;
    title: string,
    imageUrl: string,
    brand: string,
    category: string,
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
                // // store items purchased
                // for (const item of cartitems) {
                //     const purchasedItem = await PurchasedModel.findOne({ owner: decodedUser.id, productId: item.productId }).exec();
                //     if (purchasedItem) {
                //         // product.quantity += item.quantity;  // should work but i'm not sure
                //         purchasedItem.set({
                //             quantity: purchasedItem.quantity + item.quantity,
                //         })
                //         await purchasedItem.save();
                //     }
                //     else {
                //         await PurchasedModel.create({
                //             owner: decodedUser.id,
                //             ...item,
                //         });
                //     }
                // }
                // const cart = await CartModel.findOne({owner: decodedUser.id});
                // if (cart) {
                //     cart.products = new Map<string, { count: number; timestamp: number; }>;
                //     await cart.save();
                // }

                // // update user's balance
                // let userDoc = await UserModel.findById(decodedUser.id);
                // if (!userDoc) throw new Error;
                // userDoc.set({
                //     credit: cost > userDoc.credit ? 0 : userDoc.credit - cost,
                // });
                // userDoc = await userDoc.save();

                // // update notifications
                // let userNotification = await NotificationsModel.findOne({owner: decodedUser.id}).exec();
                // if (userNotification) {
                //     userNotification.notifications.push("purchase");
                //     let result = await userNotification.save();
                //     userNotification = result;
                // }

                // res.json([userDoc, userNotification?.notifications]);

                // USE PRISMA CLIENT TO MAKE PURCHASE

            } catch (error) {
                res.json(null);
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
        // jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
        //     if (err) throw err;
        //     const purchased = await PurchasedModel.find({ owner: decodedUser.id }).exec();

        //     res.status(200).json(purchased);
        // })

        // USE PRISMA CLIENT TO FIND PURCHASE
    }
    else {
        console.log("User token not found");
        res.json(null);
    }
};
