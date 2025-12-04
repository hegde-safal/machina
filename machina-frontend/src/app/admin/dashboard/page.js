"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FilePlus, Search, Building2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL for FastAPI backend
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // Validate auth using the same key/shape as login & navbar (authUser)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("authUser");
    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Admin") {
        router.replace("/login");
        return;
      }

      if (parsed.username) {
        setUsername(parsed.username);
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Fetch dashboard data from backend (FastAPI)
  useEffect(() => {
    async function fetchData() {
      if (!API_BASE) {
        // Backend not configured yet – skip fetching
        setLoading(false);
        return;
      }

      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch(`${API_BASE}/admin/stats`),
          fetch(`${API_BASE}/admin/activity`),
        ]);

        if (!statsRes.ok || !activityRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const statsJson = await statsRes.json();
        const activityJson = await activityRes.json();

        setStats(statsJson);
        setActivity(activityJson);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-7xl mx-auto px-6 py-20">

          {/* Welcome */}
          <h1 className="text-5xl font-bold text-gray-900 mb-12">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{username}</span> 👋
          </h1>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Link href="/admin/upload" className="group">
              <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow hover:shadow-xl hover:scale-105 transition">
                <FilePlus size={38} className="text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h3>
                <p className="text-gray-600">Upload files and let AI classify and route them.</p>
              </div>
            </Link>

            <Link href="/admin/search" className="group">
              <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow hover:shadow-xl hover:scale-105 transition">
                <Search size={38} className="text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Search</h3>
                <p className="text-gray-600">Find documents using AI-powered semantic search.</p>
              </div>
            </Link>

            <Link href="/admin/departments" className="group">
              <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow hover:shadow-xl hover:scale-105 transition">
                <Building2 size={38} className="text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Departments</h3>
                <p className="text-gray-600">Track document progress across departments.</p>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">System Overview</h2>

            {backendDisabled && (
              <p className="text-gray-500 italic">
                Backend not connected yet. Set <code className="font-mono">NEXT_PUBLIC_API_BASE_URL</code> to enable live stats.
              </p>
            )}
            {!backendDisabled && loading && (
              <p className="text-gray-500 italic">Loading...</p>
            )}
            {!backendDisabled && !loading && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Documents" value={stats.total_docs} />
                <StatCard label="Processed Today" value={stats.processed_today} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="Completed" value={stats.completed} />
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            {backendDisabled && (
              <p className="text-gray-500 italic">
                Backend not connected yet. Activity will appear here once FastAPI is wired up.
              </p>
            )}
            {!backendDisabled && loading && (
              <p className="text-gray-500 italic">Fetching activity...</p>
            )}
            {!backendDisabled && !loading && activity.length === 0 && (
              <p className="text-gray-500 italic">No recent activity yet.</p>
            )}
            {!backendDisabled && !loading && activity.length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm divide-y">
                {activity.map((item, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">{item.doc_name}</p>
                    <p className="text-sm text-gray-600">
                      {item.action} → {item.department}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{item.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
