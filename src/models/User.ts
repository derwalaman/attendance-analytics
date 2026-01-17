import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    semester: String,
    college: String,
    provider: { type: String, default: "google" },

    attendanceMode: {
        type: String,
        enum: ["bunk_present", "bunk_absent", "bunk_ignore"],
        default: "bunk_present",
    },
    
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);