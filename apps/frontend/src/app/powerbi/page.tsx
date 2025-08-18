'use client';

import React, { useState } from 'react';

export default function PowerBIReportPage() {
    const [activeTab, setActiveTab] = useState<'pdf' | 'interactive'>('interactive');
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [powerBiLoaded, setPowerBiLoaded] = useState(false);

    const pdfUrl = "/Career_Compass.pdf";
    const powerBiUrl = "https://app.powerbi.com/reportEmbed?reportId=57cb8529-041c-4ca1-91b3-e8e5987ea8e1&autoAuth=true&ctid=8322cefd-0a4c-4e2c-bde5-b17933e7b00f";

    const tabConfig = {
        interactive: {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Interactive Dashboard',
            description: 'Explore data with interactive charts and filters'
        },
        pdf: {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'PDF Report',
            description: 'Static report document for sharing and printing'
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Career Analytics Dashboard</h1>
                    <p className="text-slate-600 mt-2">Comprehensive insights into your job search progress and market trends</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        Export Data
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Share Report
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Applications Submitted</p>
                            <p className="text-2xl font-bold text-slate-900">24</p>
                            <p className="text-sm text-green-600 font-medium">+12% from last month</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Interview Rate</p>
                            <p className="text-2xl font-bold text-slate-900">16.7%</p>
                            <p className="text-sm text-green-600 font-medium">Above average</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Response Time</p>
                            <p className="text-2xl font-bold text-slate-900">5.2 days</p>
                            <p className="text-sm text-blue-600 font-medium">Industry standard</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Active Opportunities</p>
                            <p className="text-2xl font-bold text-slate-900">8</p>
                            <p className="text-sm text-orange-600 font-medium">In progress</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="border-b border-slate-200">
                    <div className="flex space-x-8 px-6">
                        {Object.entries(tabConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as 'pdf' | 'interactive')}
                                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                {config.icon}
                                <div className="text-left">
                                    <div>{config.title}</div>
                                    <div className="text-xs text-slate-400 font-normal">{config.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'interactive' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Interactive Power BI Dashboard</h2>
                                    <p className="text-slate-600">Explore your career data with interactive visualizations and real-time filtering</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${powerBiLoaded ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                        {powerBiLoaded ? 'Dashboard Loaded' : 'Loading Dashboard...'}
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Fullscreen">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="relative bg-slate-50 rounded-lg overflow-hidden">
                                {!powerBiLoaded && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-slate-600">Loading Power BI Dashboard...</p>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    title="Power BI Report"
                                    width="100%"
                                    height="800px"
                                    src={powerBiUrl}
                                    frameBorder="0"
                                    allowFullScreen={true}
                                    onLoad={() => setPowerBiLoaded(true)}
                                    className="rounded-lg shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center text-blue-700 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Interactive Features
                                    </div>
                                    <p className="text-sm text-blue-600">Click on charts to filter data, hover for details, and use slicers to customize views.</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center text-green-700 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Real-time Data
                                    </div>
                                    <p className="text-sm text-green-600">Dashboard updates automatically with your latest application data and market insights.</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center text-purple-700 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Smart Insights
                                    </div>
                                    <p className="text-sm text-purple-600">AI-powered recommendations based on your application patterns and success rates.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pdf' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Career Compass PDF Report</h2>
                                    <p className="text-slate-600">Downloadable report perfect for sharing with mentors, career counselors, or personal records</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${pdfLoaded ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                        {pdfLoaded ? 'PDF Loaded' : 'Loading PDF...'}
                                    </div>
                                    <a
                                        href={pdfUrl}
                                        download="Career_Compass_Report.pdf"
                                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        </svg>
                                        Download PDF
                                    </a>
                                </div>
                            </div>

                            <div className="relative bg-slate-50 rounded-lg overflow-hidden">
                                {!pdfLoaded && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-slate-600">Loading PDF Report...</p>
                                        </div>
                                    </div>
                                )}
                                <embed
                                    src={pdfUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="600px"
                                    onLoad={() => setPdfLoaded(true)}
                                    className="rounded-lg shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center text-slate-700 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Static Snapshot
                                    </div>
                                    <p className="text-sm text-slate-600">Comprehensive overview of your career metrics as of the report generation date.</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center text-slate-700 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        Easy Sharing
                                    </div>
                                    <p className="text-sm text-slate-600">Perfect for sharing with career advisors, mentors, or keeping in your professional portfolio.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Need help interpreting your data?</h3>
                        <p className="text-slate-600">Get personalized insights and recommendations based on your analytics.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="inline-flex items-center px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Get Help
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Insights
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
