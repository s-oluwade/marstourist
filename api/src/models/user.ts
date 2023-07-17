import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    credit: { type: Number, default: 0 },
    photo: { type: String },
    bio: { type: String },
    location: { type: String },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);