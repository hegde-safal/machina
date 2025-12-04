"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import {
  FileText,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
} from "lucide-react";

export default function EmployeeDashboard() {
  const router = useRouter();

  const [username, setUsername] = useState("Employee");
  const [department, setDepartment] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Auth guard for Employee
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("authUser");
    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Employee") {
        router.replace("/login");
        return;
      }
      setUsername(parsed.username || "Employee");
      setDepartment(parsed.department || "");
    } catch {
      router.replace("/login");
      return;
    }
  }, [router]);

  // 🔗 Fetch docs for this employee's department
  useEffect(() => {
    async function fetchDocs() {
      if (!API_BASE) {
        setLoading(false);
        return;
      }
      if (!department) return;

      try {
        const res = await fetch(`${API_BASE}/employee/docs`, {
          headers: {
            "X-User-Department": department,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch documents");

        const data = await res.json();
        // Expecting: { documents: [ { doc_id, filename, status, summary_preview, last_update, category } ] }
        setDocs(data.documents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    }

    fetchDocs();
  }, [API_BASE, department]);

  // 🧮 Stats from docs
  const stats = useMemo(() => {
    const total = docs.length;
    let pending = 0,
      inProgress = 0,
      completed = 0;

    docs.forEach((d) => {
      const s = (d.status || "").toLowerCase();
      if (s === "pending") pending++;
      else if (s === "in progress" || s === "in_progress") inProgress++;
      else if (s === "completed") completed++;
    });

    return { total, pending, inProgress, completed };
  }, [docs]);

  // 🔎 Filtered docs (search + status)
  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();

    return docs.filter((doc) => {
      // status filter
      if (statusFilter !== "All") {
        const s = (doc.status || "").toLowerCase();
        if (statusFilter === "Pending" && s !== "pending") return false;
        if (statusFilter === "In Progress" && s !== "in progress" && s !== "in_progress")
          return false;
        if (statusFilter === "Completed" && s !== "completed") return false;
      }

      // search filter
      if (!q) return true;

      const filename = (doc.filename || "").toLowerCase();
      const summary = (doc.summary_preview || doc.summary || "").toLowerCase();
      const category = (doc.category || "").toLowerCase();

      return (
        filename.includes(q) ||
        summary.includes(q) ||
        category.includes(q)
      );
    });
  }, [docs, query, statusFilter]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {username}
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              You’re viewing documents assigned to the{" "}
              <span className="font-semibold text-gray-800">
                {department || "Department"}
              </span>
              .
            </p>
          </div>

          {/* BACKEND WARNING */}
          {backendDisabled && (
            <div className="p-6 mb-8 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Backend not configured</p>
                <p>
                  Set{" "}
                  <code className="bg-amber-100 px-2 py-1 rounded">
                    NEXT_PUBLIC_API_BASE_URL
                  </code>{" "}
                  to load department documents.
                </p>
              </div>
            </div>
          )}

          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Documents" value={stats.total} />
            <StatCard label="Pending" value={stats.pending} tone="amber" />
            <StatCard label="In Progress" value={stats.inProgress} tone="blue" />
            <StatCard label="Completed" value={stats.completed} tone="green" />
          </div>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            {/* Search input */}
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by filename, summary, category…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={16} className="text-gray-500" />
              {["All", "Pending", "In Progress", "Completed"].map((label) => (
                <button
                  key={label}
                  onClick={() => setStatusFilter(label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    statusFilter === label
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING */}
          {!backendDisabled && loading && (
            <div className="flex items-center gap-3 text-gray-500 text-lg mb-8">
              <Loader2 className="animate-spin" size={22} />
              Loading your documents…
            </div>
          )}

          {/* EMPTY STATE */}
          {!backendDisabled && !loading && filteredDocs.length === 0 && (
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 flex gap-3">
              <Clock className="text-gray-400 flex-shrink-0" size={22} />
              <div>
                <p className="font-semibold text-gray-800">
                  No documents match the current filters
                </p>
                <p className="text-sm text-gray-600">
                  Try clearing the search or choosing a different status filter.
                </p>
              </div>
            </div>
          )}

          {/* DOC LIST */}
          {!loading && filteredDocs.length > 0 && (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.doc_id}
                  onClick={() => router.push(`/employee/doc/${doc.doc_id}`)}
                  className="w-full text-left p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-600" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          {doc.category || "Document"}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {doc.summary_preview || doc.summary || "No summary available."}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {doc.last_update || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge status={doc.status} />
                      <ArrowRight
                        size={20}
                        className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition"
                      />
                    </div>
                  </div>
                </button>
              ))}
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

function StatCard({ label, value, tone }) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    green: "bg-green-50 text-green-800 border-green-200",
  };
  const base = colorMap[tone] || "bg-gray-50 text-gray-800 border-gray-200";

  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${base}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  let cls = "bg-gray-100 text-gray-700 border-gray-200";

  if (s === "pending") cls = "bg-amber-50 text-amber-700 border-amber-200";
  else if (s === "in progress" || s === "in_progress")
    cls = "bg-blue-50 text-blue-700 border-blue-200";
  else if (s === "completed") cls = "bg-green-50 text-green-700 border-green-200";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {status || "Unknown"}
    </span>
  );
}
