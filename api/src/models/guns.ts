import { InferSchemaType, model, Schema } from "mongoose";

const gunsSchema = new Schema({
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    weaponType: { type: String, required: true },
    manufacturer: { type: String, required: true },
    elements: { type: [String], required: true },
});

type Guns = InferSchemaType<typeof gunsSchema>;

export default model<Guns>("Guns", gunsSchema);