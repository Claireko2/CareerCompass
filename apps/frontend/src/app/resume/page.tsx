'use client';

import React, { useState } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResumeMatcher() {
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [resumeId, setResumeId] = useState('');
    const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
    const [addingJobIds, setAddingJobIds] = useState<Set<string>>(new Set());
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);

    const uploadResume = async () => {
        if (!file) {
            alert('Please upload a resume first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setUploadProgress(true);

        try {
            const res = await fetch(`${apiBaseUrl}/api/resume/upload_resume`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.status === 'success') {
                setResumeId(data.resume_id);
                alert('Resume uploaded successfully! Now you can match jobs.');
            } else {
                alert('Resume upload failed.');
            }
        } catch {
            alert('Error uploading resume.');
        } finally {
            setUploadProgress(false);
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
                return parsed.map((item, idx) => <div key={idx} className="flex items-start"><span className="text-slate-400 mr-2">•</span><span>{item}</span></div>);
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
        if (!resumeId) {
            alert('Please upload a resume first.');
            return;
        }
        if (!jobTitle) {
            alert('Please enter a job title.');
            return;
        }

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                resumeId,
                categories: jobTitle,
            });
            if (location) queryParams.append('location', location);

            const res = await fetch(`${apiBaseUrl}/api/match?${queryParams.toString()}`);
            const data = await res.json();
            setMatchedJobs(data.matchedJobs || []);
        } catch {
            alert('Error matching jobs.');
        } finally {
            setLoading(false);
        }
    };

    const addToApplications = async (jobId: string, url: string) => {
        if (!resumeId) {
            alert('Resume not uploaded.');
            return;
        }

        setAddingJobIds(prev => new Set(prev).add(jobId));

        try {
            const res = await fetch(`${apiBaseUrl}/api/application`, {
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
        const matchPercentage = job.matchScore ? (job.matchScore * 100).toFixed(1) : '0';

        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {(job.company?.name || job.company || 'U').charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                            <p className="text-slate-600 font-medium">{job.company?.name || job.company || 'Unknown Company'}</p>
                            {job.location && (
                                <p className="text-sm text-slate-500 flex items-center mt-1">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </p>
                            )}
                        </div>
                    </div>
                    {job.matchScore > 0 && (
                        <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${parseFloat(matchPercentage) >= 80 ? 'bg-green-100 text-green-700' :
                                    parseFloat(matchPercentage) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {matchPercentage}% Match
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700">Matched Skills</span>
                            <span className="text-lg font-bold text-green-600">{job.matchedSkills?.length || 0}</span>
                        </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-700">Missing Skills</span>
                            <span className="text-lg font-bold text-red-600">{job.missingSkills?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-4">
                    {/* Responsibilities */}
                    <div className="border-b border-slate-100 pb-4">
                        <button
                            onClick={toggleResp}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <h4 className="font-medium text-slate-900">Responsibilities</h4>
                            <svg className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform ${expandedResp ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {expandedResp && (
                            <div className="mt-3 text-sm text-slate-700 space-y-1">
                                {renderArrayOrString(job.responsibilities)}
                            </div>
                        )}
                    </div>

                    {/* Qualifications */}
                    <div className="border-b border-slate-100 pb-4">
                        <button
                            onClick={toggleQual}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <h4 className="font-medium text-slate-900">Qualifications</h4>
                            <svg className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform ${expandedQual ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {expandedQual && (
                            <div className="mt-3 text-sm text-slate-700 space-y-1">
                                {renderArrayOrString(job.qualifications)}
                            </div>
                        )}
                    </div>

                    {/* Matched Skills */}
                    {job.matchedSkills?.length > 0 && (
                        <div className="border-b border-slate-100 pb-4">
                            <button
                                onClick={toggleMatched}
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <h4 className="font-medium text-slate-900 text-green-700">Your Matching Skills</h4>
                                <svg className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform ${expandedMatched ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {(expandedMatched ? job.matchedSkills : job.matchedSkills.slice(0, 5)).map((skill: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        {skill}
                                    </span>
                                ))}
                                {!expandedMatched && job.matchedSkills.length > 5 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                        +{job.matchedSkills.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {job.missingSkills?.length > 0 && (
                        <div className="pb-4">
                            <button
                                onClick={toggleMissing}
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <h4 className="font-medium text-slate-900 text-red-700">Skills to Develop</h4>
                                <svg className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform ${expandedMissing ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {(expandedMissing ? job.missingSkills : job.missingSkills.slice(0, 5)).map((skill: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        {skill}
                                    </span>
                                ))}
                                {!expandedMissing && job.missingSkills.length > 5 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                        +{job.missingSkills.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {job.url && (
                        <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Job
                        </a>
                    )}

                    {isApplied ? (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Applied
                        </span>
                    ) : (
                        <button
                            onClick={() => addToApplications(job.jobId, job.url)}
                            disabled={isAdding}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isAdding
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isAdding ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add to Applications
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Resume Matcher</h1>
                    <p className="text-slate-600 mt-2">Upload your resume and find matching job opportunities</p>
                </div>
            </div>

            {/* Upload Resume Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Upload Your Resume</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex-1">
                                    <input
                                        type="file"
                                        name="file" 
                                        id="resumeFile"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept=".pdf,.doc,.docx"
                                        className="block w-full text-sm text-slate-500 file:mr-4 ..."
                                      />
                                </label>
                                <button
                                    onClick={uploadResume}
                                    disabled={!file || uploadProgress}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${!file || uploadProgress
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {uploadProgress ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload Resume'
                                    )}
                                </button>
                            </div>
                            {file && (
                                <p className="text-sm text-slate-600">
                                    Selected: {file.name}
                                </p>
                            )}
                            {resumeId && (
                                <div className="flex items-center text-sm text-green-600">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Resume uploaded successfully!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Search Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Find Matching Jobs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g., Data Analyst, Software Engineer"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Vancouver, Toronto"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            onClick={matchJobs}
                            disabled={!resumeId || !jobTitle || loading}
                            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${!resumeId || !jobTitle || loading
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Matching Jobs...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Find Matching Jobs
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {matchedJobs.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Job Matches</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {matchedJobs.length} jobs found
                        </span>
                    </div>
                    <div className="space-y-6">
                        {matchedJobs.map((job) => (
                            <JobItem key={job.jobId} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {matchedJobs.length === 0 && !loading && jobTitle && resumeId && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No matches found</h3>
                    <p className="text-slate-600">Try adjusting your search criteria or job title to find more opportunities.</p>
                </div>
            )}
        </div>
    );

}
