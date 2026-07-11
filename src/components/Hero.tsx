import React, { useState } from "react";
import { 
  ArrowUp, 
  Sparkles, 
  Scale, 
  ShoppingCart, 
  Package, 
  ShieldCheck, 
  Printer, 
  TrendingUp, 
  Code2, 
  Cpu, 
  Layers, 
  Users, 
  Check,
  Plus,
  Minus,
  ArrowRight,
  BookOpen,
  Database,
  Laptop
} from "lucide-react";
import Navbar from "./Navbar";
import DashboardMockup from "./DashboardMockup";

interface HeroProps {
  onLoginClick: () => void;
}

export default function Hero({ onLoginClick }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchFeedback, setShowSearchFeedback] = useState(false);

  // States for interactive section 2-7
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 text-slate-900 flex flex-col font-sans selection:bg-gray-200 selection:text-black">
      
      {/* 1. HERO SECTION WITH DECORATIVE BACKGROUND */}
      <div 
        className="relative min-h-[95svh] overflow-hidden bg-cover bg-center flex flex-col pb-20 border-b border-gray-200/50"
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
                <span>Memeriksa sinyal sensor timbangan untuk "{searchQuery}". Silakan masuk untuk konfigurasi lengkap.</span>
              </div>
            )}
          </form>

          {/* Description */}
          <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
            Kelola kasir dan timbangan digital secara real-time terintegrasi langsung dengan Timbangan CAS, SW-1S, dan timbangan digital berbasis serial port lainnya.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up [animation-delay:460ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={onLoginClick}
              className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all active:translate-y-px"
            >
              Coba Timbangan Cerdas
            </button>
            <button 
              onClick={() => alert("Menghubungi tim penjualan Timbangan Cerdas. Kami akan segera menghubungi Anda di " + (localStorage.getItem("userEmail") || "nafadza@gmail.com"))}
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


      {/* 2. STYLE DARI REFERENSI: SECTION 2-7 (CLEAN WHITE AESTHETIC) */}
      
      {/* SECTION 2 & 3: DUAL-PANEL FITUR (Meningkatkan Akurasi & Efisiensi) */}
      <div className="bg-white py-24 sm:py-32 z-20 relative border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left max-w-2xl mb-16">
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">FITUR UTAMA DASBOR</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-gray-950 mt-2 tracking-tight leading-tight">
              Meningkatkan keamanan, ketersediaan, dan kecepatan transaksi ritel Anda.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Side: Dynamic Feature List Selector */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Feature 1 */}
              <button 
                onClick={() => setActiveFeature(0)}
                className={`p-6 text-left rounded-2xl border transition-all duration-300 ${
                  activeFeature === 0 
                    ? "bg-zinc-50 border-zinc-200/80 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    activeFeature === 0 ? "bg-white border-zinc-300 text-gray-950" : "bg-zinc-100/60 border-zinc-200 text-zinc-500"
                  }`}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Koneksi Timbangan Serial</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Integrasi port komunikasi RS232 real-time.</p>
                  </div>
                </div>
                {activeFeature === 0 && (
                  <p className="text-xs text-zinc-600 mt-4 leading-relaxed animate-fade-in">
                    Menghubungkan langsung perangkat keras timbangan digital dengan browser Anda melalui API komunikasi terenkripsi. Mengurangi jeda pembacaan berat di kasir.
                  </p>
                )}
              </button>

              {/* Feature 2 */}
              <button 
                onClick={() => setActiveFeature(1)}
                className={`p-6 text-left rounded-2xl border transition-all duration-300 ${
                  activeFeature === 1 
                    ? "bg-zinc-50 border-zinc-200/80 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    activeFeature === 1 ? "bg-white border-zinc-300 text-gray-950" : "bg-zinc-100/60 border-zinc-200 text-zinc-500"
                  }`}>
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Sistem Kasir Pintar (POS)</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Kalkulasi harga otomatis berbasis bobot.</p>
                  </div>
                </div>
                {activeFeature === 1 && (
                  <p className="text-xs text-zinc-600 mt-4 leading-relaxed animate-fade-in">
                    Menghitung nilai subtotal transaksi secara dinamis dengan mengalikan berat barang aktual terhadap tarif yang terdaftar di database inventaris.
                  </p>
                )}
              </button>

              {/* Feature 3 */}
              <button 
                onClick={() => setActiveFeature(2)}
                className={`p-6 text-left rounded-2xl border transition-all duration-300 ${
                  activeFeature === 2 
                    ? "bg-zinc-50 border-zinc-200/80 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    activeFeature === 2 ? "bg-white border-zinc-300 text-gray-950" : "bg-zinc-100/60 border-zinc-200 text-zinc-500"
                  }`}>
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Arsitektur Kode C# WPF</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Penjelajah kode sumber sistem lokal teruji.</p>
                  </div>
                </div>
                {activeFeature === 2 && (
                  <p className="text-xs text-zinc-600 mt-4 leading-relaxed animate-fade-in">
                    Menyediakan referensi pemrograman C# WPF siap pakai yang menangani pembacaan port COM serial Windows tingkat rendah untuk keperluan pengembangan software desktop.
                  </p>
                )}
              </button>

            </div>

            {/* Right Side: Interactive Clean UI Widget Panel */}
            <div className="lg:col-span-7 bg-zinc-50/50 rounded-3xl border border-zinc-200/60 p-8 sm:p-10 flex flex-col min-h-[380px] justify-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 rounded-full blur-2xl opacity-50" />
              
              {activeFeature === 0 && (
                <div className="space-y-6 animate-fade-in relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <span className="text-xs font-mono font-bold text-zinc-400">STATUS ALIRAN PORT COM1</span>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-zinc-900 text-white font-bold tracking-wider">AKTIF</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-zinc-600 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Baud Rate:</span>
                      <span className="text-gray-900 font-bold">9600 bps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Data Bits:</span>
                      <span className="text-gray-900 font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stop Bits:</span>
                      <span className="text-gray-900 font-bold">One</span>
                    </div>
                    <div className="border-t border-zinc-100 my-2 pt-2 flex justify-between items-center">
                      <span className="text-zinc-400">Stream Aktual:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">ST,GS,+   1.250kg\r\n</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Sistem mendeteksi kestabilan sensor dan mengirimkan data bobot akurat secara kontinu untuk diproses langsung oleh kasir.
                  </p>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="space-y-6 animate-fade-in relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <span className="text-xs font-mono font-bold text-zinc-400">ALGORITMA KALKULASI TRANSAKSI</span>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 font-bold">STANDAR AKUNTANSI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
                      <span className="text-[10px] text-zinc-400 block font-semibold">TARIF PRODUK</span>
                      <span className="text-base font-bold text-gray-900 block mt-1">Rp40.000 / Kg</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm">
                      <span className="text-[10px] text-zinc-400 block font-semibold">BOBOT TIMBANG</span>
                      <span className="text-base font-bold text-gray-900 block mt-1">1.250 Kg</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900 text-white p-4 rounded-xl flex justify-between items-center">
                    <span className="text-xs text-zinc-300 font-medium">TOTAL BELANJA</span>
                    <span className="text-lg font-bold">Rp50.000</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Pembulatan otomatis ke nilai mata uang Rupiah terdekat dilakukan seketika untuk menjaga kepatuhan pencatatan sistem laporan keuangan toko Anda.
                  </p>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="space-y-4 animate-fade-in relative z-10">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                    <span className="text-xs font-mono font-bold text-zinc-400">C# WPF SERIAL INTERACTION</span>
                    <span className="text-[10px] text-zinc-500 font-mono">.NET 8</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 font-mono text-[11px] text-zinc-700 overflow-x-auto">
                    <span className="text-blue-700">private void</span> <span className="text-gray-900 font-bold">OnDataReceived</span>(<span className="text-blue-700">object</span> sender, SerialDataReceivedEventArgs e)<br />
                    {"{"}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-700">string</span> rawData = _serialPort.ReadExisting();<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;this.Dispatcher.Invoke(() =&gt; ParseWeight(rawData));<br />
                    {"}"}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Kode di atas mendemonstrasikan metode penerimaan data asynchronous pada thread WPF UI agar aplikasi tetap responsif saat menerima ribuan data timbangan per detik.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: ECOSYSTEM INTEGRATION (Built to Work with Your Ecosystem) */}
      <div className="bg-zinc-50/40 py-24 sm:py-32 z-20 relative border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">INTEGRASI PERANGKAT</span>
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-950 mt-2 tracking-tight">
            Dirancang agar selaras dengan ekosistem Anda.
          </h2>
          <p className="text-sm text-zinc-600 mt-4 max-w-xl mx-auto leading-relaxed">
            Kami memahami kelancaran operasional bergantung pada keselarasan seluruh komponen. Sistem kami terhubung secara universal ke berbagai model perangkat keras dan sistem operasi.
          </p>

          {/* Centered Mockup with floating badges as requested by style image */}
          <div className="relative mt-16 max-w-2xl mx-auto border border-zinc-200/80 rounded-3xl p-4 bg-white/80 shadow-md">
            
            {/* Embedded central mini dashboard */}
            <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6 flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-xs font-bold text-gray-900">Koneksi Hardware Eksternal</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">SIAP DIGUNAKAN</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs">
                  <span className="text-zinc-400 block text-[9px] font-bold">CAS SW-1S</span>
                  <span className="text-gray-900 font-bold block mt-1">9600 Baud</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs">
                  <span className="text-zinc-400 block text-[9px] font-bold">CAS ER-PLUS</span>
                  <span className="text-gray-900 font-bold block mt-1">4800 Baud</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs">
                  <span className="text-zinc-400 block text-[9px] font-bold">RS-232 USB</span>
                  <span className="text-gray-900 font-bold block mt-1">COM3 Port</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs">
                  <span className="text-zinc-400 block text-[9px] font-bold">THERMAL PRINTER</span>
                  <span className="text-gray-900 font-bold block mt-1">ESC/POS</span>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="hidden md:block absolute -top-6 -left-6 bg-white border border-zinc-200 px-4 py-2 rounded-full text-xs font-medium shadow-sm text-gray-800 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-zinc-600" />
              <span>CAS SW-II</span>
            </div>
            <div className="hidden md:block absolute -top-8 -right-6 bg-white border border-zinc-200 px-4 py-2 rounded-full text-xs font-medium shadow-sm text-gray-800 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-zinc-600" />
              <span>Windows 11</span>
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-8 bg-white border border-zinc-200 px-4 py-2 rounded-full text-xs font-medium shadow-sm text-gray-800 flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-zinc-600" />
              <span>.NET 8 Core</span>
            </div>
            <div className="hidden md:block absolute -bottom-8 -right-4 bg-white border border-zinc-200 px-4 py-2 rounded-full text-xs font-medium shadow-sm text-gray-800 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-zinc-600" />
              <span>ESC/POS Printer</span>
            </div>

          </div>

          <div className="mt-12">
            <button 
              onClick={onLoginClick}
              className="bg-gray-950 text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              Mulai Eksplorasi Demo
            </button>
          </div>
        </div>
      </div>


      {/* SECTION 5, 6 & 7: ARTICLE, STORIES & MORE TO LEARN (Panduan Integrasi & FAQ) */}
      <div className="bg-white py-24 sm:py-32 z-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">PANDUAN & TEKNIS</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-gray-950 mt-2 tracking-tight">
              Edukasi Teknis dan Artikel Praktis
            </h2>
            <p className="text-sm text-zinc-600 mt-3">
              Pelajari metode integrasi hardware, dasar protokol pengiriman data serial, dan solusi kalibrasi timbangan digital mandiri.
            </p>
          </div>

          {/* Grid articles layout from reference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
            
            {/* Section 5 (Article Left Featured): Panduan Kalibrasi Akurasi */}
            <div className="lg:col-span-6 bg-zinc-50/50 rounded-3xl border border-zinc-200/60 p-6 sm:p-8 flex flex-col justify-between min-h-[460px] shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-4 text-[11px] font-bold font-mono text-zinc-400">
                  <span>12 JULI 2026</span>
                  <span>•</span>
                  <span>4 MENIT BACA</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-normal text-gray-950 leading-snug">
                  Panduan Melakukan Kalibrasi Berat dan Mengatasi Drift Sensor Timbangan Digital Anda secara Mandiri
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Menyediakan langkah-langkah prosedural untuk memulihkan akurasi pembacaan berat pada timbangan CAS SW-1S dan sejenisnya menggunakan beban standar kalibrasi bersertifikat. Pelajari cara menyesuaikan nilai rentang kesalahan (drift) sensor sel beban untuk menjamin keabsahan transaksi dagang Anda.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-950">Baca Panduan Kalibrasi</span>
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-gray-950 hover:bg-zinc-200 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Right Column: Stack of 2 smaller articles (Sections 6 & 7 mapping) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Section 6 (Article Right 1): Protokol Data Continuous Stream */}
              <div className="bg-zinc-50/50 rounded-2xl border border-zinc-200/60 p-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-2">
                  <div className="flex gap-4 text-[10px] font-bold font-mono text-zinc-400">
                    <span>10 JULI 2026</span>
                    <span>•</span>
                    <span>3 MENIT BACA</span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-950">
                    Memahami Perbedaan Protokol Pengiriman Data CAS SW-II Continuous Stream dan Command Mode
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Eksplorasi teknis mengenai struktur string data biner serial RS-232, mencakup format pembacaan byte status kestabilan (stable/unstable) dan penanganan muatan berat bersih (net weight).
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200/40 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Buka Spesifikasi Data</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>

              {/* Section 7 (Article Right 2): Arsitektur C# WPF Windows Lokal */}
              <div className="bg-zinc-50/50 rounded-2xl border border-zinc-200/60 p-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-2">
                  <div className="flex gap-4 text-[10px] font-bold font-mono text-zinc-400">
                    <span>08 JULI 2026</span>
                    <span>•</span>
                    <span>5 MENIT BACA</span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-950">
                    Implementasi Komunikasi Serial Asynchronous Menggunakan Event-Driven WPF di Windows 11
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Panduan menyusun program C# Cerdas untuk mengatasi pemblokiran antarmuka utama (UI Thread Freeze) saat menerima data port serial berfrekuensi tinggi dari modul timbangan eksternal.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200/40 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Buka Arsitektur Kode</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>

            </div>
          </div>


          {/* SECTION 7 CONTINUATION: FREQUENTLY ASKED QUESTIONS (FAQ Accordion Style) */}
          <div className="border-t border-zinc-200/80 pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Side Info */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">PUSAT BANTUAN FAQ</span>
                  <h3 className="text-3xl font-normal text-gray-950 tracking-tight leading-tight">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
                    Temukan solusi cepat untuk berbagai pertanyaan umum mengenai konfigurasi port komunikasi serial, otentikasi hak akses, dan tata cara uji simulator.
                  </p>
                </div>
                
                <div className="mt-8 lg:mt-0">
                  <a 
                    href="https://wa.me/6285157626264"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-semibold px-5 py-3 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>Hubungi Dukungan Teknis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Side Accordions matching the exact FAQ reference style */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {/* Accordion 1 */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(0)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">
                      Bagaimana sistem kasir membaca data dari timbangan digital?
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 ml-4">
                      {activeFaq === 0 ? <Minus className="w-3 h-3 text-gray-950" /> : <Plus className="w-3 h-3 text-gray-950" />}
                    </div>
                  </button>
                  {activeFaq === 0 && (
                    <div className="p-5 pt-0 border-t border-zinc-200/60 bg-white text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      Aplikasi kasir ini memanfaatkan antarmuka komunikasi Serial Port (COM) standar Windows. Aliran data biner yang ditransmisikan secara terus menerus (continuous stream) akan ditangkap, dipotong berdasarkan karakter pembatas baris, dan diekstrak nilainya menggunakan algoritma parsing string numerik.
                    </div>
                  )}
                </div>

                {/* Accordion 2 */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(1)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">
                      Apakah aplikasi ini mendukung timbangan merk selain CAS?
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 ml-4">
                      {activeFaq === 1 ? <Minus className="w-3 h-3 text-gray-950" /> : <Plus className="w-3 h-3 text-gray-950" />}
                    </div>
                  </button>
                  {activeFaq === 1 && (
                    <div className="p-5 pt-0 border-t border-zinc-200/60 bg-white text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      Ya. Sistem ini dirancang dengan arsitektur Driver Komunikasi Fleksibel yang dapat disesuaikan untuk membaca berbagai protokol data timbangan lainnya seperti merk DIGI, Avery Berkel, Mettler Toledo, maupun timbangan kustom buatan lokal dengan mengubah aturan pemisah byte (regex pattern).
                    </div>
                  )}
                </div>

                {/* Accordion 3 */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(2)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">
                      Bagaimana cara melakukan deployment untuk sistem Windows lokal?
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 ml-4">
                      {activeFaq === 2 ? <Minus className="w-3 h-3 text-gray-950" /> : <Plus className="w-3 h-3 text-gray-950" />}
                    </div>
                  </button>
                  {activeFaq === 2 && (
                    <div className="p-5 pt-0 border-t border-zinc-200/60 bg-white text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      Anda dapat menggunakan kompilasi biner C# WPF (.NET 8) yang disertakan pada direktori kode aplikasi ini. Cukup hubungkan kabel serial RS232 timbangan ke modul USB-to-Serial PC Windows Anda, sesuaikan nomor port COM, dan biner lokal akan bekerja melayani pembacaan data secara offline tanpa gangguan.
                    </div>
                  )}
                </div>

                {/* Accordion 4 */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(3)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">
                      Apakah timbangan harus dikalibrasi secara berkala?
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 ml-4">
                      {activeFaq === 3 ? <Minus className="w-3 h-3 text-gray-950" /> : <Plus className="w-3 h-3 text-gray-950" />}
                    </div>
                  </button>
                  {activeFaq === 3 && (
                    <div className="p-5 pt-0 border-t border-zinc-200/60 bg-white text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      Ya. Kami menyarankan kalibrasi berat minimal sekali dalam enam bulan untuk mencegah penurunan akurasi yang diakibatkan oleh perubahan suhu sekitar, aus mekanis penyangga sel beban (load cell), maupun penimbunan debu pada sensor penahan timbangan.
                    </div>
                  )}
                </div>

                {/* Accordion 5 */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(4)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">
                      Bagaimana arsitektur deployment CI/CD untuk aplikasi timbangan ini di platform cloud seperti Vercel?
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 ml-4">
                      {activeFaq === 4 ? <Minus className="w-3 h-3 text-gray-950" /> : <Plus className="w-3 h-3 text-gray-950" />}
                    </div>
                  </button>
                  {activeFaq === 4 && (
                    <div className="p-5 pt-0 border-t border-zinc-200/60 bg-white text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      Aplikasi ini dirancang sebagai Single Page Application (SPA) statis yang dikompilasi menggunakan Vite bundler. Proses deployment ke Vercel diotomatisasi melalui webhooks GitHub integration. Seluruh rute client-side (SPA client routing) dikendalikan melalui berkas konfigurasi <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded font-mono">vercel.json</code> menggunakan rewrite rule <code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded font-mono">"source": "/(.*)", "destination": "/index.html"</code> untuk menghindari kendala HTTP 404 pada deep linking. Untuk menjembatani komunikasi serial dengan perangkat keras lokal di sisi klien, aplikasi memanggil Serial API bawaan peramban berbasis Chromium (Web Serial API) secara langsung tanpa membutuhkan local proxy, sehingga static host di Vercel dapat berkomunikasi secara real-time dengan latency di bawah 5ms.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>


      {/* SECTION FOOTER: MATCHING THE MINIMALIST LANDING PAGE STYLE */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-16 text-xs text-zinc-500 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1 */}
            <div className="space-y-4">
              <span className="font-bold text-gray-950 text-sm">PT. Bantu Indonesia Technology</span>
              <p className="leading-relaxed text-zinc-500">
                Solusi point-of-sale modern berkinerja tinggi dengan integrasi timbangan industri teruji untuk memastikan keamanan transaksi bisnis ritel Anda.
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-950 uppercase tracking-wider text-[10px]">Navigasi Utama</h4>
              <ul className="space-y-2.5">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-gray-950 transition-colors text-left cursor-pointer">
                    Halaman Utama
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById("fitur-timbangan")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-950 transition-colors text-left cursor-pointer">
                    Koneksi Timbangan
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById("kasir-pos")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-950 transition-colors text-left cursor-pointer">
                    Sistem Kasir
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById("arsitektur-csharp")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-950 transition-colors text-left cursor-pointer">
                    Arsitektur Kode C#
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-950 uppercase tracking-wider text-[10px]">Perangkat Keras Kompatibel</h4>
              <ul className="space-y-2">
                <li className="hover:text-gray-950 transition-colors">Timbangan CAS SW-1S</li>
                <li className="hover:text-gray-950 transition-colors">Timbangan CAS SW-II</li>
                <li className="hover:text-gray-950 transition-colors">Timbangan CAS ER-Plus</li>
                <li className="hover:text-gray-950 transition-colors">Printer POS Thermal 58mm</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-950 uppercase tracking-wider text-[10px]">Kontak Bantuan</h4>
              <ul className="space-y-2">
                <li className="hover:text-gray-950 transition-colors">PT. Bantu Indonesia Technology</li>
                <li className="hover:text-gray-950 transition-colors font-mono">support@bantu.id</li>
                <li className="hover:text-gray-950 transition-colors font-mono">+62-851-5762-6264</li>
                <li className="text-zinc-400">
                  ODK Space, Somodaran, Purwomartani, Kalasan, Sleman<br />
                  DI Yogyakarta
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-zinc-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PT. Bantu Indonesia Technology. Hak cipta dilindungi undang-undang.</p>
            <div className="flex gap-6">
              <span className="hover:text-gray-950 transition-colors cursor-pointer">Syarat Ketentuan</span>
              <span className="hover:text-gray-950 transition-colors cursor-pointer">Kebijakan Privasi</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
