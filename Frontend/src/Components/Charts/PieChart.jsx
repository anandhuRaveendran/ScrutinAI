import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#93C5FD"];

export default function AuditPie({ data }) {
    return (
        <div className="bg-[#0f1724]/60 rounded-xl p-4 shadow-sm">
            <h4 className="text-white font-semibold mb-2">Audit Breakdown</h4>
            <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={48}
                            outerRadius={80}
                            paddingAngle={4}
                            label={({ percent }) => `${Math.round(percent * 100)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            wrapperStyle={{ background: "#0b1220", border: "none" }}
                            contentStyle={{ color: "#fff", background: "#0b1220" }}
                        />
                        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
