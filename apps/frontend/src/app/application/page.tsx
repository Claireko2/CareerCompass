'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.baseURL = `${apiBaseUrl}`;

type Application = {
    id: string;
    jobPostingId: string;
    resumeId: string;
    appliedDate?: string;
    status: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
    jobPosting?: {
        title: string;
        company?: {
            name: string;
        };
    };
};

const statusConfig = {
    'Not Applied': {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: '○',
        bgColor: 'bg-gray-50'
    },
    'Applied': {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: '→',
        bgColor: 'bg-blue-50'
    },
    'Interview': {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: '🎯',
        bgColor: 'bg-yellow-50'
    },
    'Offer': {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: '✓',
        bgColor: 'bg-green-50'
    },
    'Rejected': {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: '✗',
        bgColor: 'bg-red-50'
    }
};

export default function ApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [editMode, setEditMode] = useState<string | null>(null);
    const [statusEdit, setStatusEdit] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiBaseUrl}/api/application/all`);
            setApplications(res.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`/api/application/${id}`);
                fetchApplications();
            } catch (error) {
                console.error('Error deleting application:', error);
            }
        }
    };

    const updateStatus = async (id: string) => {
        try {
            await axios.patch(`/api/application/${id}`, { status: statusEdit });
            setEditMode(null);
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApps = applications.filter(app =>
        statusFilter ? app.status === statusFilter : true
    );

    // Calculate stats
    const stats = {
        total: applications.length,
        applied: applications.filter(app => app.status === 'Applied').length,
        interview: applications.filter(app => app.status === 'Interview').length,
        offer: applications.filter(app => app.status === 'Offer').length,
        rejected: applications.filter(app => app.status === 'Rejected').length
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Job Applications</h1>
                    <p className="text-slate-600 mt-2">Track and manage your job applications</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Application
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Applied</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">→</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Interview</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.interview}</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600">🎯</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Offers</p>
                            <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold">✓</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold">✗</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-slate-700">Filter by status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Applications</option>
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    {statusFilter && (
                        <span className="text-sm text-slate-600">
                            Showing {filteredApps.length} of {applications.length} applications
                        </span>
                    )}
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredApps.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No applications found</h3>
                        <p className="text-slate-600">
                            {statusFilter
                                ? `No applications with status "${statusFilter}"`
                                : "Start by adding your first job application"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Company</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Job Title</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Applied Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredApps.map((app) => (
                                    <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${statusConfig[app.status as keyof typeof statusConfig]?.bgColor}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                                    <span className="text-white font-bold text-sm">
                                                        {app.jobPosting?.company?.name?.charAt(0) || 'N'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {app.jobPosting?.company?.name || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900 line-clamp-2">
                                                {app.jobPosting?.title || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editMode === app.id ? (
                                                <select
                                                    value={statusEdit}
                                                    onChange={(e) => setStatusEdit(e.target.value)}
                                                    className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Not Applied">Not Applied</option>
                                                    <option value="Applied">Applied</option>
                                                    <option value="Interview">Interview</option>
                                                    <option value="Offer">Offer</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[app.status as keyof typeof statusConfig]?.color}`}>
                                                    <span className="mr-1">
                                                        {statusConfig[app.status as keyof typeof statusConfig]?.icon}
                                                    </span>
                                                    {app.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatDate(app.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {editMode === app.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(app.id)}
                                                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditMode(null)}
                                                            className="inline-flex items-center px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditMode(app.id);
                                                                setStatusEdit(app.status);
                                                            }}
                                                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteApplication(app.id)}
                                                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}