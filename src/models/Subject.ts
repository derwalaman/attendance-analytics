import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectName: { type: String, required: true },
    subjectCode: String,
    minAttendance: { type: Number, default: 75 }
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);