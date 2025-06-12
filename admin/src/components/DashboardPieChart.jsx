import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pending Orders', value: 30 },
  { name: 'Delivered Orders', value: 50 },
  { name: 'Cancelled Orders', value: 20 },
];

const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

const DashboardPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"  // center x
          cy="50%"  // center y
          innerRadius={60}  // for donut style
          outerRadius={100} // for size
          fill="#8884d8"
          paddingAngle={5} // makes space between sections
          dataKey="value"
          stroke="none" // removes sharp border
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={50} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DashboardPieChart;
