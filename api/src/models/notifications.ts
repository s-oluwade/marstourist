import { InferSchemaType, model, Schema } from "mongoose";

const notificationsSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notifications: { type: [String], default: [], required: true },
});

type Notifications = InferSchemaType<typeof notificationsSchema>;

export default model<Notifications>("Notifications", notificationsSchema);