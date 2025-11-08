import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EventTypeChart = ({ data, loading }) => {
  if (loading) return <div className="loading">Loading chart...</div>;

  // Group by source/type
  const sources = {};
  data.forEach((log) => {
    const source = log.source || "unknown";
    if (!sources[source]) {
      sources[source] = { source, ERROR: 0, WARNING: 0, INFO: 0, DEBUG: 0, total: 0 };
    }
    sources[source][log.level]++;
    sources[source].total++;
  });
  const chartData = Object.values(sources).sort((a, b) => b.total - a.total);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ERROR" fill="#ef4444" />
        <Bar dataKey="WARNING" fill="#f59e0b" />
        <Bar dataKey="INFO" fill="#3b82f6" />
        <Bar dataKey="DEBUG" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default EventTypeChart;
