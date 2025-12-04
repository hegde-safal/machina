"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, MessageCircle, Send, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const doc_id = params?.doc_id;

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Validate Admin auth
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (!stored) return router.replace("/login");
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Admin") return router.replace("/login");
    } catch {
      return router.replace("/login");
    }
  }, [router]);

  // 🔗 Fetch doc info
  const fetchDoc = async () => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/admin/doc/${doc_id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDoc(data);
    } catch (err) {
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doc_id) fetchDoc();
  }, [doc_id]);

  // 💬 Send Chat Message
  const sendMsg = async () => {
    if (!newMsg.trim()) return;
    if (!API_BASE) return toast.error("Backend not connected");

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/admin/doc/${doc_id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "Admin", text: newMsg }),
      });
      if (!res.ok) throw new Error();
      setNewMsg("");
      await fetchDoc(); // refresh messages
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // 🚦 Update Status
  const updateStatus = async (newStatus) => {
    if (!API_BASE) return toast.error("Backend not connected");
    try {
      const res = await fetch(`${API_BASE}/admin/doc/${doc_id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated");
      fetchDoc();
    } catch {
      toast.error("Could not update status");
    }
  };

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

        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* BACK */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* LOADING */}
          {loading && (
            <div className="flex items-center gap-3 text-gray-500 text-lg">
              <Loader2 className="animate-spin" size={22} /> Loading document…
            </div>
          )}

          {/* BACKEND DISABLED */}
          {backendDisabled && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 mt-8">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
              <p className="text-sm text-amber-800">
                Set <code className="bg-amber-100 px-2 py-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> to enable live data.
              </p>
            </div>
          )}

          {/* CONTENT */}
          {!loading && doc && (
            <div className="space-y-10">
              {/* TOP INFO */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{doc.filename}</p>
                    <p className="text-sm text-gray-600">{doc.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoPill label="Category" value={doc.category} />
                  <InfoPill label="Status" value={doc.status} />
                  <InfoPill label="Priority" value={doc.priority} />
                </div>

                {/* STATUS UPDATE */}
                <div className="mt-8 flex gap-3 flex-wrap">
                  {["Pending", "In Progress", "Completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                        doc.status === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUMMARY */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-10 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Generated Summary</h3>
                <p className="text-gray-700 leading-relaxed">{doc.summary}</p>
              </div>

              {/* CHAT */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-10 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle className="text-blue-600" size={24} />
                  Collaboration Chat
                </h3>

                {/* MESSAGES */}
                <div className="space-y-4 max-h-[280px] overflow-y-auto mb-6 pr-1">
                  {doc.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl max-w-[80%] ${
                        m.sender === "Admin"
                          ? "bg-blue-600 text-white ml-auto"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm font-semibold">{m.sender}</p>
                      <p>{m.text}</p>
                      <p className="text-[10px] opacity-70 mt-1">{m.timestamp}</p>
                    </div>
                  ))}
                </div>

                {/* SEND INPUT */}
                <div className="flex gap-2">
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMsg}
                    disabled={sending}
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg disabled:opacity-60"
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    Send
                  </button>
                </div>
              </div>
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

function InfoPill({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200">
      <p className="text-xs text-gray-500 mb-1 font-semibold">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value || "—"}</p>
    </div>
  );
}
