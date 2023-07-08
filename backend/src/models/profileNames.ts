import { InferSchemaType, model, Schema } from "mongoose";

const profileNamesSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
});

type ProfileNames = InferSchemaType<typeof profileNamesSchema>;

export default model<ProfileNames>("ProfileNames", profileNamesSchema);