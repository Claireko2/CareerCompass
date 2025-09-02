'use client';

import { useState } from 'react';

interface JobLocation {
    city?: string;
    region?: string;
    country?: string;
}

interface JobCompany {
    name?: string;
}

interface Job {
    id: string;
    title: string;
    description?: string;
    company?: JobCompany;
    location?: JobLocation;
    postedAt: string;
    updatedAt: string;
    salary?: string;
    jobType?: string;
}

export default function JobsPage() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [datePosted, setDatePosted] = useState<'all' | 'today' | '3days' | 'week' | 'month'>('all'); // new state
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [expandedJobIds, setExpandedJobIds] = useState<string[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const toggleExpand = (id: string) => {
        setExpandedJobIds((prev) =>
            prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
        );
    };

    const handleLoadJobs = async () => {
        setLoading(true);
        setSearchPerformed(true);

        try {
            // Step 1: Ingest new jobs
            await fetch(`${apiBaseUrl}/api/jobs/load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, date_posted: datePosted }),
            });

            // Step 2: Fetch jobs from DB
            const res = await fetch(
                `${apiBaseUrl}/api/jobs?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`
            );
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLoadJobs();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getLocationString = (location?: JobLocation) => {
        if (!location) return 'Remote / Not specified';
        const parts = [location.city, location.region, location.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Remote / Not specified';
    };

    const getCompanyInitial = (companyName?: string) => {
        return companyName?.charAt(0).toUpperCase() || 'C';
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Job Search</h1>
                    <p className="text-slate-600 mt-2">Discover new opportunities and advance your career</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm text-slate-600">Total Jobs Found</p>
                        <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="max-w-4xl">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Search Job Opportunities</h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* Job Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Job Category *</label>
                            <input
                                type="text"
                                placeholder="e.g., Data Analyst, Software Engineer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Location (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., Vancouver, Toronto, Remote"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                        </div>

                        {/* Date Posted Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date Posted</label>
                            <select
                                value={datePosted}
                                onChange={(e) => setDatePosted(e.target.value as any)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            >
                                <option value="all">All</option>
                                <option value="today">Today</option>
                                <option value="3days">Last 3 days</option>
                                <option value="week">Last week</option>
                                <option value="month">Last month</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleLoadJobs}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Searching Jobs...' : 'Search Jobs'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Results */}
            {searchPerformed && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            {jobs.length > 0 ? 'Available Positions' : 'Search Results'}
                        </h2>

                    </div>

                    {loading ? (
                        // Show loading message while fetching
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                            <svg className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Please wait...</h3>
                            <p className="text-slate-600">Fetching the latest jobs for you.</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        // Only show when NOT loading
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
                            <p className="text-slate-600 mb-4">
                                We could not find any jobs matching your search criteria. Try adjusting your search terms or location.
                                We could not find any jobs matching your search criteria. Try adjusting your search terms or location.
                            </p>
                            <div className="space-y-2 text-sm text-slate-600">
                                <p>• Try broader job categories (e.g., "Software" instead of "Senior Software Engineer")</p>
                                <p>• Remove location filters to see remote opportunities</p>
                                <p>• Check for spelling errors in your search terms</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {jobs.map((job) => {
                                const isExpanded = expandedJobIds.includes(job.id);
                                const locationString = getLocationString(job.location);

                                return (
                                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {getCompanyInitial(job.company?.name)}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{job.title}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            {job.company?.name || 'Company Not Specified'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {locationString}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Posted {formatDate(job.updatedAt)}
                                                        </div>
                                                    </div>
                                                    {job.salary && (
                                                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
                                                            {job.salary}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        {job.description && (
                                            <div className="mb-4">
                                                <div className="text-slate-700 leading-relaxed">
                                                    {isExpanded
                                                        ? job.description
                                                        : `${job.description.slice(0, 300)}${job.description.length > 300 ? '...' : ''}`
                                                    }
                                                </div>
                                                {job.description.length > 300 && (
                                                    <button
                                                        onClick={() => toggleExpand(job.id)}
                                                        className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                </svg>
                                                                Show Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                                Read More
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


