import React, { useState } from "react";
import { ArrowUp, Sparkles, MessageSquare, PhoneCall, HelpCircle } from "lucide-react";
import Navbar from "./Navbar";
import DashboardMockup from "./DashboardMockup";

interface HeroProps {
  onLoginClick: () => void;
}

export default function Hero({ onLoginClick }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchFeedback, setShowSearchFeedback] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchFeedback(true);
    setTimeout(() => {
      setShowSearchFeedback(false);
    }, 4000);
  };

  const bgImage = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85";
  const grassImage = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png";

  return (
    <div 
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Navbar Top */}
      <Navbar onLoginClick={onLoginClick} />

      {/* Flex spacer between Navbar and Content */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Hero Content Wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center flex flex-col items-center">
        
        {/* Headline */}
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
          <span className="block animate-fade-up">
            Timbang akurat.
          </span>
          <span className="block animate-fade-up [animation-delay:100ms]">
            Otomatis.
          </span>
        </h1>

        {/* Search Bar Form */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mx-auto w-full max-w-xl animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 relative"
        >
          <div className="flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5 shadow-sm focus-within:ring-gray-400 transition-shadow">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk timbangan atau panduan integrasi..."
              className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-2"
            />
            <button 
              type="submit"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center shadow"
              aria-label="Submit Search"
            >
              <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Search feedback toast */}
          {showSearchFeedback && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-up z-50">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>Memeriksa sinyal sensor timbangan untuk "{searchQuery}"... Silakan masuk untuk konfigurasi lengkap.</span>
            </div>
          )}
        </form>

        {/* Description */}
        <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto">
          Kelola kasir & timbangan digital secara real-time <br />
          -- terintegrasi langsung dengan <Sparkles className="inline w-4 h-4 -mt-1 text-amber-500" /> Timbangan CAS/SW
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up [animation-delay:460ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={onLoginClick}
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all active:translate-y-px"
          >
            Mulai Demo Gratis
          </button>
          <button 
            onClick={() => alert("Menghubungi tim penjualan Timbangan Cerdas... Kami akan segera menghubungi Anda di " + (localStorage.getItem("userEmail") || "nafadza@gmail.com"))}
            className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors bg-white/20 backdrop-blur-sm"
          >
            Hubungi Sales
          </button>
        </div>

      </div>

      {/* Flex spacer between Content and Dashboard */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup Container */}
      <div className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32">
        <DashboardMockup />
      </div>

      {/* Absolutely positioned grass PNG */}
      <img 
        src={grassImage} 
        alt="Grass bottom border overlay"
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none" 
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
