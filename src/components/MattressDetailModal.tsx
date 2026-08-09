import React, { useState } from 'react';
import { Mattress } from '../types';
import { X, Star, ShieldCheck, Truck, Phone, Award, Layers, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface MattressDetailModalProps {
  mattress: Mattress | null;
  onClose: () => void;
  onCompare: (id: string) => void;
  isCompared: boolean;
}

export const MattressDetailModal: React.FC<MattressDetailModalProps> = ({
  mattress,
  onClose,
  onCompare,
  isCompared
}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  if (!mattress) return null;

  const monthlyPayment = Math.round(mattress.price / 24);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-[#1A1C1E] my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-[#4B3D6B] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5C4B8A] text-white border border-[#5C4B8A]/40">
              {mattress.category}
            </span>
            <span className="text-xs text-gray-300">Model ID: {mattress.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-[#5C4B8A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-[#F8F9FA]">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Image & Quick Badges */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={mattress.image}
                  alt={mattress.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{mattress.rating} Rating</span>
                  <span className="text-gray-300">({mattress.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-[#4B3D6B]">{mattress.trialPeriod}</div>
                    <div className="text-[10px] text-gray-500">In-Home Risk Free</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#5C4B8A] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4B3D6B]">White-Glove Setup</div>
                    <div className="text-[10px] text-gray-500">Free Old Mattress Removal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4B3D6B]">{mattress.name}</h2>
                <p className="text-sm text-[#5C4B8A] font-semibold mt-1">{mattress.tagline}</p>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{mattress.description}</p>
              </div>

              {/* Price & Financing Box */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-[#4B3D6B]">${mattress.price}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">${mattress.originalPrice}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Save ${mattress.originalPrice - mattress.price} Today
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 flex items-center justify-between border border-gray-200">
                  <span>0% APR Financing Option:</span>
                  <span className="font-bold text-[#5C4B8A]">${monthlyPayment}/month for 24 mos</span>
                </div>
              </div>

              {/* Spec Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold">Firmness Feel</span>
                  <div className="font-bold text-[#4B3D6B] mt-0.5">{mattress.firmnessLabel}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold">Total Depth</span>
                  <div className="font-bold text-[#4B3D6B] mt-0.5">{mattress.thickness}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold">Support Core</span>
                  <div className="font-bold text-[#4B3D6B] mt-0.5">{mattress.coilCount}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold">Cooling Tech</span>
                  <div className="font-bold text-[#4B3D6B] mt-0.5">{mattress.coolingTech}</div>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="space-y-3 pt-2">
                {orderSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Order Reserved! Our Sleep Concierge will call you at +1 (555) 012-9943 to confirm delivery date.</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setOrderSubmitted(true)}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-[#5C4B8A] hover:bg-[#4B3D6B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Reserve 100-Night Free Trial</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={() => onCompare(mattress.id)}
                      className={`px-4 py-3.5 rounded-xl text-xs font-semibold border transition-all ${
                        isCompared
                          ? 'bg-[#5C4B8A]/10 border-[#5C4B8A] text-[#5C4B8A]'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isCompared ? 'In Compare Matrix' : '+ Add to Compare'}
                    </button>
                  </div>
                )}

                <a
                  href="tel:+15550129943"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#4B3D6B] hover:bg-[#3D305D] text-xs text-white font-semibold flex items-center justify-center gap-2 transition-colors border border-[#E4CDA7]/30"
                >
                  <Phone className="w-4 h-4 text-[#E4CDA7]" />
                  <span>Call Store Specialist: +1 (555) 012-9943</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Layer Breakdown Explorer */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5C4B8A]" />
              <h3 className="font-bold text-lg text-[#4B3D6B]">Interactive Material Layer Architecture</h3>
            </div>
            <p className="text-xs text-gray-500">Click on any layer below to inspect engineered materials and anatomical function.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Left Column: Stacked Layer Buttons */}
              <div className="space-y-2 md:col-span-1">
                {mattress.layers.map((layer, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedLayerIndex === idx
                        ? 'bg-[#5C4B8A]/10 border-[#5C4B8A] text-[#5C4B8A] font-bold shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Layer {idx + 1}: {layer.title}</span>
                    <span className="text-[10px] font-mono text-gray-400">{layer.depth}</span>
                  </button>
                ))}
              </div>

              {/* Right Column: Active Layer Detail View */}
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C4B8A]">
                      Layer {selectedLayerIndex + 1} of {mattress.layers.length}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      Thickness: {mattress.layers[selectedLayerIndex].depth}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-[#4B3D6B]">
                    {mattress.layers[selectedLayerIndex].title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {mattress.layers[selectedLayerIndex].description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2 text-[11px] text-gray-500">
                  <Sparkles className="w-4 h-4 text-[#5C4B8A] shrink-0" />
                  <span>CertiPUR-US® & OEKO-TEX® Standard 100 Non-Toxic Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
