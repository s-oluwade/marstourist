import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);