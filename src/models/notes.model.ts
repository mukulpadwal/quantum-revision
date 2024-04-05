import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {

    },
    revision: {

    },
    owner: {

    }
}, { timestamps: true });

const Note = mongoose.models.notes || mongoose.model("notes", noteSchema);
export default Note;