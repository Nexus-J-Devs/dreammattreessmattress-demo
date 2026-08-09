import React, { useState } from 'react';
import { QuizAnswers, QuizSubmission, Mattress } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight, ArrowLeft, X, Moon, Flame, ShieldAlert, User, Phone, Mail, Award, CheckCircle } from 'lucide-react';

interface SleepQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Mattress) => void;
}

export const SleepQuizModal: React.FC<SleepQuizModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    sleepPosition: 'side',
    firmnessPreference: 'medium-firm',
    temperature: 'neutral',
    painPoints: ['lower_back'],
    bodyType: 'average',
    budget: 'mid',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    submission: QuizSubmission;
    recommendedProduct: Mattress;
    matchScore: number;
  } | null>(null);

  if (!isOpen) return null;

  const handlePainPointToggle = (pain: string) => {
    setAnswers(prev => {
      const exists = prev.painPoints.includes(pain);
      if (exists) {
        return { ...prev, painPoints: prev.painPoints.filter(p => p !== pain) };
      } else {
        return { ...prev, painPoints: [...prev.painPoints, pain] };
      }
    });
  };

  const handleQuizSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await res.json();
      setResult(data);
      setIsSubmitting(false);
      setStep(6); // Step 6 = Result View
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-[#1A1C1E] my-8">
        {/* Header */}
        <div className="bg-[#4B3D6B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5C4B8A] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E4CDA7]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Sleep Preference Matcher</h3>
              <p className="text-xs text-gray-300">60-Second Ergonomic Assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-[#5C4B8A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="bg-gray-100 h-1.5 w-full">
            <div
              className="bg-[#5C4B8A] h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 sm:p-8 bg-[#F8F9FA]">
          <AnimatePresence mode="wait">
            {/* Step 1: Sleep Position */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-[#5C4B8A] uppercase tracking-wider">Step 1 of 5</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#4B3D6B] mt-1">
                    What is your primary sleeping position?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This determines coil zoning and pressure relief allocation for your spine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'side', title: 'Side Sleeper', desc: 'Needs deep shoulder & hip cushioning' },
                    { id: 'back', title: 'Back Sleeper', desc: 'Needs lumbar spinal alignment support' },
                    { id: 'stomach', title: 'Stomach Sleeper', desc: 'Needs firm elevation to prevent arching' },
                    { id: 'combination', title: 'Combination / Toss & Turn', desc: 'Needs responsive easy mobility' }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setAnswers({ ...answers, sleepPosition: pos.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                        answers.sleepPosition === pos.id
                          ? 'bg-[#5C4B8A]/10 border-[#5C4B8A] text-[#4B3D6B] shadow-2xs font-medium'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm">{pos.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{pos.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        answers.sleepPosition === pos.id ? 'border-[#5C4B8A] bg-[#5C4B8A] text-white' : 'border-gray-300'
                      }`}>
                        {answers.sleepPosition === pos.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl bg-[#5C4B8A] hover:bg-[#4B3D6B] text-white font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Firmness Preference</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Firmness Preference */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-[#4A6FA5] uppercase tracking-wider">Step 2 of 5</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1C1E] mt-1">
                    How firm do you prefer your mattress surface?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the feel that gives you maximum sleep comfort.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'soft', title: 'Plush Soft (3-4 / 10)', desc: 'Cloud-like sinking feel, great for lighter side sleepers' },
                    { id: 'medium-soft', title: 'Medium Cushion (5-6 / 10)', desc: 'Balanced luxury padding with gentle supportive pushback' },
                    { id: 'medium-firm', title: 'Medium-Firm Support (7 / 10)', desc: '#1 Recommended by Chiropractors for back pain relief' },
                    { id: 'firm', title: 'Orthopedic Extra Firm (8-9 / 10)', desc: 'Solid rigid posture alignment, easy to sit up & roll over' }
                  ].map((firm) => (
                    <button
                      key={firm.id}
                      onClick={() => setAnswers({ ...answers, firmnessPreference: firm.id as any })}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        answers.firmnessPreference === firm.id
                          ? 'bg-[#4A6FA5]/10 border-[#4A6FA5] text-[#1A1C1E] shadow-2xs'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm">{firm.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{firm.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        answers.firmnessPreference === firm.id ? 'border-[#4A6FA5] bg-[#4A6FA5] text-white' : 'border-gray-300'
                      }`}>
                        {answers.firmnessPreference === firm.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-200 text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-xl bg-[#4A6FA5] hover:bg-[#3b5d8d] text-white font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Temperature Profile</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Temperature Profile */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-[#4A6FA5] uppercase tracking-wider">Step 3 of 5</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1C1E] mt-1">
                    Do you run hot or experience night sweats?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Helps us decide whether to recommend active phase-change gel memory foam.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'hot', title: 'I Sleep Very Hot', desc: 'Need active phase-change cryo gel cooling tech', icon: <Flame className="w-5 h-5 text-[#4A6FA5]" /> },
                    { id: 'neutral', title: 'Temperature Neutral', desc: 'Standard breathable airflow channels', icon: <Moon className="w-5 h-5 text-sky-600" /> },
                    { id: 'cold', title: 'I Get Chilly At Night', desc: 'Prefer plush warmth trapping materials', icon: <Sparkles className="w-5 h-5 text-emerald-600" /> }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => setAnswers({ ...answers, temperature: temp.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        answers.temperature === temp.id
                          ? 'bg-[#4A6FA5]/10 border-[#4A6FA5] text-[#1A1C1E] shadow-2xs'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="mb-3">{temp.icon}</div>
                      <div>
                        <div className="font-semibold text-sm">{temp.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{temp.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-200 text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 rounded-xl bg-[#4A6FA5] hover:bg-[#3b5d8d] text-white font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Pain Points & Care</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Pain Points */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-[#4A6FA5] uppercase tracking-wider">Step 4 of 5</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1C1E] mt-1">
                    Select any specific pain or sleep concerns:
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select all that apply. We filter for medical-grade zoning & edge rails.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'lower_back', title: 'Lower Back / Spinal Stiffness', desc: 'Requires 5-zone targeted lumbar coils' },
                    { id: 'shoulders', title: 'Shoulder & Neck Soreness', desc: 'Requires top cushion pressure sinking' },
                    { id: 'hips', title: 'Hip & Joint Pressure Points', desc: 'Requires contouring foam transition layer' },
                    { id: 'partner_motion', title: 'Partner Motion Disturbances', desc: 'Requires 100% isolated pocket coils' },
                    { id: 'edge_support', title: 'Difficulty Getting In / Out of Bed', desc: 'Requires high-density firm edge support rails' }
                  ].map((pain) => {
                    const selected = answers.painPoints.includes(pain.id);
                    return (
                      <button
                        key={pain.id}
                        type="button"
                        onClick={() => handlePainPointToggle(pain.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          selected
                            ? 'bg-[#4A6FA5]/10 border-[#4A6FA5] text-[#1A1C1E] shadow-2xs'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          selected ? 'border-[#4A6FA5] bg-[#4A6FA5] text-white' : 'border-gray-300'
                        }`}>
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{pain.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{pain.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-200 text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="px-6 py-3 rounded-xl bg-[#4A6FA5] hover:bg-[#3b5d8d] text-white font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Get My Match</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Contact Details for Lead Capture & Recommendations */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold text-[#4A6FA5] uppercase tracking-wider">Step 5 of 5</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1C1E] mt-1">
                    Where should we send your sleep analysis?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your contact details to calculate your personalized mattress match.
                  </p>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Margaret Smith"
                        value={answers.customerName || ''}
                        onChange={(e) => setAnswers({ ...answers, customerName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[#1A1C1E] text-sm focus:border-[#4A6FA5] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          placeholder="margaret@example.com"
                          value={answers.customerEmail || ''}
                          onChange={(e) => setAnswers({ ...answers, customerEmail: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[#1A1C1E] text-sm focus:border-[#4A6FA5] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone (Optional for callback)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={answers.customerPhone || ''}
                          onChange={(e) => setAnswers({ ...answers, customerPhone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[#1A1C1E] text-sm focus:border-[#4A6FA5] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(4)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#1A1C1E] hover:bg-gray-200 text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl bg-[#4A6FA5] hover:bg-[#3b5d8d] text-white font-bold text-base flex items-center gap-2 shadow-md disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <span>Calculating Ergonomic Match...</span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-white" />
                        <span>View My Mattress Match</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Quiz Match Result View */}
            {step === 6 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Ergonomic Match Calculated</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1C1E]">
                    {result.matchScore}% Personalized Match
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your sleep position, firmness requirement, and lumbar care preference.
                  </p>
                </div>

                {/* Recommended Product Box */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md flex flex-col sm:flex-row gap-5 items-center">
                  <img
                    src={result.recommendedProduct.image}
                    alt={result.recommendedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full sm:w-44 h-36 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4A6FA5]">
                        {result.recommendedProduct.category}
                      </span>
                      <span className="text-sm font-bold text-emerald-700">
                        ${result.recommendedProduct.price}{' '}
                        <span className="line-through text-gray-400 text-xs">${result.recommendedProduct.originalPrice}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-[#1A1C1E] mt-1">
                      {result.recommendedProduct.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {result.recommendedProduct.tagline}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.recommendedProduct.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 text-xs text-gray-700 shadow-2xs">
                  <h4 className="font-bold text-[#4A6FA5] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#4A6FA5]" /> Why this mattress was chosen for you:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Targeted zoning specifically engineered for <strong>{answers.sleepPosition} sleepers</strong></li>
                    <li>Configured with <strong>{result.recommendedProduct.firmnessLabel}</strong> as requested</li>
                    <li>Features <strong>{result.recommendedProduct.coolingTech}</strong> to regulate body heat</li>
                    <li>Includes 100-Night In-Home Free Trial & White-Glove Setup</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onSelectProduct(result.recommendedProduct);
                      onClose();
                    }}
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#4A6FA5] hover:bg-[#3b5d8d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Product Details & Ordering</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={resetQuiz}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm"
                  >
                    Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
