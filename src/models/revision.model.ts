import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema({
    firstDate: {
        type: Date,
        required: true,
        default: Date.now() + 1
    },
    secondDate: {
        type: Date,
        required: true,
        default: Date.now() + 3
    },
    thirdDate: {
        type: Date,
        required: true,
        default: Date.now() + 7
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notes"
    }
}, { timestamps: true });

const Revision = mongoose.models.revisions || mongoose.model("revisions", revisionSchema);
export default Revision;