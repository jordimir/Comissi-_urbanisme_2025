
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TechnicianStat } from '../types';

interface TechnicianDonutChartProps {
    data: TechnicianStat[];
    onTechnicianSelect: (technicianName: string | null) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-sm">{`Expedients: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TechnicianDonutChart: React.FC<TechnicianDonutChartProps> = ({ data, onTechnicianSelect }) => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        onClick={(pieData) => onTechnicianSelect(pieData.name)}
                        className="cursor-pointer"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right" 
                        onClick={(data) => onTechnicianSelect(data.value)}
                        wrapperStyle={{ cursor: 'pointer' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TechnicianDonutChart;