"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load analytics:", err));
  }, []);

  if (!data) return <p className="p-6 text-gray-600">Loading analytics...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Card */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Message Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.grouped || []}
                dataKey="_count.source"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {(data.grouped || []).map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Totals Card */}
        <div className="p-6 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center">
          <p className="text-lg font-semibold text-gray-600">Total Messages</p>
          <p className="text-5xl font-bold text-gray-900 mt-2">{data.total ?? 0}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Queries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Question</th>
                <th className="p-3 border-b">Answer</th>
                <th className="p-3 border-b">Source</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.logs || []).map((log: any) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{log.question}</td>
                  <td className="p-3 border-b">{log.answer}</td>
                  <td className="p-3 border-b capitalize">{log.source}</td>
                  <td className="p-3 border-b">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* fallback if no logs */}
              {(!data.logs || data.logs.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
