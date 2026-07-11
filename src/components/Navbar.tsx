import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 bg-transparent">
      {/* Logo Left */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
        <span className="font-bold text-gray-900 tracking-tight sm:text-lg">Timbangan Cerdas</span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => scrollToSection("fitur-timbangan")}
          className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          Koneksi Timbangan
        </button>
        <button 
          onClick={() => scrollToSection("kasir-pos")}
          className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          Sistem Kasir
        </button>
        <button 
          onClick={() => scrollToSection("manajemen-produk")}
          className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          Manajemen Produk
        </button>
        <button 
          onClick={() => scrollToSection("hak-akses")}
          className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          Keamanan Akun
        </button>
        <button 
          onClick={() => scrollToSection("arsitektur-csharp")}
          className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          Spesifikasi Kode
        </button>
      </div>

      {/* CTA + Hamburger Right */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onLoginClick}
          className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
        >
          Masuk
        </button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-900 hover:bg-gray-900/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up z-30 shadow-lg">
          <div className="flex flex-col">
            <button 
              onClick={() => scrollToSection("fitur-timbangan")}
              className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left"
            >
              Koneksi Timbangan
            </button>
            <button 
              onClick={() => scrollToSection("kasir-pos")}
              className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left"
            >
              Sistem Kasir
            </button>
            <button 
              onClick={() => scrollToSection("manajemen-produk")}
              className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left"
            >
              Manajemen Produk
            </button>
            <button 
              onClick={() => scrollToSection("hak-akses")}
              className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left"
            >
              Keamanan Akun
            </button>
            <button 
              onClick={() => scrollToSection("arsitektur-csharp")}
              className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left"
            >
              Spesifikasi Kode
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                onLoginClick();
              }}
              className="mt-3 w-full bg-gray-900 text-white text-[15px] font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-center"
            >
              Masuk
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
