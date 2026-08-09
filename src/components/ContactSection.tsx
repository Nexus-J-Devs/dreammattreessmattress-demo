import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-[#4B3D6B]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Store Info */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C4B8A]">Visit or Call Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4B3D6B] mt-1">
              Dream Haven Flagship Showroom & Customer Care
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Experience our mattresses in person or speak with our sleep architects over the phone. We offer private appointment consultations for older adults & families.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#5C4B8A]/10 text-[#5C4B8A] flex items-center justify-center shrink-0 font-bold">
                <Phone className="w-5 h-5 text-[#5C4B8A]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#4B3D6B]">Direct Phone Line & Helpline</h4>
                <a href="tel:+15550129943" className="text-[#5C4B8A] font-bold text-base hover:underline block mt-0.5">
                  +1 (555) 012-9943
                </a>
                <p className="text-xs text-gray-500 mt-0.5">Free phone consultations & order support</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#5C4B8A]/10 text-[#5C4B8A] flex items-center justify-center shrink-0 font-bold">
                <Mail className="w-5 h-5 text-[#5C4B8A]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#4B3D6B]">Email Enquiries</h4>
                <a href="mailto:hello@dreamhaven.example" className="text-[#5C4B8A] font-bold text-sm hover:underline block mt-0.5">
                  hello@dreamhaven.example
                </a>
                <p className="text-xs text-gray-500 mt-0.5">Responses within 2 hours during business hours</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#5C4B8A]/10 text-[#5C4B8A] flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-5 h-5 text-[#5C4B8A]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#4B3D6B]">Flagship Sleep Showroom</h4>
                <p className="text-xs text-gray-700 mt-0.5 font-medium">
                  742 Haven Sleep Boulevard, Suite 100, San Francisco, CA 94103
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#5C4B8A]/10 text-[#5C4B8A] flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-5 h-5 text-[#5C4B8A]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#4B3D6B]">Showroom & Helpline Hours</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Monday – Saturday: 9:00 AM – 7:00 PM PST<br />
                  Sunday: 10:00 AM – 5:00 PM PST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Callback Form */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-gray-200 shadow-md">
          <h3 className="font-bold text-xl text-[#4B3D6B] mb-1">Request a Private Phone Callback</h3>
          <p className="text-xs text-gray-500 mb-6">Have our senior sleep specialist call you at a convenient time.</p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-lg text-emerald-900">Callback Scheduled!</h4>
              <p className="text-xs text-emerald-700">
                Thank you, {formData.name || 'valued customer'}. A Dream Haven sleep architect will call you shortly at {formData.phone || '+1 (555) 012-9943'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harold Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#4B3D6B] text-sm focus:border-[#5C4B8A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number for Callback</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#4B3D6B] text-sm focus:border-[#5C4B8A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="harold@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#4B3D6B] text-sm focus:border-[#5C4B8A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">How can we assist you?</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Inquiring about firm back support mattresses for lower lumbar pain..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#4B3D6B] text-sm focus:border-[#5C4B8A] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#5C4B8A] hover:bg-[#4B3D6B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Submit Request for Free Callback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
