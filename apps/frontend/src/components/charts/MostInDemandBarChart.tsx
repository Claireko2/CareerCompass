import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export default function MostInDemandBarChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/stats/most-in-demand-skills')
            .then(res => res.json())
            .then(setData);
    }, []);

    return (
        <BarChart width={600} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="_count" fill="#8884d8" />
        </BarChart>
    );
}
