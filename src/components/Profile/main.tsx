"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
    CheckCircle,
    UserCircle,
    GraduationCap,
    Building2,
    Sparkles,
} from "lucide-react";
import Loader from "@/components/ui/Loader";

interface ProfileData {
    user: any;
    completion: number;
    hasSubjects: boolean;
}

export default function ProfilePage() {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const [college, setCollege] = useState("");
    const [semester, setSemester] = useState("");

    const fetchProfile = async () => {
        const res = await fetch("/api/profile");
        const d = await res.json();

        setData(d);
        setCollege(d.user.college || "");
        setSemester(d.user.semester || "");
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const saveProfile = async () => {
        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ college, semester }),
        });

        if (!res.ok) {
            toast.error("Failed to update profile");
            return;
        }

        toast.success("Profile updated successfully");
        fetchProfile();
    };

    // if (loading || !data) return null;

    if (loading || !data) {
        return <Loader />;
    }

    const { user, completion, hasSubjects } = data;

    return (
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 overflow-hidden">

            {/* background glow */}
            {/* <div className="absolute -top-32 -left-32 w-[260px] sm:w-[350px] h-[260px] sm:h-[350px] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 -right-32 w-[260px] sm:w-[350px] h-[260px] sm:h-[350px] bg-purple-500/20 rounded-full blur-[120px]" /> */}

            {/* HEADER */}
            <div className="relative space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted text-xs sm:text-sm">
                    <Sparkles size={14} />
                    Profile Setup
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                    Complete your profile
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                    Help us personalize your attendance analytics experience.
                </p>
            </div>

            {/* MAIN CARD */}
            <div className="relative rounded-3xl border bg-background/70 backdrop-blur-xl p-5 sm:p-8 space-y-8 shadow-xl">

                {/* USER HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                    {/* avatar */}
                    <div className="relative mx-auto sm:mx-0">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt="profile"
                                width={80}
                                height={80}
                                className="rounded-full ring-4 ring-primary/20"
                            />
                        ) : (
                            <UserCircle size={80} />
                        )}

                        {/* completion ring */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-primary"
                            style={{
                                clipPath: `inset(${100 - completion}% 0 0 0)`,
                            }}
                        />
                    </div>

                    {/* info */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            {user.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>

                    {/* percentage */}
                    <div className="sm:ml-auto text-center">
                        <p className="text-3xl sm:text-4xl font-bold text-primary">
                            {completion}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Profile strength
                        </p>
                    </div>
                </div>

                {/* COMPLETION BAR */}
                <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>Completion progress</span>
                        <span className="font-semibold">{completion}%</span>
                    </div>

                    <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                </div>

                {/* FIELDS */}
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">

                    <Field label="Full Name" value={user.name} />
                    <Field label="Email Address" value={user.email} />

                    <Input
                        label="College"
                        icon={<Building2 size={18} />}
                        value={college}
                        onChange={setCollege}
                        placeholder="Enter your college name"
                    />

                    <Input
                        label="Semester"
                        icon={<GraduationCap size={18} />}
                        value={semester}
                        onChange={setSemester}
                        placeholder="e.g. Semester 6"
                    />
                </div>

                {/* CHECKLIST */}
                <div className="space-y-3 text-sm">
                    <ChecklistItem done={!!user.name} label="Google account connected" />
                    <ChecklistItem done={!!user.image} label="Profile photo available" />
                    <ChecklistItem done={!!college} label="College added" />
                    <ChecklistItem done={!!semester} label="Semester selected" />
                    <ChecklistItem
                        done={hasSubjects}
                        label="At least one subject added (+5%)"
                    />
                </div>

                {/* SAVE */}
                <button
                    onClick={saveProfile}
                    className="
            w-full py-3 sm:py-4 rounded-2xl
            bg-primary text-white text-base sm:text-lg
            font-semibold hover:scale-[1.02] transition
          "
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */

function Field({ label, value }: any) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <input
                disabled
                value={value || ""}
                className="mt-1 w-full rounded-xl border px-4 py-3 bg-muted cursor-not-allowed text-sm"
            />
        </div>
    );
}

function Input({ label, value, onChange, placeholder, icon }: any) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>

            <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {icon}
                </span>

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border pl-10 pr-4 py-3 text-sm"
                />
            </div>
        </div>
    );
}

function ChecklistItem({ done, label }: any) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <CheckCircle
                size={18}
                className={done ? "text-green-600" : "text-muted-foreground"}
            />
            <span className={done ? "" : "text-muted-foreground"}>
                {label}
            </span>
        </div>
    );
}
