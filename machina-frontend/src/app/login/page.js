"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Lock, User, Building2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  // Hardcoded dummy users
  const USERS = [
    { username: "admin", password: "admin123", department: "Admin" },
    { username: "hr", password: "hr123", department: "HR Department" },
    { username: "finance", password: "finance123", department: "Finance Team" },
    { username: "procurement", password: "proc123", department: "Procurement Team" },
    { username: "engineering", password: "eng123", department: "Engineering Manager" },
    { username: "safety", password: "safe123", department: "Safety Officer" },
    { username: "compliance", password: "comp123", department: "Compliance Department" },
    { username: "operations", password: "ops123", department: "Operations Manager" },
  ];

  const handleLogin = () => {
    const user = USERS.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        u.department === department
    );

    if (!user) {
      toast.error("Invalid login details");
      return;
    }

    const isAdmin = department === "Admin";
    const dashboardPath = isAdmin
      ? "/admin/dashboard"
      : "/employee/dashboard";

    // Save login session
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "authUser",
        JSON.stringify({
          username,
          department,
          role: isAdmin ? "Admin" : "Employee",
        })
      );
    }

    toast.success(`Welcome ${username}! Redirecting...`);
    setTimeout(() => {
      router.push(dashboardPath);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply blur-3xl opacity-15 animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: "9s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* LOGIN CONTAINER */}
        <section className="max-w-3xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 shadow-xl backdrop-blur-sm">
            <h1 className="text-5xl font-bold text-center text-gray-900 mb-12">
              Welcome Back
            </h1>

            <div className="space-y-8">
              {/* Username */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white">
                  <User size={20} className="text-blue-600" />
                  <input
                    className="w-full outline-none text-gray-800"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white">
                  <Lock size={20} className="text-blue-600" />
                  <input
                    className="w-full outline-none text-gray-800"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Department
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white">
                  <Building2 size={20} className="text-blue-600" />
                  <select
                    className="w-full outline-none text-gray-800 bg-transparent"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select department</option>
                    <option value="Admin">Admin</option>
                    <option value="HR Department">HR Department</option>
                    <option value="Finance Team">Finance Team</option>
                    <option value="Procurement Team">Procurement Team</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Compliance Department">Compliance Department</option>
                    <option value="Operations Manager">Operations Manager</option>
                  </select>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold text-lg rounded-lg hover:shadow-lg hover:shadow-blue-300 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <LogIn size={22} />
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-10">
          <p className="text-center text-gray-500 text-sm">
            © 2025 FileFlux — All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
