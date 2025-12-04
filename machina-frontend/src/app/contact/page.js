"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

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
          <div className="text-center space-y-6 mb-20">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Get in <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Have questions about FileFlux? Want to discuss integration with your organization? We&apos;re here to help.
            </p>
          </div>

          {/* CONTACT INFO CARDS */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Email */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-100 transition duration-300 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-6 mx-auto">
                <Mail className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
              <a href="mailto:fileflux@support.com" className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition break-all">
                fileflux@support.com
              </a>
              <p className="text-sm text-gray-600 mt-3">We&apos;ll respond within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-cyan-100 transition duration-300 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 mb-6 mx-auto">
                <Phone className="text-cyan-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Schedule a Demo</h3>
              <p className="text-gray-600 mb-4 text-sm">Talk to our sales team about your specific needs</p>
              <button className="px-6 py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition text-sm">
                Book a Call
              </button>
            </div>

            {/* Address */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-100 transition duration-300 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-6 mx-auto">
                <MapPin className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Support</h3>
              <p className="text-gray-600 mb-4 text-sm">Access documentation and help resources</p>
              <button className="px-6 py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition text-sm">
                Help Center
              </button>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">Tell us more about your needs and we&apos;ll get back to you shortly.</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={20} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition cursor-pointer group">
                <summary className="flex items-center justify-between font-semibold text-gray-900">
                  <span>How long does implementation take?</span>
                  <span className="text-2xl group-open:rotate-180 transition">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">Most implementations complete within 2-4 weeks, depending on document volume and integration complexity. Our onboarding team will provide a detailed timeline based on your needs.</p>
              </details>

              <details className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition cursor-pointer group">
                <summary className="flex items-center justify-between font-semibold text-gray-900">
                  <span>Is there a free trial available?</span>
                  <span className="text-2xl group-open:rotate-180 transition">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">Yes! Start your free trial today with no credit card required. You&apos;ll get full access to FileFlux&apos;s core features for 14 days.</p>
              </details>

              <details className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition cursor-pointer group">
                <summary className="flex items-center justify-between font-semibold text-gray-900">
                  <span>What document types does FileFlux support?</span>
                  <span className="text-2xl group-open:rotate-180 transition">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">FileFlux supports PDF, Word, Excel, email attachments, and scanned images. We continuously expand our supported formats based on customer needs.</p>
              </details>

              <details className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition cursor-pointer group">
                <summary className="flex items-center justify-between font-semibold text-gray-900">
                  <span>How do you ensure data security?</span>
                  <span className="text-2xl group-open:rotate-180 transition">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">We use enterprise-grade encryption, SOC 2 compliance, and regular security audits. Your documents are processed securely and never shared with third parties.</p>
              </details>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Ready to Transform Your Workflow?</h2>
            <p className="text-lg text-gray-600">Start your free trial today. No credit card required.</p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-300 transition transform hover:scale-105 inline-flex items-center gap-2">
              Start Free Today
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white mt-20 py-12">
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