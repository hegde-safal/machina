"use client";
import React, { useState } from 'react';
import { ChevronRight, Zap, Building2, MessageSquare, ArrowRight } from 'lucide-react';

export default function FileFluxLanding() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs - subtle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">FileFlux</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition font-medium text-sm">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition font-medium text-sm">Contact Us</a>
              <button className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition text-sm border border-blue-200 rounded-lg hover:bg-blue-50">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              AI-Powered Document <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Automation</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              FileFlux transforms messy organizational documents into insights — automatically summarizing, classifying, routing to departments, and enabling real-time collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-200 transition transform hover:scale-105 flex items-center justify-center gap-2">
                Start Free Today
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Why Choose FileFlux?</h2>
            <p className="text-lg text-gray-600">Streamline your document workflow with intelligent automation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
              className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100 transition duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-6 group-hover:shadow-lg transition">
                <Zap className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Classification</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI understands documents in context — invoices, HR records, compliance files, and more.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-cyan-100 transition duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 mb-6 group-hover:shadow-lg transition">
                <Building2 className="text-cyan-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Routing</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically distributes documents to the right department — eliminating manual sorting and delays.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100 transition duration-300 transform hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-6 group-hover:shadow-lg transition">
                <MessageSquare className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Built-in chat and status tracking keeps teams aligned with instant updates and transparent progress.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Ready to Transform Your Document Workflow?</h2>
            <p className="text-lg text-gray-600">Join teams that are saving hours every week with FileFlux.</p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition transform hover:scale-105 inline-flex items-center gap-2">
              Get Started Now
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="border-t border-gray-100 bg-white mt-20 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-gray-900 mb-2">Have Questions?</h3>
                <p className="text-gray-600">Reach out to us at <a href="mailto:fileflux@support.com" className="text-blue-600 hover:text-blue-700 font-semibold">fileflux@support.com</a></p>
              </div>
              <div className="text-center md:text-right text-sm text-gray-500">
                <p>© 2025 FileFlux. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}