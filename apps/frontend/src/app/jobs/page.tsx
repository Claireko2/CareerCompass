'use client';

import { useState } from 'react';

export default function JobsPage() {
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [expandedJobIds, setExpandedJobIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedJobIds((prev) =>
            prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
        );
    };

    const handleLoadJobs = async () => {
        if (!category) return;
        setLoading(true);

        // Step 1: Ingest new jobs
        await fetch('http://localhost:8000/api/jobs/load', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category }),
        });

        // Step 2: Fetch jobs from DB
        const res = await fetch(
            `http://localhost:8000/api/jobs?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`
        );
        const data = await res.json();
        setJobs(data.jobs || []);
        setLoading(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Load Job Postings</h1>

            <div className="flex gap-4 items-center mb-6">
                <input
                    type="text"
                    placeholder="Enter job category (e.g., Data Analyst)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded px-4 py-2 w-64"
                />
                <input
                    type="text"
                    placeholder="Enter location (e.g., Vancouver)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border rounded px-4 py-2 w-64"
                />
                <button
                    onClick={handleLoadJobs}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Loading...' : 'Load Jobs'}
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Job Results</h2>
            <ul className="space-y-4">
                {jobs.map((job: any) => {
                    const locationParts = [
                        job.location?.city,
                        job.location?.region,
                        job.location?.country,
                    ]
                        .filter(Boolean)
                        .join(', ');

                    const updatedDate = job.updatedAt
                        ? new Date(job.updatedAt).toLocaleDateString()
                        : 'Unknown';

                    const isExpanded = expandedJobIds.includes(job.id);

                    return (
                        <li key={job.id} className="border p-4 rounded shadow">
                            <h3 className="text-lg font-bold">{job.title}</h3>
                            <p className="text-sm text-gray-600">
                                Company: {job.company?.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-600">
                                Location: {locationParts || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Updated: {updatedDate}
                            </p>
                            <p className="text-sm text-gray-700">
                                {isExpanded
                                    ? job.description || 'No description available.'
                                    : `${job.description?.slice(0, 200) || ''}...`}
                            </p>
                            <button
                                className="mt-2 text-blue-600 hover:underline text-sm"
                                onClick={() => toggleExpand(job.id)}
                            >
                                {isExpanded ? 'Show Less' : 'Read More'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
