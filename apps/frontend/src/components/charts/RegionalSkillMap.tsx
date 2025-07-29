'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

type RegionalSkill = {
    location: string;
    skills: { skill: string; count: number | null }[];  // count 可能是 null
};

type FlattenedData = {
    location: string;   // 與後端對應
    [skill: string]: string | number;
};

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
    '#d0ed57', '#a4de6c', '#d88884', '#83a6ed', '#a28eea'
];

export default function RegionalSkillMap() {
    const [data, setData] = useState<FlattenedData[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/stats/regional-skills')
            .then((res) => res.json())
            .then((raw: RegionalSkill[]) => {
                console.log('Raw data:', raw);
                // 過濾掉 count 為 null，排序並取 top 5
                const filtered = raw.map(region => {
                    const topSkills = region.skills
                        .filter(s => s.count !== null)
                        .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
                        .slice(0, 5);
                    return {
                        location: region.location,
                        skills: topSkills,
                    };
                });

                const transformed: FlattenedData[] = filtered.map((r) => {
                    const entry: FlattenedData = { location: r.location };
                    r.skills.forEach((skillObj) => {
                        entry[skillObj.skill] = skillObj.count ?? 0;
                    });
                    return entry;
                });

                setData(transformed);
            })
            .catch((err) => console.error('Error fetching regional skills:', err));
    }, []);

    // 取得所有 skill 名稱，不包含 'location'
    const allSkills = Array.from(
        new Set(data.flatMap((d) => Object.keys(d)).filter((k) => k !== 'location'))
    );

    return (
        <div className="w-full h-[400px] p-4">
            <h2 className="text-xl font-bold mb-2">Skill Distribution by Region</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {allSkills.map((skill, index) => (
                        <Bar key={skill} dataKey={skill} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
