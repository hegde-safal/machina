"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Upload, Loader2, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  const fileInputRef = useRef(null);
  const topRef = useRef(null);

  // 🔐 Validate authentication
  useEffect(() => {
    const stored = window.localStorage.getItem("authUser");
    if (!stored) return router.replace("/login");

    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Admin") return router.replace("/login");
      setUsername(parsed.username || "Admin");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const handleFilePick = (e) => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    setFile(chosen);
    setProcessed(null);
  };

  const clearFile = () => {
    setFile(null);
    setProcessed(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a document first");

    if (!API_BASE) {
      toast.error("Backend not configured — set NEXT_PUBLIC_API_BASE_URL");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    setProcessing(true);
    toast.loading("Processing document...");

    try {
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: "POST",
        body: fd,
      });

      toast.dismiss();

      if (!res.ok) {
        toast.error("Failed to process document");
        return;
      }

      const data = await res.json();
      setProcessed(data);
      toast.success("Document processed & routed successfully!");
    } catch {
      toast.dismiss();
      toast.error("Server unreachable");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <section ref={topRef} className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-16">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
              Upload &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Process Document
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Select a document and let our AI automatically classify, summarize, and route it to the correct department.
            </p>
          </div>

          {/* Upload container */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 space-y-8 shadow-md hover:shadow-lg transition">
            
            {/* File Picker */}
            {!file ? (
              <div
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className="relative p-12 rounded-2xl border-2 border-dashed border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer group outline-none"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition">
                    <Upload className="text-blue-600" size={32} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Click to upload</p>
                  <p className="text-sm text-gray-600">or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG, DOC, DOCX</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFilePick}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border-2 border-blue-300 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="text-blue-600" size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 break-all">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-900 text-sm transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={processing}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-300 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload & Process
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Process Result */}
          {processed && (
            <div className="mt-16 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={32} />
                Processing Complete
              </h2>

              {/* Document details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Details</h3>
                  <div className="space-y-4">
                    <Info label="Filename" value={processed.filename} />
                    <Info label="Category" value={processed.category} badge />
                    <Info label="Routed To" value={processed.routed_to} badge cyan />
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left">
                    <p className="font-semibold text-gray-900">View in Dashboard</p>
                    <p className="text-sm text-gray-600">Track document processing</p>
                  </button>
                  <button
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left"
                    onClick={() => {
                      clearFile();
                      topRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <p className="font-semibold text-gray-900">Upload Another</p>
                    <p className="text-sm text-gray-600">Process more documents</p>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="text-blue-600" size={24} />
                  AI-Generated Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{processed.summary}</p>
              </div>
            </div>
          )}

          {/* Backend warning */}
          {backendDisabled && (
            <div className="mt-10 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={22} />
              <div>
                <p className="font-semibold text-amber-900">Backend not configured</p>
                <p className="text-sm text-amber-800">
                  Set{" "}
                  <code className="bg-amber-100 px-2 py-1 rounded text-amber-900">
                    NEXT_PUBLIC_API_BASE_URL
                  </code>{" "}
                  to enable document processing.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-600">© 2025 FileFlux. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Info({ label, value, badge = false, cyan = false }) {
  if (!badge) return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <span
        className={`font-semibold px-3 py-1 rounded-lg ${
          cyan ? "bg-cyan-100 text-cyan-700" : "bg-blue-100 text-blue-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
