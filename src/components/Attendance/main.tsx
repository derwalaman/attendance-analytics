"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Filter,
    Calendar,
    CheckCircle,
    XCircle,
    Slash,
    Clock,
    PlusCircle,
    BookOpen,
} from "lucide-react";

type Status = "present" | "absent" | "bunk" | "cancelled" | "no_class";

interface Attendance {
    _id: string;
    subjectId: string;
    subjectName: string;
    date: string;
    status: Status;
}

interface Subject {
    _id: string;
    subjectName: string;
}

const statusMap: Record<Status, { label: string; color: string; icon: any }> = {
    present: {
        label: "Present",
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle size={16} />,
    },
    absent: {
        label: "Absent",
        color: "bg-red-100 text-red-700",
        icon: <XCircle size={16} />,
    },
    bunk: {
        label: "Bunk",
        color: "bg-yellow-100 text-yellow-700",
        icon: <Clock size={16} />,
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-blue-100 text-blue-700",
        icon: <Slash size={16} />,
    },
    no_class: {
        label: "No Class",
        color: "bg-muted text-muted-foreground",
        icon: <Filter size={16} />,
    },
};

export default function AttendancePage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectId, setSubjectId] = useState("");

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterSubject, setFilterSubject] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterDate, setFilterDate] = useState<string>("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editTarget, setEditTarget] = useState<Attendance | null>(null);

    const [form, setForm] = useState({
        subjectId: "",
        date: "",
        status: "present" as Status,
    });

    const [deleteTarget, setDeleteTarget] = useState<Attendance | null>(null);

    useEffect(() => {
        fetch("/api/subjects")
            .then((r) => r.json())
            .then((data) => {
                setSubjects(data);
                if (data.length) setSubjectId(data[0]._id);
            });
    }, []);

    /* ---------------- FETCH DATA ---------------- */
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/attendance");
            const data = await res.json();

            // If API returns error, show toast and return empty list
            if (!res.ok) {
                toast.error(data.error || "Failed to load attendance");
                setAttendance([]);
                setSubjects([]);
                setLoading(false);
                return;
            }

            setAttendance(data.attendance ?? []);
            setSubjects(data.subjects ?? []);
        } catch (e) {
            toast.error("Something went wrong");
            setAttendance([]);
            setSubjects([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ---------------- FILTERED LIST ---------------- */
    const filtered = useMemo(() => {
        return (attendance ?? []).filter((a) => {
            if (filterSubject !== "all" && a.subjectId !== filterSubject) return false;
            if (filterStatus !== "all" && a.status !== filterStatus) return false;
            if (filterDate && a.date !== filterDate) return false;
            return true;
        });
    }, [attendance, filterSubject, filterStatus, filterDate]);

    /* ---------------- MODAL ---------------- */
    const openAdd = () => {
        setForm({
            subjectId: subjects[0]?._id ?? "",
            date: "",
            status: "present",
        });
        setModalMode("add");
        setModalOpen(true);
    };

    const openEdit = (item: Attendance) => {
        setForm({
            subjectId: item.subjectId,
            date: item.date,
            status: item.status,
        });
        setEditTarget(item);
        setModalMode("edit");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditTarget(null);
    };

    /* ---------------- SAVE ---------------- */
    const handleSave = async () => {
        if (!form.subjectId || !form.date) {
            toast.error("Subject & Date are required");
            return;
        }

        const url =
            modalMode === "edit"
                ? `/api/attendance/${editTarget?._id}`
                : "/api/attendance";

        const method = modalMode === "edit" ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error(err.error || "Failed");
            return;
        }

        toast.success("Saved successfully");
        closeModal();
        fetchData();
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async () => {
        if (!deleteTarget) return;

        const res = await fetch(`/api/attendance/${deleteTarget._id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }

        toast.success("Deleted successfully");
        setDeleteTarget(null);
        fetchData();
    };

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
                            <br />
                            Attendance Tracer works only after at least one subject is created.
                        </p>
                    </div>

                    {/* CTA */}
                    <a
                        href="/portal/subjects"
                        className="
                        inline-flex items-center justify-center
                        gap-2 px-8 py-3 rounded-2xl
                        bg-primary text-white font-semibold
                        shadow-lg hover:scale-105 transition
                    "
                    >
                        <PlusCircle size={18} />
                        Add Your First Subject
                    </a>

                    {/* Hint */}
                    <p className="text-xs text-muted-foreground">
                        Once added, attendance tracer will appear automatically.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Attendance</h1>
                    <p className="text-muted-foreground mt-1">
                        Add & manage attendance records
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:scale-105 transition"
                >
                    <Plus size={18} /> Add Attendance
                </button>
            </div>

            {/* FILTER BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="rounded-xl border p-3"
                >
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.subjectName}
                        </option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border p-3"
                >
                    <option value="all">All Status</option>
                    {Object.entries(statusMap).map(([k, v]) => (
                        <option key={k} value={k}>
                            {v.label}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="rounded-xl border p-3"
                />

                <button
                    onClick={() => {
                        setFilterSubject("all");
                        setFilterStatus("all");
                        setFilterDate("");
                    }}
                    className="rounded-xl border p-3 flex items-center justify-center gap-2"
                >
                    <X size={16} /> Reset
                </button>
            </div>

            {/* TABLE */}
            <div className="rounded-3xl border overflow-hidden">
                <div className="grid grid-cols-6 gap-4 bg-muted p-4 text-sm font-semibold">
                    <div className="col-span-2">Subject</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {loading ? (
                    <div className="p-6">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-6 text-muted-foreground">
                        No attendance records found.
                    </div>
                ) : (
                    filtered.map((a) => (
                        <div
                            key={a._id}
                            className="grid grid-cols-6 gap-4 p-4 hover:bg-background transition"
                        >
                            <div className="col-span-2">
                                <div className="font-semibold">{a.subjectName}</div>
                            </div>

                            <div>{a.date}</div>

                            <div>
                                <span
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusMap[a.status].color}`}
                                >
                                    {statusMap[a.status].icon}
                                    {statusMap[a.status].label}
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={() => openEdit(a)}
                                    className="p-2 rounded-lg hover:bg-muted"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(a)}
                                    className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ADD/EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 px-4">
                    <div className="bg-background rounded-3xl p-8 w-full max-w-md space-y-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {modalMode === "edit" ? "Edit Attendance" : "Add Attendance"}
                            </h2>
                            <button onClick={closeModal}>
                                <X />
                            </button>
                        </div>

                        <select
                            value={form.subjectId}
                            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                            className="w-full rounded-xl border p-3"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.subjectName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full rounded-xl border p-3"
                        />

                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value as Status })
                            }
                            className="w-full rounded-xl border p-3"
                        >
                            {Object.entries(statusMap).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-xl bg-primary text-white"
                            >
                                {modalMode === "edit" ? "Update" : "Add"}
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 py-3 rounded-xl border"
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
                    <div className="bg-background rounded-3xl p-8 w-full max-w-sm space-y-4">
                        <h3 className="text-xl font-bold text-red-600">Delete Record?</h3>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete attendance for{" "}
                            <b>{deleteTarget.subjectName}</b> on{" "}
                            <b>{deleteTarget.date}</b>?
                        </p>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleDelete}
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
