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


export default function ApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [editMode, setEditMode] = useState<string | null>(null);
    const [statusEdit, setStatusEdit] = useState('');

    const fetchApplications = async () => {
        const res = await axios.get(`${apiBaseUrl}/api/application/all`);
        setApplications(res.data);
    };

    const deleteApplication = async (id: string) => {
        await axios.delete(`/api/application/${id}`);
        fetchApplications();
    };

    const updateStatus = async (id: string) => {
        await axios.patch(`/api/application/${id}`, { status: statusEdit });
        setEditMode(null);
        fetchApplications();
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApps = applications.filter(app =>
        statusFilter ? app.status === statusFilter : true
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Application Table</h1>

            <div className="mb-4">
                <label className="mr-2">Filter by status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-1"
                >
                    <option value="">All</option>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <table className="table-auto border w-full text-left">
                <thead>
                    <tr className="bg-gray-100 h-[56px]">
                        <th className="p-2 w-[200px]">Company</th>
                        <th className="p-2 w-[800px]">Job Title</th>
                        <th className="p-2 w-[200px]">Status</th>
                        <th className="p-2 w-[200px]">Created Date</th>
                        <th className="p-2 w-[200px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApps.map((app) => (
                        <tr key={app.id} className="border-t h-[56px]">
                            <td className="p-2 w-[200px]">{app.jobPosting?.company?.name || 'N/A'}</td>
                            <td className="p-2 w-[800px]">{app.jobPosting?.title || 'N/A'}</td>
                            <td className="p-2 w-[200px]">
                                {editMode === app.id ? (
                                    <select
                                        value={statusEdit}
                                        onChange={(e) => setStatusEdit(e.target.value)}
                                        className="border p-1"
                                    >
                                        <option value="Not Applied">Not Applied</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                ) : (
                                    app.status
                                )}
                            </td>
                            <td className="p-2 w-[200px]">{app.createdAt?.slice(0, 10)}</td>
                            <td className="p-2 w-[200px]">
                                {editMode === app.id ? (
                                    <>
                                        <button
                                            className="text-blue-600"
                                            onClick={() => updateStatus(app.id)}
                                        >
                                            Save
                                        </button>

                                    </>
                                ) : (
                                    <button
                                        className="text-green-600"
                                        onClick={() => {
                                            setEditMode(app.id);
                                            setStatusEdit(app.status);
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="text-red-600"
                                    onClick={() => deleteApplication(app.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
