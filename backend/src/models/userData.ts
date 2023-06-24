import { InferSchemaType, model, Schema } from "mongoose";

// completed in account page, displayed in profile page
const userSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photo: String,
    bio: String,    // 
    race: String,   // race
    base: String,   // region
    origin: String, // home (planet or satellite)
});

type UserData = InferSchemaType<typeof userSchema>;

export default model<UserData>("UserData", userSchema);