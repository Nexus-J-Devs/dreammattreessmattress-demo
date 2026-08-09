import React from 'react';
import { Phone, ShieldCheck, HeartHandshake, Award, Truck, Check, Sparkles } from 'lucide-react';

export const ReassuranceSection: React.FC = () => {
  return (
    <section className="bg-white text-[#4B3D6B] py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Senior Comfort & Patient Care Commitment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#4B3D6B] tracking-tight">
            Sleep Peacefully. We Handle Everything.
          </h2>
          <p className="text-base text-gray-500 mt-3 leading-relaxed">
            Buying a mattress should be completely worry-free. Designed for maximum back support, effortless mobility, and total peace of mind.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#5C4B8A]/10 text-[#5C4B8A] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#5C4B8A]" />
            </div>
            <h3 className="font-bold text-xl text-[#4B3D6B]">100-Night Free Trial</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sleep on your new mattress for up to 100 nights in your own home. If you don't love it, we'll arrange a free pickup and issue a full refund. Zero hassle.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-xl text-[#4B3D6B]">White-Glove Setup</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our professional team delivers, unboxes, and sets up your new bed in your room of choice, then hauls away your old mattress for free.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#5C4B8A] flex items-center justify-center font-bold border border-[#5C4B8A]/20">
              <Award className="w-6 h-6 text-[#5C4B8A]" />
            </div>
            <h3 className="font-bold text-xl text-[#4B3D6B]">Orthopedic Firm Rails</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Reinforced edge support rails make sitting on the edge of the bed safe and effortless, preventing slipping when getting in or out of bed.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200">
              <Sparkles className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-bold text-xl text-[#4B3D6B]">Non-Toxic & Organic</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% GOLS & CertiPUR-US® certified organic cotton and natural latex. Free from formaldehyde, heavy metals, or toxic chemical flame retardants.
            </p>
          </div>
        </div>

        {/* Dedicated Phone Helpline Banner */}
        <div className="p-8 bg-[#4B3D6B] text-white rounded-3xl border border-[#5C4B8A]/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-[#E4CDA7] font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-[#E4CDA7]" />
              <span>Personal Sleep Advisory Helpline</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Questions? Speak directly with a friendly sleep expert.
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
              No automated menus or long hold times. Call +1 (555) 012-9943 to talk with a patient sleep specialist who can help you select the ideal firmness.
            </p>
          </div>

          <a
            href="tel:+15550129943"
            className="px-8 py-4 rounded-2xl bg-[#5C4B8A] hover:bg-[#3D305D] text-white font-bold text-base shadow-lg flex items-center gap-3 shrink-0 transition-colors border border-[#E4CDA7]/30"
          >
            <Phone className="w-5 h-5 text-[#E4CDA7]" />
            <span>Call +1 (555) 012-9943</span>
          </a>
        </div>
      </div>
    </section>
  );
};
