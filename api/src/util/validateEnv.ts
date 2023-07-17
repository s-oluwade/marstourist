import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    JWT_SECRET: str(),
    S3_ACCESS_KEY: str(),
    S3_SECRET_ACCESS_KEY: str(),
});