import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 bg-transparent">
      {/* Logo Left */}
      <div className="flex items-center gap-2">
        <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
        <span className="font-bold text-gray-900 tracking-tight sm:text-lg">Timbangan Cerdas</span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <button className="flex items-center gap-1 text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium">
          Toolkit <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium">
          Plans
        </button>
        <button className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors font-medium">
          News
        </button>
      </div>

      {/* CTA + Hamburger Right */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onLoginClick}
          className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
        >
          Masuk POS Dashboard
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
            <button className="flex items-center justify-between py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left">
              <span>Toolkit</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left">
              Plans
            </button>
            <button className="py-3 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100 font-medium text-left">
              News
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                onLoginClick();
              }}
              className="mt-3 w-full bg-gray-900 text-white text-[15px] font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-center"
            >
              Masuk POS Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
