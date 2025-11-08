import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const StatusOverTime = ({ data, loading }) => {
  if (loading) return <div className="loading">Loading chart...</div>;

  // Aggregate by hour
  const grouped = {};
  data.forEach(log => {
    try {
      const date = parseISO(log.timestamp);
      const hourKey = format(date, 'yyyy-MM-dd HH:00');
      if (!grouped[hourKey]) grouped[hourKey] = { time: hourKey, ERROR: 0, WARNING: 0, INFO: 0, DEBUG: 0 };
      grouped[hourKey][log.level]++;
    } catch {}
  });
  const chartData = Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ERROR" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="WARNING" stroke="#f59e0b" strokeWidth={2} />
        <Line type="monotone" dataKey="INFO" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="DEBUG" stroke="#6366f1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default StatusOverTime;
