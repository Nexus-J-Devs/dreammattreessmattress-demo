import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { Phone, Mail, Moon, Sliders, ShieldCheck, Sparkles, Layers, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'store' | 'quiz' | 'compare' | 'reassurance' | 'contact' | 'admin';
  setActiveTab: (tab: 'store' | 'quiz' | 'compare' | 'reassurance' | 'contact' | 'admin') => void;
  compareCount: number;
  openQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, compareCount, openQuiz }) => {
  const { isConnected } = useWebSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white text-[#1A1C1E] border-b border-gray-200 shadow-sm">
      {/* Top Banner with Store Phone & Trust Hotline */}
      <div className="bg-[#4B3D6B] px-4 py-2 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="tel:+15550129943"
              className="flex items-center gap-1.5 font-bold text-white hover:text-[#E4CDA7] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 shrink-0 text-[#E4CDA7]" />
              <span>Call a Sleep Specialist: +1 (555) 012-9943</span>
            </a>
            <span className="hidden sm:inline text-gray-600">|</span>
            <a
              href="mailto:hello@dreamhaven.example"
              className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>hello@dreamhaven.example</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-gray-300 text-[11px] sm:text-xs">
            <span className="hidden lg:inline-flex items-center gap-1 text-[#E4CDA7]">
              <ShieldCheck className="w-3.5 h-3.5" /> 100-Night Risk-Free Trial & Free White-Glove Setup
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-gray-300 hidden sm:inline">WS Live:</span>
              <span className={isConnected ? 'text-emerald-400' : 'text-amber-400'}>
                {isConnected ? 'Active' : 'Connecting'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => {
            setActiveTab('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#5C4B8A] flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Moon className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#4B3D6B] flex items-center gap-1.5">
              Dream Haven
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase bg-[#5C4B8A]/10 text-[#5C4B8A] px-1.5 py-0.5 rounded border border-[#5C4B8A]/20">
                Mattresses
              </span>
            </div>
            <p className="text-[11px] text-gray-500 tracking-wide font-sans">21st-Century Sleep Architecture</p>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'store' ? 'bg-[#5C4B8A]/10 text-[#5C4B8A]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#4B3D6B]'
            }`}
          >
            Mattress Catalog
          </button>

          <button
            onClick={openQuiz}
            className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#5C4B8A] text-white hover:bg-[#4B3D6B] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#E4CDA7]" />
            Sleep Preference Quiz
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'compare' ? 'bg-[#5C4B8A]/10 text-[#5C4B8A]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#4B3D6B]'
            }`}
          >
            <Sliders className="w-4 h-4 text-gray-500" />
            Compare Models
            {compareCount > 0 && (
              <span className="bg-[#5C4B8A] text-white font-bold text-xs px-1.5 py-0.2 rounded-full ml-1">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reassurance')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'reassurance' ? 'bg-[#5C4B8A]/10 text-[#5C4B8A]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#4B3D6B]'
            }`}
          >
            Senior & Back Care
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'contact' ? 'bg-[#5C4B8A]/10 text-[#5C4B8A]' : 'text-gray-700 hover:bg-gray-100 hover:text-[#4B3D6B]'
            }`}
          >
            Store & Hotline
          </button>
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-[#1A1C1E]"
            aria-label="Toggle Navigation Menu"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2">
          <button
            onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
          >
            <span>Mattress Catalog</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { openQuiz(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4A6FA5] hover:bg-[#3b5d8d] flex justify-between items-center"
          >
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-white" /> Sleep Preference Quiz</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={() => { setActiveTab('compare'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
          >
            <span>Compare Models {compareCount > 0 && `(${compareCount})`}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { setActiveTab('reassurance'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
          >
            <span>Senior & Back Care Support</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
          >
            <span>Store & Phone Hotline (+1 555-012-9943)</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
    </header>
  );
};
