import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Mattress, Category } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MattressCard } from './components/MattressCard';
import { MattressDetailModal } from './components/MattressDetailModal';
import { SleepQuizModal } from './components/SleepQuizModal';
import { ProductComparison } from './components/ProductComparison';
import { ReassuranceSection } from './components/ReassuranceSection';
import { ContactSection } from './components/ContactSection';
import { AdminGuard } from './components/admin/AdminGuard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LiveNotificationToasts } from './components/LiveNotificationToasts';
import { Sparkles, Sliders, Phone, ShieldCheck, Heart, Moon, Search, Filter } from 'lucide-react';

type TabType = 'store' | 'quiz' | 'compare' | 'reassurance' | 'contact' | 'admin';

const getInitialTab = (): TabType => {
  if (typeof window === 'undefined') return 'store';
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path.startsWith('/admin')) return 'admin';
  if (path === '/compare' || path.startsWith('/compare')) return 'compare';
  if (path === '/reassurance' || path.startsWith('/reassurance')) return 'reassurance';
  if (path === '/contact' || path.startsWith('/contact')) return 'contact';
  if (path === '/quiz' || path.startsWith('/quiz')) return 'quiz';
  return 'store';
};

export default function App() {
  const [activeTab, setActiveTabState] = useState<TabType>(getInitialTab);
  const [mattresses, setMattresses] = useState<Mattress[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Mattress | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    const targetPath = tab === 'store' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFirmness, setSelectedFirmness] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch Mattresses
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setMattresses(data.products);
      })
      .catch(err => console.error('Failed to load mattresses:', err));
  }, []);

  const handleToggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 models simultaneously.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const filteredMattresses = mattresses.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFirmness = true;
    if (selectedFirmness === 'soft') matchesFirmness = m.firmness <= 5;
    if (selectedFirmness === 'medium') matchesFirmness = m.firmness === 6 || m.firmness === 7;
    if (selectedFirmness === 'firm') matchesFirmness = m.firmness >= 8;

    return matchesCat && matchesSearch && matchesFirmness;
  });

  return (
    <AuthProvider>
      <WebSocketProvider>
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1A1C1E] flex flex-col selection:bg-[#4A6FA5] selection:text-white">
          {/* Header Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            compareCount={compareIds.length}
            openQuiz={() => setQuizOpen(true)}
          />

          {/* Main Body Routing */}
          <main className="flex-1">
            {activeTab === 'store' && (
              <>
                {/* Hero Banner */}
                <HeroSection
                  openQuiz={() => setQuizOpen(true)}
                  goToCompare={() => setActiveTab('compare')}
                />

                {/* Catalog Container */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  {/* Section Title & Filter Toolbar */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C4B8A]/10 border border-[#5C4B8A]/20 text-[#5C4B8A] text-xs font-bold uppercase tracking-wider mb-2">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Curated Sleep Catalog</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-[#4B3D6B] tracking-tight">
                        Engineered Mattress Collection
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                        Designed for optimal posture support, thermal regulation, and total motion isolation.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search collection..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-[#4B3D6B] focus:outline-none focus:border-[#5C4B8A] shadow-sm"
                        />
                      </div>

                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-[#4B3D6B] focus:outline-none focus:border-[#5C4B8A] shadow-sm"
                      >
                        <option value="All">All Categories</option>
                        <option value="Hybrid">Hybrid Coils</option>
                        <option value="Cooling Gel">Cooling Gel</option>
                        <option value="Organic Latex">Organic Latex</option>
                        <option value="Orthopedic">Orthopedic Back Care</option>
                      </select>

                      <select
                        value={selectedFirmness}
                        onChange={(e) => setSelectedFirmness(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-[#4B3D6B] focus:outline-none focus:border-[#5C4B8A] shadow-sm"
                      >
                        <option value="All">All Firmness</option>
                        <option value="soft">Plush Soft (1-5)</option>
                        <option value="medium">Medium Cushion (6-7)</option>
                        <option value="firm">Extra Firm (8-10)</option>
                      </select>
                    </div>
                  </div>

                  {/* Product Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMattresses.map((m) => (
                      <MattressCard
                        key={m.id}
                        mattress={m}
                        onSelect={setSelectedProduct}
                        isCompared={compareIds.includes(m.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                </section>

                {/* Senior & Back Care Reassurance Section */}
                <ReassuranceSection />

                {/* Showroom & Contact Hotline Section */}
                <ContactSection />
              </>
            )}

            {activeTab === 'compare' && (
              <ProductComparison
                allMattresses={mattresses}
                selectedIds={compareIds}
                onToggleCompare={handleToggleCompare}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {activeTab === 'reassurance' && (
              <div className="py-8">
                <ReassuranceSection />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="py-8">
                <ContactSection />
              </div>
            )}

            {activeTab === 'admin' && (
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            )}
          </main>

          {/* Product Detail Overlay Modal */}
          {selectedProduct && (
            <MattressDetailModal
              mattress={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onCompare={handleToggleCompare}
              isCompared={compareIds.includes(selectedProduct.id)}
            />
          )}

          {/* Sleep Preference Quiz Modal */}
          <SleepQuizModal
            isOpen={quizOpen}
            onClose={() => setQuizOpen(false)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setQuizOpen(false);
            }}
          />

          {/* Live WebSocket Toast Notifications Overlay */}
          <LiveNotificationToasts />

          {/* Store Footer */}
          <footer className="bg-[#4B3D6B] border-t border-[#5C4B8A]/40 text-gray-300 text-xs py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5C4B8A] text-white font-bold flex items-center justify-center">
                  <Moon className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Dream Haven Mattresses</p>
                  <p className="text-[11px] text-gray-300">21st-Century Sleep Architecture & Direct Hotline +1 (555) 012-9943</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-300 text-[11px] flex-wrap justify-center">
                <span>100-Night In-Home Trial Guarantee</span>
                <span>•</span>
                <span>Free White-Glove Delivery</span>
                <span>•</span>
                <span>CertiPUR-US® Certified</span>
                <span>•</span>
                <a href="mailto:hello@dreamhaven.example" className="hover:underline text-[#E4CDA7]">
                  hello@dreamhaven.example
                </a>
              </div>

              <div className="text-[11px] text-gray-500">
                © 2026 Dream Haven Mattresses Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </WebSocketProvider>
    </AuthProvider>
  );
}
