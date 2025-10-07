

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WorkloadStat } from '../types';

interface WorkloadLineChartProps {
    data: WorkloadStat[];
    theme: 'light' | 'dark';
}

const WorkloadLineChart: React.FC<WorkloadLineChartProps> = ({ data, theme }) => {
    const tickColor = theme === 'dark' ? '#a0aec0' : '#4a5568';
    
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e0e0e0'} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
                            borderColor: theme === 'dark' ? '#4a5568' : '#cccccc'
                        }}
                    />
                    <Legend wrapperStyle={{ color: tickColor }} />
                    <Line type="monotone" dataKey="Càrrega" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WorkloadLineChart;