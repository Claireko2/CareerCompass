'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

interface CareerStats {
  applications: number;
  interviews: number;
  offers: number;
  resumes: number;
}

export default function Home() {
  const [stats, setStats] = useState<CareerStats>({
    applications: 0,
    interviews: 0,
    offers: 0,
    resumes: 1
  });
  const [loading, setLoading] = useState(true);

  const fetchCareerStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/application/all`);
      const applications = await res.json();

      if (Array.isArray(applications)) {
        const applicationStats: ApplicationStats = {
          total: applications.length,
          applied: applications.filter(app => app.status === 'Applied').length,
          interview: applications.filter(app => app.status === 'Interview').length,
          offer: applications.filter(app => app.status === 'Offer').length,
          rejected: applications.filter(app => app.status === 'Rejected').length
        };

        // Map to career journey stats
        setStats({
          applications: applicationStats.total,
          interviews: applicationStats.interview,
          offers: applicationStats.offer,
          resumes: 1 // You can expand this to fetch actual resume count from API
        });
      }
    } catch (error) {
      console.error('Error fetching career stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerStats();
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-8">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Smart Career Tracking Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Career Compass
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Your intelligent career dashboard designed to streamline job tracking,
                optimize resumes, and visualize your professional growth journey with
                powerful analytics and insights.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/powerbi"
                className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics Dashboard
              </Link>

              <Link
                href="/jobs"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                </svg>
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Career Progress</h2>
            <p className="text-slate-600">Real-time insights from your job search activities</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto animate-pulse"></div>
                  <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/application" className="group cursor-pointer">
                <div className="text-center space-y-3 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats.applications}</div>
                  <div className="text-slate-600 font-medium">Applications Submitted</div>
                  <div className="text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
                  </div>
                </div>
              </Link>

              <Link href="/application?filter=Interview" className="group cursor-pointer">
                <div className="text-center space-y-3 p-4 rounded-xl hover:bg-green-50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats.interviews}</div>
                  <div className="text-slate-600 font-medium">Interviews Scheduled</div>
                  <div className="text-green-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
                  </div>
                </div>
              </Link>

              <Link href="/application?filter=Offer" className="group cursor-pointer">
                <div className="text-center space-y-3 p-4 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{stats.offers}</div>
                  <div className="text-slate-600 font-medium">Job Offers Received</div>
                  <div className="text-purple-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
                  </div>
                </div>
              </Link>

              <Link href="/resume" className="group cursor-pointer">
                <div className="text-center space-y-3 p-4 rounded-xl hover:bg-yellow-50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{stats.resumes}</div>
                  <div className="text-slate-600 font-medium">Resume Versions</div>
                  <div className="text-yellow-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Manage resumes →
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Success Rate */}
          {!loading && stats.applications > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="inline-flex items-center space-x-6 text-sm text-slate-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Interview Rate: {stats.applications > 0 ? ((stats.interviews / stats.applications) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Offer Rate: {stats.applications > 0 ? ((stats.offers / stats.applications) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Everything you need to advance your career
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful tools and insights to help you track applications, optimize your resume,
            and make data-driven career decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Analytics Card */}
          <Link href="/powerbi" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Power BI Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualize your job search progress with interactive charts and comprehensive analytics dashboards.
              </p>
              <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                View Dashboard →
              </div>
            </div>
          </Link>

          {/* Resume Card */}
          <Link href="/resume" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Resume Builder</h3>
              <p className="text-slate-600 leading-relaxed">
                Create, edit, and optimize your resume with AI-powered suggestions and professional templates.
              </p>
              <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">
                Build Resume →
              </div>
            </div>
          </Link>

          {/* Jobs Card */}
          <Link href="/jobs" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Job Search</h3>
              <p className="text-slate-600 leading-relaxed">
                Discover and track job opportunities with smart filtering and personalized recommendations.
              </p>
              <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
                Search Jobs →
              </div>
            </div>
          </Link>

          {/* Applications Card */}
          <Link href="/application" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Applications</h3>
              <p className="text-slate-600 leading-relaxed">
                Manage and track all your job applications with status updates and follow-up reminders.
              </p>
              <div className="mt-4 text-red-600 font-medium group-hover:text-red-700">
                Track Applications →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to accelerate your career?</h2>
          <p className="text-slate-300 text-lg mb-8">Start tracking your applications and discover new opportunities today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/application"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Applications
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center px-8 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-white hover:text-slate-900 transition-colors"
            >
              Find Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}