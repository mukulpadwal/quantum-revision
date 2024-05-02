import mongoose from "mongoose";


const querySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        userQuery: {
            type: String,
        },
    },
    { timestamps: true }
);

const Query =
    mongoose.models?.queries || mongoose.model("queries", querySchema);
export default Query;
