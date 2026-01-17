"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

const COLORS: Record<string, string> = {
    present: "bg-green-600",
    bunk: "bg-yellow-400",
    absent: "bg-red-600",
    cancelled: "bg-slate-400",
    no_class: "bg-slate-700",
};

export default function AttendanceHeatmap({ subjectId }: { subjectId: string }) {
    const [data, setData] = useState<Record<string, string>>({});
    const year = dayjs().year();

    async function load() {
        const res = await fetch(
            `/api/attendance/heatmap?subjectId=${subjectId}&year=${year}`
        );
        const records = await res.json();

        const map: any = {};
        records.forEach((r: any) => {
            map[new Date(r.date).toISOString().slice(0, 10)] = r.status;
        });

        setData(map);
    }

    useEffect(() => {
        if (subjectId) load();
    }, [subjectId]);

    const start = dayjs(`${year}-01-01`);
    const days = Array.from({ length: 365 }, (_, i) =>
        start.add(i, "day")
    );

    return (
        <div className="bg-slate-900 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">
                Attendance Heatmap ({year})
            </h3>

            <div className="grid grid-cols-53 gap-1">
                {days.map(d => {
                    const key = d.format("YYYY-MM-DD");
                    const status = data[key];
                    return (
                        <div
                            key={key}
                            title={`${key} : ${status || "no data"}`}
                            className={`w-3 h-3 rounded ${COLORS[status] || "bg-slate-800"
                                }`}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-3 text-xs text-slate-400 mt-4">
                {Object.entries(COLORS).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded ${v}`} />
                        {k.replace("_", " ")}
                    </div>
                ))}
            </div>
        </div>
    );
}
