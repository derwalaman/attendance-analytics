import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    date: { type: Date, required: true },

    status: { 
        type: String, 
        enum: ["present", "absent", "bunk", "cancelled", "no_class"],
        required: true 
    }
}, { timestamps: true });

AttendanceSchema.index(
    { userId: 1, subjectId: 1, date: 1 },
    { unique: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);