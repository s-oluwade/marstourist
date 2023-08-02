import { InferSchemaType, model, Schema } from "mongoose";

const visitorSchema = new Schema({
    ip: { type: String, unique: true },
    city: String,
    country_name: String,
}, { timestamps: true });

type Visitor = InferSchemaType<typeof visitorSchema>;

export default model<Visitor>("Visitor", visitorSchema);