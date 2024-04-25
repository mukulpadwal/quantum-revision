import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    entryDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
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
    notification: {
        type: Boolean,
        default: false
    },
    novuTransactionId: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Note = mongoose.models?.notes || mongoose.model("notes", noteSchema);
export default Note;