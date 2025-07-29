'use client';

import React, { useState } from 'react';

export default function ResumeMatcher() {
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [resumeId, setResumeId] = useState('');
    const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
    const [addingJobIds, setAddingJobIds] = useState<Set<string>>(new Set());
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

    const uploadResume = async () => {
        if (!file) return alert('Upload a resume first.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/api/resume/upload_resume', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.status === 'success') {
                setResumeId(data.resume_id);
                alert('Resume uploaded. Now you can match jobs!');
            } else {
                alert('Resume upload failed.');
            }
        } catch {
            alert('Error uploading resume.');
        }
    };

    const renderArrayOrString = (data: any) => {
        if (!data) return 'N/A';
        try {
            let parsed;
            if (typeof data === 'string') {
                parsed = JSON.parse(data);
            } else {
                parsed = data;
            }

            if (Array.isArray(parsed)) {
                return parsed.map((item, idx) => <div key={idx}>• {item}</div>);
            }

            if (typeof parsed === 'string') {
                return parsed;
            }
            return JSON.stringify(parsed, null, 2);
        } catch {
            if (typeof data === 'string') return data;
            return JSON.stringify(data, null, 2);
        }
    };

    const matchJobs = async () => {
        if (!resumeId) return alert('Resume not uploaded.');

        try {
            const queryParams = new URLSearchParams({
                resumeId,
                categories: jobTitle,
            });
            if (location) queryParams.append('location', location);

            const res = await fetch(`http://localhost:8000/api/match?${queryParams.toString()}`);
            const data = await res.json();
            setMatchedJobs(data.matchedJobs || []);
        } catch {
            alert('Error matching jobs.');
        }
    };

    const addToApplications = async (jobId: string, url: string) => {
        if (!resumeId) return alert('Resume not uploaded.');

        setAddingJobIds(prev => new Set(prev).add(jobId));

        try {
            const res = await fetch('http://localhost:8000/api/application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, jobPostingId: jobId }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Job added to your applications!');
                setAppliedJobIds(prev => new Set(prev).add(jobId));
                if (url) window.open(url, '_blank');
            } else {
                alert('Failed to add job to applications.');
            }
        } catch {
            alert('Error adding job to applications.');
        }

        setAddingJobIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
        });
    };

    function JobItem({ job }: { job: any }) {
        const [expandedResp, setExpandedResp] = useState(false);
        const [expandedQual, setExpandedQual] = useState(false);
        const [expandedMatched, setExpandedMatched] = useState(false);
        const [expandedMissing, setExpandedMissing] = useState(false);

        const toggleResp = () => setExpandedResp(!expandedResp);
        const toggleQual = () => setExpandedQual(!expandedQual);
        const toggleMatched = () => setExpandedMatched(!expandedMatched);
        const toggleMissing = () => setExpandedMissing(!expandedMissing);

        const isAdding = addingJobIds.has(job.jobId);
        const isApplied = appliedJobIds.has(job.jobId);

        return (
            <li key={job.jobId} className="border p-4 rounded shadow mb-4">
                <h4 className="font-bold">{job.title} - {job.company?.name || job.company || 'Unknown Company'}</h4>
                {job.location && (
                    <p className="text-sm text-gray-500">
                        Location: {job.location}
                    </p>
                )}

                <div className="mt-2">
                    <strong>Responsibilities:</strong>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {expandedResp
                            ? renderArrayOrString(job.responsibilities)
                            : (() => {
                                const preview = Array.isArray(job.responsibilities)
                                    ? job.responsibilities.slice(0, 3).map((item: string, idx: number) => <div key={idx}>• {item}</div>)
                                    : String(job.responsibilities).slice(0, 150);
                                return preview;
                            })()
                        }
                    </div>
                    {job.responsibilities && (Array.isArray(job.responsibilities) ? job.responsibilities.length > 3 : String(job.responsibilities).length > 150) && (
                        <button onClick={toggleResp} className="text-blue-600 underline" type="button">
                            {expandedResp ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                <div className="mt-2">
                    <strong>Qualifications:</strong>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {expandedQual
                            ? renderArrayOrString(job.qualifications)
                            : (() => {
                                const preview = Array.isArray(job.qualifications)
                                    ? job.qualifications.slice(0, 3).map((item: string, idx: number) => <div key={idx}>• {item}</div>)
                                    : String(job.qualifications).slice(0, 150);
                                return preview;
                            })()
                        }
                    </div>
                    {job.qualifications && (Array.isArray(job.qualifications) ? job.qualifications.length > 3 : String(job.qualifications).length > 150) && (
                        <button onClick={toggleQual} className="text-blue-600 underline" type="button">
                            {expandedQual ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                <div className="mt-2">
                    <strong>Matched Skills ({job.matchedSkills?.length || 0}):</strong>
                    {job.matchedSkills?.length ? (
                        <>
                            {expandedMatched ? (
                                <ul className="list-disc ml-5 text-sm text-green-700">
                                    {job.matchedSkills.map((skill: string, idx: number) => (
                                        <li key={idx}>{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-green-700">
                                    {job.matchedSkills.slice(0, 10).join(', ')}{job.matchedSkills.length > 10 ? '...' : ''}
                                </p>
                            )}
                            {job.matchedSkills.length > 10 && (
                                <button onClick={toggleMatched} className="text-blue-600 underline" type="button">
                                    {expandedMatched ? 'Show less' : 'Show more'}
                                </button>
                            )}
                        </>
                    ) : <p className="text-sm text-gray-500">No matched skills</p>}
                </div>

                <div className="mt-2">
                    <strong>Missing Skills ({job.missingSkills?.length || 0}):</strong>
                    {job.missingSkills?.length ? (
                        <>
                            {expandedMissing ? (
                                <ul className="list-disc ml-5 text-sm text-red-700">
                                    {job.missingSkills.map((skill: string, idx: number) => (
                                        <li key={idx}>{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-red-700">
                                    {job.missingSkills.slice(0, 10).join(', ')}{job.missingSkills.length > 10 ? '...' : ''}
                                </p>
                            )}
                            {job.missingSkills.length > 10 && (
                                <button onClick={toggleMissing} className="text-blue-600 underline" type="button">
                                    {expandedMissing ? 'Show less' : 'Show more'}
                                </button>
                            )}
                        </>
                    ) : <p className="text-sm text-gray-500">No missing skills</p>}
                </div>

                {job.matchScore > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        Match Score: {(job.matchScore * 100).toFixed(1)}%
                    </p>
                )}

                {isApplied ? (
                    <div className="mt-3 space-y-1">
                        <span className="text-green-600 font-medium">✅ Applied</span>
                        {job.url && (
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline text-sm">
                                View Job Posting
                            </a>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => addToApplications(job.jobId, job.url)}
                        disabled={isAdding}
                        className={`mt-3 px-3 py-1 rounded text-white ${isAdding
                            ? 'bg-gray-400'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                            } disabled:opacity-50`}
                    >
                        {isAdding ? 'Adding...' : 'Add to Applications'}
                    </button>
                )}
            </li>
        );
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Resume Matcher</h2>

            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={uploadResume} className="bg-blue-500 text-white px-4 py-1 rounded my-2">
                Upload Resume
            </button>

            <div className="mt-4 space-y-2">
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter job title (e.g., Data Analyst)"
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter preferred location (e.g., Vancouver)"
                    className="border p-2 w-full"
                />
                <button onClick={matchJobs} className="bg-green-600 text-white px-4 py-1 rounded">
                    Match Jobs
                </button>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Top Matches</h3>
            <ul className="space-y-4">
                {matchedJobs.map((job) => (
                    <JobItem key={job.jobId} job={job} />
                ))}
            </ul>
        </div>
    );
}
