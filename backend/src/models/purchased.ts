import { InferSchemaType, model, Schema } from "mongoose";

const purchasedSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true });

type Purchased = InferSchemaType<typeof purchasedSchema>;

export default model<Purchased>("Purchased", purchasedSchema);