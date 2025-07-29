import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';

export default function SkillTrendLineChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/stats/skill-trend')
            .then(res => res.json())
            .then(setData);
    }, []);
    return (
        <LineChart width={800} height={400} data={data}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="frequency" stroke="#82ca9d" />
        </LineChart>
    );
}
