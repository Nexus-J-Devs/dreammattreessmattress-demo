import React from 'react';
import { Mattress } from '../types';
import { motion } from 'motion/react';
import { Star, Sliders, ShieldCheck, Flame, Layers, ArrowRight, AlertTriangle } from 'lucide-react';

interface MattressCardProps {
  mattress: Mattress;
  onSelect: (mattress: Mattress) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
}

export const MattressCard: React.FC<MattressCardProps> = ({
  mattress,
  onSelect,
  isCompared,
  onToggleCompare
}) => {
  const isLowStock = mattress.stock <= 5;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#5C4B8A]/50 hover:shadow-md transition-all text-[#4B3D6B]"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={mattress.image}
            alt={mattress.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#5C4B8A] border border-gray-200 backdrop-blur-md shadow-sm">
              {mattress.category}
            </span>
            {mattress.isPopular && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                ★ Best Seller
              </span>
            )}
            {mattress.isBestForBackPain && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#5C4B8A] border border-[#5C4B8A]/30 shadow-sm">
                Orthopedic Recommended
              </span>
            )}
          </div>

          {/* Low Stock Warning Badge */}
          {isLowStock && (
            <div className="absolute top-3 right-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Only {mattress.stock} Left!</span>
            </div>
          )}

          {/* Bottom Rating Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/20">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{mattress.rating}</span>
              <span className="text-gray-300 text-[10px]">({mattress.reviewCount})</span>
            </div>
            <span className="text-gray-100 font-medium text-[11px] bg-black/70 px-2.5 py-1 rounded-md border border-white/20">
              {mattress.thickness} Depth
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="font-bold text-xl text-[#4B3D6B] group-hover:text-[#5C4B8A] transition-colors">
            {mattress.name}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {mattress.tagline}
          </p>

          {/* Firmness Meter */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-gray-600">Firmness Scale</span>
              <span className="text-[#5C4B8A] font-bold">{mattress.firmnessLabel}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#5C4B8A] h-full rounded-full"
                style={{ width: `${(mattress.firmness / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Features List */}
          <ul className="mt-4 space-y-1.5 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{mattress.coilCount}</span>
            </li>
            <li className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-[#5C4B8A] shrink-0" />
              <span className="truncate">{mattress.coolingTech}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 pt-0 border-t border-gray-100 mt-4">
        <div className="flex items-baseline justify-between mb-4 pt-3">
          <div>
            <span className="text-2xl font-bold text-[#4B3D6B]">${mattress.price}</span>
            <span className="text-xs text-gray-400 line-through ml-2">${mattress.originalPrice}</span>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Save ${mattress.originalPrice - mattress.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(mattress)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#5C4B8A] hover:bg-[#4B3D6B] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Explore Specs</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleCompare(mattress.id)}
            className={`p-3 rounded-xl border transition-all ${
              isCompared
                ? 'bg-[#5C4B8A]/10 border-[#5C4B8A] text-[#5C4B8A]'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
            title={isCompared ? 'Remove from compare matrix' : 'Add to compare matrix'}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
