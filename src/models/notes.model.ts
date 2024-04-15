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
    }
}, { timestamps: true });

const Note = mongoose.models.notes || mongoose.model("notes", noteSchema);
export default Note;