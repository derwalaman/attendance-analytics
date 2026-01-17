"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, PlusCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

/* ================= TYPES ================= */

interface Subject {
    _id: string;
    subjectName: string;
    subjectCode?: string;
    minAttendance: number;
}

type ModalMode = "add" | "edit" | null;

/* ================= PAGE ================= */

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

    const [form, setForm] = useState({
        subjectName: "",
        subjectCode: "",
        minAttendance: 75,
    });

    /* ---------------- FETCH ---------------- */

    const fetchSubjects = async () => {
        setLoading(true);
        const res = await fetch("/api/subjects");
        const data = await res.json();
        setSubjects(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    /* ---------------- FORM RESET ---------------- */

    const resetForm = () => {
        setForm({
            subjectName: "",
            subjectCode: "",
            minAttendance: 75,
        });
        setEditingSubject(null);
        setModalMode(null);
    };

    /* ---------------- MODAL HANDLERS ---------------- */

    const openAddModal = () => {
        resetForm();
        setModalMode("add");
        setModalOpen(true);
    };

    const openEditModal = (subject: Subject) => {
        setForm({
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode ?? "",
            minAttendance: subject.minAttendance,
        });
        setEditingSubject(subject);
        setModalMode("edit");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async () => {
        if (!form.subjectName.trim()) {
            toast.error("Subject name is required");
            return;
        }

        if (!form.subjectCode.trim()) {
            toast.error("Subject code is required");
            return;
        }

        const url =
            modalMode === "edit"
                ? `/api/subjects/${editingSubject?._id}`
                : "/api/subjects";

        const method = modalMode === "edit" ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            toast.error("Failed to save subject");
            return;
        }

        toast.success(
            modalMode === "edit" ? "Subject updated" : "Subject added"
        );

        closeModal();
        fetchSubjects();
    };

    /* ---------------- DELETE ---------------- */

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        const res = await fetch(`/api/subjects/${deleteTarget._id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            toast.error("Failed to delete subject");
            return;
        }

        toast.success("Subject deleted");
        setDeleteTarget(null);
        fetchSubjects();
    };

    if (loading) {
        return <Loader />;
    }

    if (!subjects.length) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6">

                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <BookOpen size={42} className="text-muted-foreground" />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            No Subjects Added
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            You haven’t added any subjects yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Subjects
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your subjects and attendance targets.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:scale-105 transition shadow-lg"
                >
                    <Plus size={18} /> Add Subject
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((s) => (
                    <div
                        key={s._id}
                        className="rounded-2xl border p-5 bg-background hover:shadow-xl transition flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="font-semibold text-lg">
                                {s.subjectName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium">
                                    Code:
                                </span>{" "}
                                {s.subjectCode || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium">
                                    Min Attendance:
                                </span>{" "}
                                {s.minAttendance}%
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => openEditModal(s)}
                                className="p-2 rounded-lg hover:bg-muted"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteTarget(s)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 px-4">
                    <div className="bg-background rounded-3xl p-8 w-full max-w-md space-y-5 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {modalMode === "edit"
                                        ? "Edit Subject"
                                        : "Add Subject"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {modalMode === "edit"
                                        ? "Update subject details"
                                        : "Add a new subject to track attendance"}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 rounded-lg hover:bg-muted">
                                <X />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Subject Name
                                </label>
                                <input
                                    placeholder="Enter subject name"
                                    value={form.subjectName}
                                    onChange={(e) =>
                                        setForm({ ...form, subjectName: e.target.value })
                                    }
                                    className="w-full rounded-xl border p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Subject Code
                                </label>
                                <input
                                    placeholder="Enter subject code"
                                    value={form.subjectCode}
                                    onChange={(e) =>
                                        setForm({ ...form, subjectCode: e.target.value })
                                    }
                                    className="w-full rounded-xl border p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Min Attendance
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={form.minAttendance}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            minAttendance: Number(e.target.value),
                                        })
                                    }
                                    className="w-full rounded-xl border p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Set minimum attendance percentage required.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-3 rounded-xl bg-primary text-white hover:scale-102 transition"
                            >
                                {modalMode === "edit"
                                    ? "Update Subject"
                                    : "Add Subject"}
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 py-3 rounded-xl border hover:bg-muted transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 px-4">
                    <div className="bg-background rounded-3xl p-8 w-full max-w-sm space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-red-600">
                            Delete Subject?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <b>{deleteTarget.subjectName}</b>? This cannot be undone.
                        </p>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-3 rounded-xl border"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
