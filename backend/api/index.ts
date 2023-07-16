import app from "../src/app";
import UserModel from "../src/models/user";
import env from "../src/util/validateEnv";
const jwt = require("jsonwebtoken");

app.get('/api/user', (req, res) => {
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
})

export default app;