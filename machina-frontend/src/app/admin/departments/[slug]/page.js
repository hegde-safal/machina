"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, Loader2, AlertCircle, ArrowRight, BadgeAlert } from "lucide-react";

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [username, setUsername] = useState("Admin");
  const [department, setDepartment] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Auth check
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

  // 🔗 Fetch department documents
  useEffect(() => {
    if (!slug) return;

    async function fetchDepartmentDocs() {
      if (!API_BASE) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/admin/departments/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch department data");

        const data = await res.json();
        setDepartment(data.department || null);
        setDocuments(data.documents || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load department documents");
      } finally {
        setLoading(false);
      }
    }

    fetchDepartmentDocs();
  }, [slug, API_BASE]);

  const prettyName = department?.name || "Department";

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
          {/* Header + Back */}
          <button
            onClick={() => router.push("/admin/departments")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={18} />
            Back to Departments
          </button>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {prettyName}
            </h1>
            <p className="text-sm text-gray-500">
              Viewing all documents routed to this department.
            </p>
          </div>

          {/* Backend disabled state */}
          {backendDisabled && (
            <div className="p-6 mb-10 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
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

          {/* Loading */}
          {!backendDisabled && loading && (
            <div className="flex items-center gap-3 text-gray-500 text-lg mb-8">
              <Loader2 className="animate-spin" size={22} />
              Loading documents…
            </div>
          )}

          {/* Empty */}
          {!backendDisabled && !loading && documents.length === 0 && (
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 flex gap-3">
              <BadgeAlert className="text-gray-500 flex-shrink-0" size={22} />
              <div>
                <p className="font-semibold text-gray-800">
                  No documents routed yet
                </p>
                <p className="text-sm text-gray-600">
                  Upload a document and route it to this department to see it appear here.
                </p>
              </div>
            </div>
          )}

          {/* Documents table/list */}
          {!loading && documents.length > 0 && (
            <div className="space-y-4">
              {documents.map((doc) => (
                <button
                  key={doc.doc_id}
                  onClick={() => router.push(`/admin/doc/${doc.doc_id}`)}
                  className="w-full text-left p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition group"
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
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {doc.summary_preview}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last update: {doc.last_update || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Right side: status + arrow */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge status={doc.status} priority={doc.priority} />
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

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
            © 2025 FileFlux. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatusBadge({ status, priority }) {
  const norm = (status || "").toLowerCase();

  let base = "bg-gray-100 text-gray-700 border-gray-200";
  if (norm === "pending")
    base = "bg-amber-50 text-amber-700 border-amber-200";
  else if (norm === "in_progress" || norm === "in-progress")
    base = "bg-blue-50 text-blue-700 border-blue-200";
  else if (norm === "completed")
    base = "bg-green-50 text-green-700 border-green-200";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${base}`}
      >
        {status || "Unknown"}
      </span>
      {priority && (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wide">
          {priority}
        </span>
      )}
    </div>
  );
}
