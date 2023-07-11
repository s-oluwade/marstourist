import { InferSchemaType, model, Schema } from "mongoose";

const notificationsSchema = new Schema({
    notifications: {
        type: Map,
        of: [String]
    },
});

type Notifications = InferSchemaType<typeof notificationsSchema>;

export default model<Notifications>("Notifications", notificationsSchema);