import { InferSchemaType, model, Schema } from "mongoose";

const postSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String },
    content: { type: String },
    likes: { type: [Schema.Types.ObjectId], default: [] },
}, { timestamps: true });

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>("Post", postSchema);