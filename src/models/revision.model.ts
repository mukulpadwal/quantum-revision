import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema({
    firstDate: {

    },
    secondDate: {

    },
    thirdDate: {

    },
    note: {

    }
}, { timestamps: true });

const Revision = mongoose.models.revisions || mongoose.model("revisions", revisionSchema);
export default Revision;