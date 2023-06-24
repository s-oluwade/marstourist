import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users";
import dataRoutes from "./routes/data";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import GunsModel from "./models/guns";
const cookieParser = require('cookie-parser');
const Crawler = require('crawler');

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const cors = require('cors');
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.get('/load-weapons', (req, response) => {

    response.json(null);

    return

    const weapons: { image: any; name: any; weaponType: any; manufacturer: any; elements: any; }[] = [];

    const c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: async (error: any, res: { $: any; }, done: () => void) => {
            if (error) {
                console.log(error);
            } else {
                const $ = res.$;
                // $ is Cheerio by default
                // a lean implementation of core jQuery designed specifically for the server

                for (const item of $('#item-list')[0].children) {
                    const image = item.children[2].attribs.src;
                    const name = item.children[3].children[0].data;
                    const weaponType = item.children[4].children[0].data;
                    const manufacturer = item.children[5].children[0].data;
                    let elements = [];

                    for (const child of item.children[6].children) {
                        if (!child.attribs.class.split(' ').includes('w-condition-invisible')) {
                            elements.push(child.attribs.src);
                        }
                    }

                    weapons.push({
                        image,
                        name,
                        weaponType,
                        manufacturer,
                        elements,
                    });
                }
            }
            done();
            console.log(await GunsModel.create(weapons));
        }
    });

    c.queue('https://www.lootlemon.com/db/borderlands-3/weapons');
})

app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);
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