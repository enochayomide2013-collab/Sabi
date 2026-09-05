import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Bot, 
  Award, 
  ExternalLink,
  Lock,
  ArrowRight,
  Heart
} from 'lucide-react';
import { DataSaverModeToggle } from './DataSaverModeToggle';

interface AboutViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-fade-in" id="about-view-container">
      
      {/* HERO HEADER */}
      <div className="bg-gradient-to-br from-[#0A3D2E] via-[#0d4a38] to-[#06261c] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#0A3D2E]/40 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-3.5 py-1 rounded-full font-display">
            <Sparkles className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>Official Platform Overview</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight">
            About SABI: Nigeria's Community Truth & Food Price Intelligence
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            SABI is a decentralized real-time truth engine and live market spotter built for Nigerian citizens. We empower local spotters and everyday consumers to combat viral WhatsApp falsehoods, track exact local food commodity prices, and surface verified evidence instantly.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('verify')}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 font-display"
            >
              <span>Explore Verifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('market')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl backdrop-blur-md transition-all border border-white/20"
            >
              Check Food Prices
            </button>
          </div>
        </div>
      </div>

      {/* CORE PILLARS GRID */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black font-display text-gray-900">
            How SABI Protects Consumers & Communities
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Four powerful pillars combining decentralized human verification with instant AI forensic analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0A3D2E] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 font-display">
              1. On-Ground Community Spotters
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When a rumor or price claim surfaces in Lagos, Abuja, Kano, or Port Harcourt, nearby community verifiers visit local markets, take photos, and confirm actual prices and facts on the ground.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 font-display">
              2. SABI Evidence Reports & Deep Links
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every completed investigation generates a comprehensive SABI Evidence Report outlining the claim, location, community findings, AI media detection, sources, and a definitive verdict with shareable deep links.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 font-display">
              3. Live Food Price Transparency
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Track everyday market commodities across Nigeria with practical retail portions (sachet, cup, mudu, derica, paint rubber) so you never get overcharged at the market.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 font-display">
              4. Sabo AI & Truth Video Generator
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Interact instantly with Sabo AI for instant fact-checking, and convert any investigation into an engaging 20-second Truth Video ready to share across WhatsApp and TikTok.
            </p>
          </div>

        </div>
      </div>

      {/* CREATOR PROFILE SECTION */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-200 dark:border-emerald-800">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
              Meet The Owner & Founder 🇳🇬
            </span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white font-display">
              Enoch Ayomide
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
              Lead Platform Developer, Creator & Community Architect
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 px-4 py-2.5 rounded-2xl shadow-3xs shrink-0">
            <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <div className="text-left">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">State of Origin</span>
              <span className="text-xs font-black text-[#0A3D2E] dark:text-emerald-300">Osun State, Ile-Ife</span>
            </div>
          </div>
        </div>

        {/* OWNER DIRECT CONTACT BADGES */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-700 space-y-3">
          <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Direct Owner Contact & Social Media
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <a
              href="https://wa.me/2348032813855?text=Hello%20Enoch%20Ayomide,%20I%20am%20a%20SABI%20web%20user"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl flex items-center gap-2.5 font-bold transition-all shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                💬
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] text-emerald-200 uppercase font-black">WhatsApp Contact</span>
                <span className="text-xs font-mono font-bold">+234 8032813855</span>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@EnochAyomide"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl flex items-center gap-2.5 font-bold transition-all shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                📺
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] text-red-200 uppercase font-black">YouTube Channel</span>
                <span className="text-xs font-bold truncate block">Enoch Ayomide (51 Subs)</span>
              </div>
            </a>

            <a
              href="mailto:enochayomide67@gmail.com"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center gap-2.5 font-bold transition-all shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                ✉️
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] text-blue-200 uppercase font-black">Direct Owner Email</span>
                <span className="text-xs font-mono font-bold truncate block">enochayomide67@gmail.com</span>
              </div>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              SABI was envisioned and designed by <strong className="text-gray-950 dark:text-white">Enoch Ayomide</strong>, an ambitious Nigerian teenage developer from the ancient historical city of <strong className="text-gray-950 dark:text-white">Ile-Ife in Osun State</strong>. Driven by the mission of engineering practical digital solutions for everyday Nigerian challenges, Enoch built SABI to unite technology, real-time market prices, and grassroots citizen journalism.
            </p>
            <p>
              Observing how viral social media hoaxes and sudden food price fluctuations in local markets directly impact average households, Enoch crafted a platform that pairs advanced generative AI tools with the collective honesty of local spotters on the ground.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-3xs space-y-2">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Developer's Vision</span>
              </span>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                "As a developer coding in Nigeria, I saw firsthand how fast fake WhatsApp broadcasts spread panic and how hard it is to know true market prices. I built SABI to give Nigerians a clean, interactive tool where people can instantly crosscheck facts with neighbors on the street and see live market food prices."
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                Proudly representing technological innovation on the national scale.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THE GOLDEN SOVEREIGN PORTAL NOTE */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-gray-950 rounded-3xl p-6 sm:p-7 shadow-md border border-amber-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFD60A] px-2.5 py-0.5 rounded-full">
              VIP Member Benefit
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold font-display text-black">
              The Sabiation & <span className="font-mono">avidayo.created.app</span>
            </h3>
            <p className="text-xs text-amber-950/90 font-medium max-w-xl">
              Golden Sovereign and Deluxe members unlock exclusive direct access to the secret AI web generator portal and creative prompt suites.
            </p>
          </div>

          <button
            onClick={() => onNavigate('sabiation')}
            className="bg-[#0A3D2E] hover:bg-[#06291e] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5 font-display"
          >
            <span>Visit The Sabiation</span>
            <ExternalLink className="w-4 h-4 text-[#FFD60A]" />
          </button>
        </div>
      </div>

      {/* LOW BANDWIDTH & DATA SAVER TOGGLE */}
      <DataSaverModeToggle />

      {/* FOOTER NOTE */}
      <div className="text-center text-xs text-gray-500 space-y-3 pt-4 border-t border-gray-200">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl space-y-1">
          <p className="font-bold text-gray-900 dark:text-gray-100">About SABI</p>
          <p>Owner: Ayomide Adebayo</p>
          <p>Email: <a href="mailto:Enochayomide67@gmail.com" className="text-emerald-700 dark:text-emerald-400 hover:underline">Enochayomide67@gmail.com</a></p>
          <p>Phone: +234 8032813855</p>
        </div>
        <p className="flex items-center justify-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Nigerian Communities & Truth Verifiers
        </p>
        <p>© 2026 SABI Platform. All rights reserved. Stat Points are community reputation tokens.</p>
      </div>

    </div>
  );
};
