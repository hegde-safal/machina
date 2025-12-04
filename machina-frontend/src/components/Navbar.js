"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadUser = () => {
      try {
        const stored = window.localStorage.getItem("authUser");
        setAuthUser(stored ? JSON.parse(stored) : null);
      } catch {
        setAuthUser(null);
      }
    };

    loadUser();

    const handleStorage = (event) => {
      if (event.key === "authUser") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authUser");
    }
    setAuthUser(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            FileFlux
          </span>
        </div>

        {/* Public links always visible */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition font-medium text-sm">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition font-medium text-sm">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition font-medium text-sm">
            Contact Us
          </Link>

          {authUser ? (
            <>
              <span className="hidden sm:inline text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                Role: <span className="font-semibold">{authUser.role}</span>
              </span>
              {authUser.dashboardPath && (
                <Link
                  href={authUser.dashboardPath}
                  className="text-gray-600 hover:text-gray-900 transition font-medium text-sm"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-red-600 font-semibold hover:text-red-700 transition text-sm border border-red-200 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition text-sm border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
