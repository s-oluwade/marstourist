import {RequestHandler} from 'express';
import PurchasedModel from '../models/purchased';
import NotificationsModel from '../models/notifications';
import UserModel from '../models/user';
import env from '../util/validateEnv';
import {Cart, CartItem, Prisma, PrismaClient} from '@prisma/client';
const jwt = require('jsonwebtoken');

export type CartWithProducts = Prisma.CartGetPayload<{
    include: {items: {include: {product: true}}};
  }>;
  
  export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: {product: true};
  }>;
  
  export type ShoppingCart = CartWithProducts & {
    size: number;
    subtotal: number;
  };

export const getCart: RequestHandler = async (req, res, next) => {
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      const prisma = new PrismaClient();

      let cart: CartWithProducts | null = await prisma.cart.findFirst({
        where: {userId: decodedUser.id},
        include: {items: {include: {product: true}}},
      });

      if (!cart) {
        res.json(null);
      } else {
        res.json({
          ...cart,
          size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
          subtotal: cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0),
        });
      }
    });
  } else {
    console.log('User token not found');
    res.json(null);
  }
};

export const addToCart: RequestHandler<unknown, unknown, {item: string}, unknown> = async (req, res, next) => {
  const itemToAdd = req.body.item;
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
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
      const prisma = new PrismaClient();
      const cart = prisma.cart.findUnique({
        where: {id: decodedUser.id},
      });

      res.json(cart);
    });
  } else {
    console.log('User token not found');
    res.json(null);
  }
};

// Note: at the time of implementation, there was a bug in Next.js
// that causes page navigation to freeze while the server action is executing.
// export async function incrementProductQuantity(productId: string) {
//     const prisma = new PrismaClient();
//     let cart: CartWithProducts | null = await prisma.cart.findFirst({
//         where: {userId: decodedUser.id},
//         include: {items: {include: {product: true}}},
//       });
//     const cart = (await getCart()) ?? (await createCart());
  
//     const articleInCart = cart.items.find((item) => item.productId === productId);
  
//     if (articleInCart) {
//       await prisma.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: {
//             update: {
//               where: { id: articleInCart.id },
//               data: { quantity: { increment: 1 } },
//             },
//           },
//         },
//       });
//     } else {
//       await prisma.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: {
//             create: {
//               productId,
//               quantity: 1,
//             },
//           },
//         },
//       });
//     }
  
//   }

export const removeFromCart: RequestHandler<unknown, unknown, [string, number], unknown> = async (req, res, next) => {
  const toRemove = req.body; // [itemToRemove, numberToRemove]
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      const prisma = new PrismaClient();

    //   if numberToRemove >= number in cart, delete cart, else update amount

      const updatedCart = await prisma.cart.update({
        where: { id: decodedUser.id },
        data: {
          items: {
            delete: { id: decodedUser.id },
          },
        },
      });

      res.status(200).json(updatedCart);
    });
  } else {
    console.log('User token not found');
    res.json(null);
  }
};

interface Item {
  productId: string;
  title: string;
  imageUrl: string;
  brand: string;
  category: string;
  quantity: number;
}

export const buyProducts: RequestHandler<unknown, unknown, [Item[], number], unknown> = async (req, res, next) => {
  const {token} = req.cookies;

  if (!req.body) throw new Error();

  const cartitems = req.body[0];
  const cost = req.body[1];

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

    //   try {
        // store items purchased
    //     for (const item of cartitems) {
    //         const purchasedItem = await PurchasedModel.findOne({ owner: decodedUser.id, productId: item.productId }).exec();
    //         if (purchasedItem) {
    //             // product.quantity += item.quantity;  // should work but i'm not sure
    //             purchasedItem.set({
    //                 quantity: purchasedItem.quantity + item.quantity,
    //             })
    //             await purchasedItem.save();
    //         }
    //         else {
    //             await PurchasedModel.create({
    //                 owner: decodedUser.id,
    //                 ...item,
    //             });
    //         }
    //     }
    //     const cart = await CartModel.findOne({owner: decodedUser.id});
    //     if (cart) {
    //         cart.products = new Map<string, { count: number; timestamp: number; }>;
    //         await cart.save();
    //     }
    //     // update user's balance
    //     let userDoc = await UserModel.findById(decodedUser.id);
    //     if (!userDoc) throw new Error;
    //     userDoc.set({
    //         credit: cost > userDoc.credit ? 0 : userDoc.credit - cost,
    //     });
    //     userDoc = await userDoc.save();
    //     // update notifications
    //     let userNotification = await NotificationsModel.findOne({owner: decodedUser.id}).exec();
    //     if (userNotification) {
    //         userNotification.notifications.push("purchase");
    //         let result = await userNotification.save();
    //         userNotification = result;
    //     }
    //     res.json([userDoc, userNotification?.notifications]);
    //   } catch (error) {
    //     res.json(null);
    //   }
    });
  } else {
    res.json(null);
  }
};

export const getPurchase: RequestHandler = async (req, res, next) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: { id: any; }) => {
        if (err) throw err;
        const purchased = await PurchasedModel.find({ owner: decodedUser.id }).exec();
        res.status(200).json(purchased);
    })
  } else {
    console.log('User token not found');
    res.json(null);
  }
};




// export async function createCart(): Promise<ShoppingCart> {
//   const session = await getServerSession(authOptions);

//   let newCart: Cart;

//   if (session) {
//     newCart = await prisma.cart.create({
//       data: {userId: session.user.id},
//     });
//   } else {
//     newCart = await prisma.cart.create({
//       data: {},
//     });

//     // Note: Needs encryption + secure settings in real production app
//     cookies().set('localCartId', newCart.id);
//   }

//   return {
//     ...newCart,
//     items: [],
//     size: 0,
//     subtotal: 0,
//   };
// }
