import React from 'react';
import { Sparkles, Sliders, Phone, ShieldCheck, Award, Truck, Heart, ArrowRight } from 'lucide-react';

const heroImg = '/src/assets/images/hero_mattress_store_1786315099522.jpg';

interface HeroSectionProps {
  openQuiz: () => void;
  goToCompare: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ openQuiz, goToCompare }) => {
  return (
    <div className="relative bg-[#4B3D6B] text-white overflow-hidden border-b border-[#5C4B8A]/30">
      {/* Background Hero Image with Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Dream Haven Luxury Bedroom Experience"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-20 filter contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B3D6B] via-[#4B3D6B]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] mb-6">
            Wake Up Transformed.<br />
            <span className="text-[#E4CDA7]">
              Zero Back Pain. Pure Restoration.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal mb-8 max-w-2xl">
            Engineered with 5-zone targeted pocket coils, copper cooling technology, and pressure-relieving medical-grade foams. Tested for seniors, side sleepers, and back pain sufferers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-12">
            <button
              onClick={openQuiz}
              className="px-6 py-4 rounded-xl bg-[#5C4B8A] hover:bg-[#3D305D] text-white font-bold text-base shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group border border-[#E4CDA7]/30"
            >
              <Sparkles className="w-5 h-5 text-[#E4CDA7] group-hover:rotate-12 transition-transform" />
              <span>Take 60-Sec Sleep Preference Quiz</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={goToCompare}
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Sliders className="w-5 h-5 text-gray-200" />
              <span>Interactive Model Comparison</span>
            </button>
          </div>

          {/* Quick Call Out Phone Hotline for Older Adults */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md inline-flex items-center gap-4 text-sm max-w-xl">
            <div className="w-10 h-10 rounded-full bg-[#5C4B8A] text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#E4CDA7]" />
            </div>
            <div>
              <p className="font-semibold text-gray-200 text-xs sm:text-sm">Prefer to speak with an expert on the phone?</p>
              <a
                href="tel:+15550129943"
                className="text-[#E4CDA7] font-bold text-sm sm:text-base hover:underline flex items-center gap-1.5"
              >
                +1 (555) 012-9943 <span className="text-xs text-gray-300 font-normal">(Free In-Home Consultation)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Grid Footer */}
      <div className="relative z-10 bg-[#3B2F56] border-t border-[#5C4B8A]/40 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#E4CDA7] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">100-Night Free Trial</h4>
              <p className="text-[11px] text-gray-300">Sleep on it at home risk-free</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#E4CDA7] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">White-Glove In-Home Setup</h4>
              <p className="text-[11px] text-gray-300">Includes free old mattress removal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#E4CDA7] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Chiropractor Approved</h4>
              <p className="text-[11px] text-gray-300">Targeted spinal posture alignment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#E4CDA7] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">0% APR Financing Available</h4>
              <p className="text-[11px] text-gray-300">Low monthly plans starting at $42/mo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
