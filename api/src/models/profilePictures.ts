import { InferSchemaType, model, Schema } from "mongoose";

const profilePicturesSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    picture: { type: String },
});

type ProfilePictures = InferSchemaType<typeof profilePicturesSchema>;

export default model<ProfilePictures>("ProfilePictures", profilePicturesSchema);