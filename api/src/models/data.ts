import { InferSchemaType, model, Schema } from "mongoose";

// completed in account page, displayed in profile page
const dataSchema = new Schema({
    site: String,
    regions: [String],
    // Olympus Mons, Jezero, Gale, Gusev, Meridiani, 
    // Capri Chasma, Coloe, Shalbatana, Valles Marineris, Cavi Angusti,
    // Medusae Fossae, Nicholson, Zunil, Milankovic, Terra Sirenum, Eberswalde
    races: [String],
    // Asari, Drell, Elcor, Hanar, Human, Keeper, Salarian, Turian, Volus
    // Batarian, Collector, Geth, Krogan, Leviathan, Quarian,
    // Reaper, Vorcha, Prothean, Rachni
    planetary_bodies: {
        type: Map,
        of: {
            type: Map,
            of: String,
        },
    },
});

type Data = InferSchemaType<typeof dataSchema>;

export default model<Data>("Data", dataSchema);