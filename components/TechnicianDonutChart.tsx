import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TechnicianStat } from '../types';

interface TechnicianDonutChartProps {
    data: TechnicianStat[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-sm">{`Expedients: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TechnicianDonutChart: React.FC<TechnicianDonutChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        // Fix: Cast `data` to `any` to resolve a type error with the `recharts` library.
                        // The `Pie` component expects a data type with a string index signature to access properties
                        // via `dataKey`, which `TechnicianStat` lacks, causing a type mismatch.
                        data={data as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TechnicianDonutChart;