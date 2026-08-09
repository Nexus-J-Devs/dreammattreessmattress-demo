import React, { useState } from 'react';
import { Mattress } from '../types';
import { Sliders, Plus, X, Check, ShieldCheck, Flame, Layers, ArrowRight, Star } from 'lucide-react';

interface ProductComparisonProps {
  allMattresses: Mattress[];
  selectedIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectProduct: (product: Mattress) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  allMattresses,
  selectedIds,
  onToggleCompare,
  onSelectProduct
}) => {
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(null);

  const selectedMattresses = allMattresses.filter(m => selectedIds.includes(m.id));
  const numCols = selectedMattresses.length + 1;
  const gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#4B3D6B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C4B8A]/10 border border-[#5C4B8A]/20 text-[#5C4B8A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sliders className="w-4 h-4 text-[#5C4B8A]" />
            <span>Interactive Sleep Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#4B3D6B] tracking-tight">
            Side-by-Side Model Comparison
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Compare materials, coil systems, thickness, firmness ratings, and thermal cooling specs.
          </p>
        </div>

        {/* Mattress Selection Dropdown / Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">Add to matrix:</span>
          {allMattresses.map((m) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => onToggleCompare(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#5C4B8A] text-white border-[#5C4B8A] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {isSelected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMattresses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm my-8">
          <Sliders className="w-12 h-12 text-[#5C4B8A] mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-xl text-[#4B3D6B]">No Mattresses Selected for Comparison</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">Select 2 or more mattresses above to compare specs side by side.</p>
          <div className="flex justify-center gap-2">
            {allMattresses.slice(0, 3).map(m => (
              <button
                key={m.id}
                onClick={() => onToggleCompare(m.id)}
                className="px-4 py-2 rounded-xl bg-[#5C4B8A] text-white font-bold text-xs hover:bg-[#4B3D6B] transition-colors"
              >
                + Add {m.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[700px]">
            {/* Header Product Cards Row */}
            <div style={gridStyle} className="gap-4 border-b border-gray-200 pb-6">
              <div className="p-4 bg-[#4B3D6B] text-white rounded-xl flex flex-col justify-end">
                <span className="text-xs font-bold text-[#E4CDA7] uppercase tracking-wider">Specifications</span>
                <h3 className="font-bold text-lg text-white mt-1">Comparison Specs</h3>
              </div>

              {selectedMattresses.map((m) => (
                <div key={m.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative flex flex-col justify-between">
                  <button
                    onClick={() => onToggleCompare(m.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded bg-gray-100 hover:bg-red-50 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    <img
                      src={m.image}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover rounded-lg border border-gray-200 mb-3"
                    />
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{m.rating} ({m.reviewCount} reviews)</span>
                    </div>
                    <h4 className="font-bold text-base text-[#4B3D6B]">{m.name}</h4>
                    <p className="text-xs text-[#5C4B8A] font-semibold mt-0.5">{m.category}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#4B3D6B]">${m.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5">${m.originalPrice}</span>
                    </div>
                    <button
                      onClick={() => onSelectProduct(m)}
                      className="px-3 py-1.5 rounded-lg bg-[#5C4B8A] hover:bg-[#4B3D6B] text-white font-bold text-xs transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Row: Firmness */}
            <div style={gridStyle} className="gap-4 py-4 border-b border-gray-200 items-center">
              <div className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <span>Firmness Level</span>
              </div>
              {selectedMattresses.map((m) => (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>{m.firmnessLabel}</span>
                    <span className="text-[#5C4B8A] font-bold">{m.firmness}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#5C4B8A] h-full rounded-full"
                      style={{ width: `${(m.firmness / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Row: Height / Thickness */}
            <div style={gridStyle} className="gap-4 py-4 border-b border-gray-200 items-center">
              <div className="font-semibold text-sm text-gray-700">Total Height</div>
              {selectedMattresses.map((m) => (
                <div key={m.id} className="text-sm font-bold text-[#4B3D6B]">
                  {m.thickness}
                </div>
              ))}
            </div>

            {/* Spec Row: Coil Count & Core */}
            <div style={gridStyle} className="gap-4 py-4 border-b border-gray-200 items-center">
              <div className="font-semibold text-sm text-gray-700">Support Core / Coils</div>
              {selectedMattresses.map((m) => (
                <div key={m.id} className="text-xs text-gray-600 font-medium leading-relaxed">
                  {m.coilCount}
                </div>
              ))}
            </div>

            {/* Spec Row: Thermal Cooling Tech */}
            <div style={gridStyle} className="gap-4 py-4 border-b border-gray-200 items-center">
              <div className="font-semibold text-sm text-gray-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#5C4B8A]" />
                <span>Cooling Tech</span>
              </div>
              {selectedMattresses.map((m) => (
                <div key={m.id} className="text-xs text-gray-600 font-medium">
                  {m.coolingTech}
                </div>
              ))}
            </div>

            {/* Spec Row: Trial & Warranty */}
            <div style={gridStyle} className="gap-4 py-4 border-b border-gray-200 items-center">
              <div className="font-semibold text-sm text-gray-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Trial & Warranty</span>
              </div>
              {selectedMattresses.map((m) => (
                <div key={m.id} className="text-xs text-gray-600 space-y-1">
                  <div>✓ {m.trialPeriod}</div>
                  <div>✓ {m.warranty}</div>
                </div>
              ))}
            </div>

            {/* Spec Row: Layer Construction Breakdown */}
            <div style={gridStyle} className="gap-4 py-6">
              <div className="font-semibold text-sm text-gray-700 flex items-start gap-1.5">
                <Layers className="w-4 h-4 text-[#5C4B8A] mt-1" />
                <div>
                  <span>Internal Layer Architecture</span>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">Top-to-bottom cross section breakdown</p>
                </div>
              </div>

              {selectedMattresses.map((m) => (
                <div key={m.id} className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {m.layers.map((layer, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-gray-200 text-xs shadow-2xs">
                      <div className="flex justify-between font-bold text-[#5C4B8A]">
                        <span>{layer.title}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{layer.depth}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug">{layer.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
