"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import {
  FileText,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from "lucide-react";

export default function EmployeeDocPage({ params }) {
  const router = useRouter();
  const { doc_id } = params;

  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendDisabled = !API_BASE;

  // 🔐 Validate auth
  useEffect(() => {
    const stored = window.localStorage.getItem("authUser");
    if (!stored) return router.replace("/login");

    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "Employee") return router.replace("/login");
      setUsername(parsed.username);
      setDepartment(parsed.department);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // 📌 Load document data + chat
  useEffect(() => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }

    async function fetchDoc() {
      try {
        const res = await fetch(`${API_BASE}/employee/doc/${doc_id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDoc(data);
      } catch {
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    }

    async function fetchChat() {
      try {
        const res = await fetch(`${API_BASE}/employee/doc/${doc_id}/chat`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setChat(data);
      } catch {}
    }

    fetchDoc();
    fetchChat();
    const interval = setInterval(fetchChat, 3000); // auto refresh chat
    return () => clearInterval(interval);
  }, [API_BASE, doc_id]);

  // 🔄 Update status (Pending / In-Progress / Completed)
  const updateStatus = async (status) => {
    if (!API_BASE) return;

    try {
      const res = await fetch(`${API_BASE}/employee/doc/${doc_id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setDoc((prev) => ({ ...prev, status }));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  // 💬 Send chat message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !API_BASE) return;
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/employee/doc/${doc_id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: username,
          message: newMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error();

      setNewMessage("");
      const updated = await res.json();
      setChat(updated);
    } catch {
      toast.error("Message not sent");
    } finally {
      setSending(false);
    }
  };

  // 🔍 Semantic search inside document
  const handleSearch = async () => {
    if (!searchQuery.trim() || !API_BASE) return;
    try {
      const res = await fetch(
        `${API_BASE}/employee/doc/${doc_id}/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSearchResult(data.result);
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-15 animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="max-w-7xl mx-auto px-6 py-20">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-10"
          >
            <ArrowLeft size={20} /> Back
          </button>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={42} />
            </div>
          )}

          {/* Document details */}
          {doc && (
            <>
              <h1 className="text-5xl font-bold text-gray-900 mb-2 break-words">
                {doc.filename}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-10">
                <FileText size={22} />
                <span>Assigned to {department}</span>
              </div>

              {/* Status badges */}
              <div className="flex gap-4 mb-14">
                {["Pending", "In-Progress", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-6 py-2 rounded-lg border font-medium transition ${
                      doc.status === s
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-10 shadow mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} /> AI Summary
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {doc.summary}
                </p>
              </div>

              {/* Semantic Search */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-10 shadow mb-14">
                <h2 className="text-xl font-semibold mb-6">Search inside document</h2>
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Enter keyword or phrase..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:shadow-lg"
                  >
                    <Search size={20} />
                  </button>
                </div>
                {searchResult && (
                  <p className="text-gray-700 bg-white p-4 border rounded-lg leading-relaxed whitespace-pre-line">
                    {searchResult}
                  </p>
                )}
              </div>

              {/* Chat */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-10 shadow mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Discussion with Admin
                </h2>

                {/* Messages */}
                <div className="max-h-72 overflow-y-auto space-y-4 mb-6 pr-2">
                  {chat.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl max-w-[75%] ${
                        m.sender === username
                          ? "ml-auto bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm font-semibold">{m.sender}</p>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Send message */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:shadow-lg flex items-center gap-2 disabled:opacity-60"
                  >
                    {sending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Backend not set */}
          {!API_BASE && (
            <div className="mt-10 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertCircle className="text-amber-600" size={20} />
              <p className="font-semibold text-amber-900">
                Backend not connected — set NEXT_PUBLIC_API_BASE_URL.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
