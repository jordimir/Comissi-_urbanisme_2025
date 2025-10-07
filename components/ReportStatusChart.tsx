import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ReportStatusStat } from '../types';

interface ReportStatusChartProps {
    data: ReportStatusStat[];
    theme: 'light' | 'dark';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-sm">{`Expedients: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const ReportStatusChart: React.FC<ReportStatusChartProps> = ({ data, theme }) => {
    const tickColor = theme === 'dark' ? '#a0aec0' : '#4a5568';

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart 
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e0e0e0'} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120}
                        tick={{ fontSize: 10, fill: tickColor }}
                        interval={0}
                    />
                    <Tooltip 
                        cursor={{ fill: theme === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(200, 200, 200, 0.2)' }}
                        content={<CustomTooltip />}
                    />
                    <Bar dataKey="value" barSize={20}>
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReportStatusChart;