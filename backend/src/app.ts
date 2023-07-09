import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import dataRoutes from "./routes/data";
import productRoutes from "./routes/products";
import postRoutes from "./routes/posts";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
const cookieParser = require('cookie-parser');
const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const cors = require('cors');
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/products", productRoutes);
app.use("/api/posts", postRoutes);
// app.use("/api/purchases", requiresUserAuth, purchaseRoutes); // TODO
app.use("/uploads", express.static(__dirname + "/../uploads"));
app.use("/images", express.static(__dirname + "/img"));

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;