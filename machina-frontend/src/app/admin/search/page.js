"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Search, Loader2, FileText, ArrowRight, AlertCircle } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Auth validation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("authUser");
    if (!stored) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Admin") router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Enter keywords to search");
      return;
    }

    if (!API_BASE) {
      toast.error("Backend not configured");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/admin/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      // Backend returns { "results": [ { "text": "...", "metadata": { "filename": "..." }, "distance": ... } ] }

      const formattedResults = (data.results || []).map((item, idx) => ({
        doc_id: idx, // We don't have a real ID yet, using index or filename
        filename: item.metadata?.filename || "Unknown Document",
        preview: item.text?.substring(0, 200) + "..."
      }));
      setResults(formattedResults);
    } catch (err) {
      toast.error("Search failed — backend unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Background ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* HEADER */}
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-10 leading-tight">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Semantic Search
            </span>
          </h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-16">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by keywords — invoice total, employee name, contract ID…"
              className="flex-grow px-6 py-4 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-300 transition flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              Search
            </button>
          </div>

          {/* Backend disabled warning */}
          {backendDisabled && (
            <div className="p-6 mb-12 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
              <span className="text-sm text-amber-800">
                Backend not active. Set <code className="bg-amber-100 px-2 py-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> to enable search.
              </span>
            </div>
          )}

          {/* Search Result Area */}
          {!loading && results.length === 0 && query && (
            <p className="text-gray-500 italic text-lg">No matching documents found.</p>
          )}

          {loading && (
            <p className="text-gray-500 italic text-lg">Searching...</p>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(`/admin/doc/${item.doc_id}`)}
                  className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="text-blue-600" size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.filename}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{item.preview}</p>
                      </div>
                    </div>
                    <ArrowRight size={24} className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
            © 2025 FileFlux — All Rights Reserved
          </div>
        </footer>
      </div>
    </div>
  );
}
