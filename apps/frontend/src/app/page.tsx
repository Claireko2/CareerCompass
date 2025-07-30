import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Welcome to Career Compass</h1>
      <p className="text-lg text-center max-w-xl">
        Your personal career dashboard to track jobs, resumes, and visualize
        your progress.
      </p>

      <nav className="flex flex-col space-y-4 text-xl">
        <Link href="/powerbi" className="text-blue-600 hover:underline">
          📊 Power BI Dashboard
        </Link>
        <Link href="/resume" className="text-blue-600 hover:underline">
          📄 Resume
        </Link>
        <Link href="/jobs" className="text-blue-600 hover:underline">
          💼 Jobs
        </Link>
        <Link href="/application" className="text-blue-600 hover:underline">
          📝 Applications
        </Link>
      </nav>
    </div>
  );
}
