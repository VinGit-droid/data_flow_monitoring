import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  DEBUG: '#6366f1',
  CRITICAL: '#dc2626'
};
const UserActivityPie = ({ data, loading }) => {
  if (loading) return <div className="loading">Loading chart...</div>;
  const counts = {};
  data.forEach(log => {
    counts[log.level] = (counts[log.level] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`} outerRadius={100} fill="#8884d8" dataKey="value">
          {chartData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={COLORS[entry.name] || '#64748b'} />))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default UserActivityPie;
