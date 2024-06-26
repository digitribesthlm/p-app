import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const StrokesGainedChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="SGA"
          name="Strokes Gained"
          label={{ position: 'top' }}
        >
          {
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.SGA >= 0 ? '#82ca9d' : '#ff4d4d'} // Green for positive, red for negative
              />
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StrokesGainedChart;
