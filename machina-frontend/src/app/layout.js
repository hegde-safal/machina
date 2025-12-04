import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";  // ⬅ ADD THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FileFlux",
  description: "AI-Powered Document Automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Toast Notification Component */}
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: "#e8f4ff",
                color: "#004b9a",
                border: "1px solid #b9dcff",
              },
            },
            error: {
              style: {
                background: "#ffecec",
                color: "#b00020",
                border: "1px solid #ffc4c4",
              },
            },
          }}
        />

      </body>
    </html>
  );
}
