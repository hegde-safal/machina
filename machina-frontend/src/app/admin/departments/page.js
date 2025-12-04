"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Building2, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function DepartmentsOverviewPage() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Auth check (Admin only)
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
      if (parsed.username) setUsername(parsed.username);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // 🔗 Fetch department summary
  useEffect(() => {
    async function fetchDepartments() {
      if (!API_BASE) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/admin/departments/overview`);
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load departments");
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Department <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Workflows</span>
            </h1>
            <p className="text-lg text-gray-600">
              Track how each department is handling routed documents — pending, in progress, and completed.
            </p>
          </div>

          {/* BACKEND WARNING */}
          {backendDisabled && (
            <div className="p-6 mb-10 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Backend not configured</p>
                <p>
                  Set <code className="bg-amber-100 px-2 py-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> to load live department data.
                </p>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {!backendDisabled && loading && (
            <div className="flex items-center gap-3 text-gray-500 text-lg mb-8">
              <Loader2 className="animate-spin" size={22} />
              Loading departments…
            </div>
          )}

          {/* NO DATA STATE */}
          {!backendDisabled && !loading && departments.length === 0 && (
            <p className="text-gray-500 italic text-lg">
              No department data available yet. Upload and route some documents first.
            </p>
          )}

          {/* DEPARTMENT GRID */}
          {!loading && departments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {departments.map((dept) => (
                <button
                  key={dept.slug}
                  onClick={() => router.push(`/admin/departments/${dept.slug}`)}
                  className="text-left p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <Building2 className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">
                          Last activity: {dept.last_activity || "—"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={22}
                      className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <StatPill label="Pending" value={dept.pending} color="amber" />
                    <StatPill label="In Progress" value={dept.in_progress} color="blue" />
                    <StatPill label="Completed" value={dept.completed} color="green" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* FOOTNOTE / HINT */}
          {!loading && departments.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>
                Click on a department card to view all documents routed to that team and open detailed conversations.
              </span>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
            © 2025 FileFlux. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className={`rounded-2xl border px-3 py-3 ${colorMap[color] || ""}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
