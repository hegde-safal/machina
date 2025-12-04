"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { ChevronRight, Zap, Building2, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* HERO / INTRO */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center space-y-8 mb-20">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">FileFlux</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Transforming how enterprises manage documents through intelligent automation and seamless collaboration.
            </p>
          </div>

          {/* MISSION STATEMENT */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Reduce document chaos and empower teams to focus on what actually matters: execution, not paperwork. We believe that intelligent automation can unlock hours of productivity every week across any organization.
            </p>
          </div>

          {/* MAIN CONTENT */}
          <div className="space-y-12 mb-20">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">What is FileFlux?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                FileFlux is an AI-powered Intelligent Document Processing platform designed to eliminate manual sorting, reading, and routing of internal business documents. We enable organizations to extract insights instantly from files like invoices, HR letters, compliance paperwork, and engineering records.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">How We Make a Difference</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With automated document summarization, classification, routing, collaboration, and semantic search, FileFlux ensures faster decision making and transparency across departments.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition">
                  <CheckCircle2 className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant Summarization</h3>
                    <p className="text-gray-600 text-sm">Extract key information from documents in seconds, not hours.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition">
                  <CheckCircle2 className="text-cyan-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Classification</h3>
                    <p className="text-gray-600 text-sm">Automatically categorize documents with contextual understanding.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition">
                  <CheckCircle2 className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Intelligent Routing</h3>
                    <p className="text-gray-600 text-sm">Route documents to the correct teams and departments automatically.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition">
                  <CheckCircle2 className="text-cyan-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                    <p className="text-gray-600 text-sm">Built-in chat and status tracking for seamless team alignment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose FileFlux?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                In today&apos;s document-heavy business landscape, organizations waste countless hours on manual document processing. FileFlux solves this with enterprise-grade AI that understands context, learns your workflows, and adapts to your unique needs. Whether you&apos;re processing invoices, compliance documents, or HR records, FileFlux delivers the speed and accuracy your business demands.
              </p>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600">Join teams across industries transforming their document workflows.</p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition transform hover:scale-105 inline-flex items-center gap-2">
              Start Free Today
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