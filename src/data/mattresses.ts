import { Mattress, DiscountPromo } from '../types';

const heroImg = '/src/assets/images/hero_mattress_store_1786315099522.jpg';
const hybridImg = '/src/assets/images/hybrid_mattress_product_1786315112326.jpg';
const coolingImg = '/src/assets/images/cooling_gel_mattress_1786315123551.jpg';
const latexImg = '/src/assets/images/organic_latex_mattress_1786315136600.jpg';

export const INITIAL_MATTRESSES: Mattress[] = [
  {
    id: 'dh-celestial-hybrid',
    name: 'Celestial Cloud Hybrid',
    tagline: 'Optimal spinal alignment with cloud-like plush pressure relief',
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviewCount: 384,
    firmness: 6,
    firmnessLabel: 'Medium Plush (6/10)',
    stock: 12,
    category: 'Hybrid',
    coolingTech: 'Copper-Infused Phase Change Gel',
    thickness: '14 Inches',
    coilCount: '1,224 Individually Wrapped Coils',
    trialPeriod: '100 Nights Risk-Free',
    warranty: '10-Year Full Warranty',
    image: hybridImg,
    isPopular: true,
    isBestForBackPain: true,
    features: [
      '5-Zone Ergonomic Pocket Springs for Targeted Lumbar Support',
      'Copper-Infused Cooling Gel Memory Foam Layer',
      'Ultra-Soft Breathable Tencel™ Cover',
      'Zero Motion Transfer for Undisturbed Sleep'
    ],
    description: 'Engineered specifically for sleepers seeking orthopedic back pain relief without sacrificing plush luxury. Features 1,224 zoned pocket coils that adapt to your body weight.',
    layers: [
      { title: 'Quilted Tencel™ Cover', depth: '1.5"', description: 'Silky, hypoallergenic fabric that pulls heat away from the skin instantly.' },
      { title: 'Copper-Infused Cooling Gel Foam', depth: '2.0"', description: 'Antimicrobial memory foam providing pressure relief and active temperature regulation.' },
      { title: 'Responsive Support Transition Layer', depth: '2.0"', description: 'Prevents the feeling of sinking too deep while buffering body weight.' },
      { title: '5-Zone Pocketed Coil System', depth: '7.0"', description: 'Individually wrapped coils engineered with reinforced lumbar support zones.' },
      { title: 'High-Density Base Stability Core', depth: '1.5"', description: 'Structural foundation ensuring long-lasting durability without sagging.' }
    ]
  },
  {
    id: 'dh-artic-cool-gel',
    name: 'Arctic Chill Pure Cooling Gel',
    tagline: 'Advanced thermal regulation for hot sleepers & humid nights',
    price: 1099,
    originalPrice: 1449,
    rating: 4.8,
    reviewCount: 219,
    firmness: 5,
    firmnessLabel: 'Medium Soft (5/10)',
    stock: 4, // Low stock on purpose to highlight low stock alerts!
    category: 'Cooling Gel',
    coolingTech: 'GlacierIce™ Thermal Weave + Open-Cell Gel',
    thickness: '12 Inches',
    coilCount: '100% High-Density Memory Foam Base',
    trialPeriod: '100 Nights Risk-Free',
    warranty: '10-Year Full Warranty',
    image: coolingImg,
    isPopular: false,
    isBestForBackPain: false,
    features: [
      'GlacierIce™ Micro-encapsulated Phase Change Material',
      'Open-Cell Breathable Visco Foam Layers',
      'Contouring Shoulder & Hip Pressure Point Cushioning',
      'Machine-Washable Zip-Off Cooling Cover'
    ],
    description: 'Designed for hot sleepers who toss and turn. Maintains an ideal skin sleep temperature of 88°F throughout the night.',
    layers: [
      { title: 'GlacierIce™ Cool Touch Cover', depth: '1.0"', description: 'Cool-to-the-touch surface material designed for immediate chill feeling.' },
      { title: 'CryoGel™ Open-Cell Memory Foam', depth: '3.0"', description: 'Absorbs and dissipates excess body thermal energy 4x faster than standard foam.' },
      { title: 'Airflow Channels Transition Foam', depth: '2.0"', description: 'Perforated foam layer allowing continuous cross-ventilation.' },
      { title: 'Supportive Core Foundation', depth: '6.0"', description: 'Medical-grade high-resilience base foam for body contouring.' }
    ]
  },
  {
    id: 'dh-eco-sanctuary-latex',
    name: 'Eco Sanctuary Organic Latex',
    tagline: '100% GOLS Certified Organic Dunlop Latex & New Zealand Wool',
    price: 1599,
    originalPrice: 1999,
    rating: 5.0,
    reviewCount: 162,
    firmness: 7,
    firmnessLabel: 'Medium Firm (7/10)',
    stock: 8,
    category: 'Organic Latex',
    coolingTech: 'Natural Breathable Organic Wool & Perforated Latex',
    thickness: '13 Inches',
    coilCount: '1,088 Recycled Steel Pocket Coils',
    trialPeriod: '100 Nights Risk-Free',
    warranty: '25-Year Limited Warranty',
    image: latexImg,
    isPopular: false,
    isBestForBackPain: true,
    features: [
      'GOLS Certified Organic Dunlop Latex Layers',
      'Organic New Zealand Wool Fire-Retardant Barrier',
      'Non-Toxic, Zero Off-Gassing, Hypoallergenic',
      'Natural Buoyant Bounce for Effortless Bed Mobility'
    ],
    description: 'Handcrafted with non-toxic, eco-certified organic latex and wool. Provides resilient buoyant support that makes sitting up or rolling over effortless.',
    layers: [
      { title: 'Organic Cotton & New Zealand Wool Top', depth: '1.5"', description: 'Naturally temperature-regulating, moisture-wicking organic wool quilt.' },
      { title: 'Organic Dunlop Latex Comfort Layer', depth: '3.0"', description: 'Chemical-free natural latex offering dynamic push-back support.' },
      { title: 'Ergonomic Pocket Coil Array', depth: '7.0"', description: 'Quad-coil units made from 100% recycled high-tensile steel.' },
      { title: 'Eco Canvas Base Support', depth: '1.5"', description: 'Durable organic hemp-canvas base layer.' }
    ]
  },
  {
    id: 'dh-ortho-luxe-firm',
    name: 'Ortho Luxe Back Care Firm',
    tagline: 'Medical-grade spinal alignment for seniors and heavy body support',
    price: 1199,
    originalPrice: 1499,
    rating: 4.9,
    reviewCount: 295,
    firmness: 8,
    firmnessLabel: 'Firm (8/10)',
    stock: 3, // Low stock on purpose!
    category: 'Orthopedic',
    coolingTech: 'Air-Ventilated Edge Support + Gel Infused Layers',
    thickness: '12.5 Inches',
    coilCount: '1,350 Heavy Gauge Pocket Springs',
    trialPeriod: '100 Nights Risk-Free',
    warranty: '15-Year Full Warranty',
    image: heroImg,
    isPopular: true,
    isBestForBackPain: true,
    features: [
      'Orthopedic Spine-Correcting Lumbar Pad',
      'Reinforced Firm Edge Rails for Easy Sitting & Bed Entry/Exit',
      'Heavy-Gauge Coil Springs Supporting up to 800 lbs Total',
      'Recommended by Physical Therapists & Chiropractors'
    ],
    description: 'Specially constructed for individuals suffering from spinal stenosis, arthritis, or lower back stiffness. Firm border walls prevent sagging when sitting on the edge of the bed.',
    layers: [
      { title: 'Hypoallergenic Stretch Knit Cover', depth: '1.0"', description: 'Soft antimicrobial outer upholstery layer.' },
      { title: 'High-Density Ortho Relief Cushion', depth: '2.5"', description: 'Prevents body sway while maintaining firm posture alignment.' },
      { title: 'Thoracic & Lumbar Support Core', depth: '7.5"', description: '13.5-gauge reinforced steel coils designed for heavy weight support.' },
      { title: 'Stabilizing High-Density Platform', depth: '1.5"', description: 'Rigid base core for maximum stability.' }
    ]
  }
];

export const INITIAL_DISCOUNTS: DiscountPromo[] = [
  {
    id: 'promo-spring2026',
    code: 'DREAM200',
    title: 'Spring Comfort Event',
    discountType: 'fixed',
    discountValue: 200,
    description: '$200 OFF Any Mattress + Free White Glove Delivery & Old Mattress Removal',
    isActive: true,
    validUntil: '2026-09-30'
  },
  {
    id: 'promo-senior15',
    code: 'SENIOR15',
    title: 'Golden Years Special',
    discountType: 'percentage',
    discountValue: 15,
    description: '15% OFF for Seniors & Veterans + Complimentary Adjustable Base Consultation',
    isActive: true,
    validUntil: '2026-12-31'
  }
];
