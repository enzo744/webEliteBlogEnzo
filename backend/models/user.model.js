import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
        // select: false  // 👈 protezione dalla selezione
    },
    bio: {
        type: String,
        default: ""
    },
    occupation: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: ""
    },
    // ✅ AGGIUNGI QUESTO CAMPO
    photoPublicId: {
        type: String,
        default: "", // O null, a seconda della tua preferenza
    },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    facebook: { type: String, default: "" },


}, { timestamps: true })

export const User = mongoose.model("User", userSchema)

// export default User