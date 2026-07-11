import React, { useState, useEffect, useRef } from "react";
import { 
  PanelLeft, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  RotateCw, 
  Share, 
  Plus, 
  Copy, 
  Compass, 
  Layers, 
  ListTodo, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  HelpCircle,
  Clock,
  BookOpen,
  FileText
} from "lucide-react";
import Logo from "./Logo";

// ScaledDashboard wrapper using ResizeObserver as requested
export function ScaledDashboard({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.getBoundingClientRect().width || container.clientWidth;
      const designWidth = 896; // Fixed design width
      const nextScale = containerWidth / designWidth;
      setScale(nextScale);

      if (innerRef.current) {
        const innerHeight = innerRef.current.offsetHeight;
        setHeight(innerHeight * nextScale);
      }
    };

    // Initial calculation
    updateScale();

    // ResizeObserver
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    observer.observe(container);

    // Keep updating as assets load
    const interval = setInterval(updateScale, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ height: height > 0 ? `${height}px` : "auto" }} 
      className="relative w-full overflow-hidden transition-[height] duration-200"
    >
      <div 
        ref={innerRef} 
        style={{ 
          width: "896px", 
          transform: `scale(${scale})`, 
          transformOrigin: "top left" 
        }} 
        className="absolute top-0 left-0"
      >
        {children}
      </div>
    </div>
  );
}

export default function DashboardMockup() {
  return (
    <ScaledDashboard>
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left font-sans">
        {/* Title Bar / Chrome Header */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
          {/* Traffic Lights + Navigation Icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <PanelLeft className="w-3.5 h-3.5 text-white/40 hover:text-white/70 cursor-pointer" />
              <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            </div>
          </div>

          {/* URL Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 flex items-center justify-center gap-1.5 ring-1 ring-white/5">
              <Monitor className="w-3 h-3 text-white/30" />
              <span>dashboard.timbangancerdas.ai</span>
            </div>
          </div>

          {/* Right Chrome Icons */}
          <div className="flex items-center gap-3">
            <RotateCw className="w-3.5 h-3.5 text-white/40 hover:text-white" />
            <Share className="w-3.5 h-3.5 text-white/40 hover:text-white" />
            <Plus className="w-3.5 h-3.5 text-white/40 hover:text-white" />
            <Copy className="w-3.5 h-3.5 text-white/40 hover:text-white" />
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex min-h-[460px] bg-[#1a1a1c]">
          
          {/* Sidebar (22% width) */}
          <aside className="w-[22%] shrink-0 border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Logo icon + Grid */}
              <div className="flex items-center justify-between px-1">
                <Logo className="w-4 h-4 text-white/70" />
                <span className="text-[10px] font-semibold text-white/70 tracking-wide uppercase">Timbangan</span>
              </div>

              {/* Workspace Badge */}
              <div className="flex items-center gap-2 bg-white/[0.04] ring-1 ring-white/10 rounded-lg p-1.5">
                <div className="w-4 h-4 rounded bg-[#e8553f] flex items-center justify-center text-[9px] font-extrabold text-white">
                  T
                </div>
                <span className="text-[10px] font-medium text-white/80 truncate">Timbangan POS</span>
              </div>

              {/* Nav Items */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/[0.05] text-white cursor-pointer">
                  <Compass className="w-3.5 h-3.5 text-[#e8553f]" />
                  <span className="text-[10px] font-medium">Transaksi POS</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-white/60 hover:text-white hover:bg-white/[0.02] rounded cursor-pointer transition-all">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">Kelola Produk</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-white/60 hover:text-white hover:bg-white/[0.02] rounded cursor-pointer transition-all">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">Riwayat Audit</span>
                </div>
              </div>

              {/* Recent Articles list with green ready dots */}
              <div className="pt-2">
                <span className="text-[8px] font-bold text-white/30 tracking-wider uppercase px-2">Sistem Timbangan</span>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-white/70 hover:text-white cursor-pointer truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                    <span className="truncate">CAS SW-1S (COM3)</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-white/70 hover:text-white cursor-pointer truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                    <span className="truncate">Ranger 3000 (COM2)</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-white/70 hover:text-white cursor-pointer truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 shrink-0" />
                    <span className="truncate">Gedge (COM1)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-white/40 px-1 text-[9px]">
              <span className="truncate">v3.4.0 • Live Scale COM</span>
              <HelpCircle className="w-3 h-3 shrink-0" />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#e8553f] flex items-center justify-center text-sm font-black text-white">
                  TC
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Timbangan Cerdas</h2>
                  <p className="text-[10px] text-white/45">Dashboard Manajemen POS & Timbangan Real-time</p>
                </div>
              </div>

              <button className="flex items-center gap-1.5 bg-[#e8553f] hover:bg-[#d64a35] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-md transition-colors shadow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulasi Timbang Baru</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 p-3">
              <div className="pl-1">
                <div className="text-xl font-medium text-white">184</div>
                <div className="text-[8px] tracking-wider text-white/35 font-mono uppercase mt-0.5">Nota Penjualan</div>
              </div>
              <div className="pl-3">
                <div className="text-xl font-medium text-white">8</div>
                <div className="text-[8px] tracking-wider text-white/35 font-mono uppercase mt-0.5">Varian Produk</div>
              </div>
              <div className="pl-3">
                <div className="text-xl font-medium text-white">412</div>
                <div className="text-[8px] tracking-wider text-white/35 font-mono uppercase mt-0.5">Item Terjual (Kg)</div>
              </div>
              <div className="pl-3">
                <div className="text-xl font-medium text-white">Rp3.156.200</div>
                <div className="text-[8px] tracking-wider text-white/35 font-mono uppercase mt-0.5">Total Omset</div>
              </div>
            </div>

            {/* Subject Cards (3 columns) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-white/30 tracking-wider uppercase">Monitor Timbangan Terpopuler</span>
              <div className="grid grid-cols-3 gap-3">
                {/* Elder Care */}
                <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-2.5 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-white/90">Apel Fuji Super</span>
                    <span className="text-[9px] bg-[#e8553f]/10 text-[#e8553f] px-1 rounded">Buah</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white/50 text-[10px]">Harga per Kg: Rp45.000</div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-white/30">
                    <span>Stok: 120.5 Kg</span>
                    <TrendingUp className="w-2.5 h-2.5 text-[#28c840]" />
                  </div>
                </div>

                {/* Mobility */}
                <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-2.5 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-white/90">Mangga Harum Manis</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded">Buah</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white/50 text-[10px]">Harga per Kg: Rp35.000</div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-white/30">
                    <span>Stok: 80.0 Kg</span>
                    <TrendingUp className="w-2.5 h-2.5 text-[#28c840]" />
                  </div>
                </div>

                {/* Home Safety */}
                <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-2.5 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-white/90">Daging Sapi Sirloin</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded">Daging</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white/50 text-[10px]">Harga per Kg: Rp135.000</div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-white/30">
                    <span>Stok: 25.4 Kg</span>
                    <TrendingUp className="w-2.5 h-2.5 text-[#28c840]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Drafting Inbox Table */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-white/30 tracking-wider uppercase">Arus Transaksi Terkini</span>
              <div className="overflow-x-auto ring-1 ring-white/5 rounded-xl bg-white/[0.01]">
                <table className="w-full text-left text-[10px] text-white/70">
                  <thead className="bg-white/[0.03] text-white/40 uppercase tracking-wider text-[8px] font-semibold border-b border-white/5">
                    <tr>
                      <th className="px-3 py-2">Nama Barang / SKU</th>
                      <th className="px-3 py-2 text-right">Berat / Qty</th>
                      <th className="px-3 py-2 text-center">Metode</th>
                      <th className="px-3 py-2 text-right">Status Nota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-3 py-2 font-medium text-white">Apel Fuji Super (BRG-001)</td>
                      <td className="px-3 py-2 text-right font-mono">1.50 Kg</td>
                      <td className="px-3 py-2 text-center font-mono">Otomatis</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-medium">Lunas</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-white">Mangga Harum Manis (BRG-002)</td>
                      <td className="px-3 py-2 text-right font-mono">1.25 Kg</td>
                      <td className="px-3 py-2 text-center font-mono">Otomatis</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-medium">Lunas</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-white">Wortel Organik Lokal (BRG-003)</td>
                      <td className="px-3 py-2 text-right font-mono">0.85 Kg</td>
                      <td className="px-3 py-2 text-center font-mono">Otomatis</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-medium">Lunas</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-white">Bayam Segar Ikat (BRG-004)</td>
                      <td className="px-3 py-2 text-right font-mono">2 Ikat</td>
                      <td className="px-3 py-2 text-center font-mono">POS Manual</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-medium">Lunas</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-white">Daging Sapi Sirloin (BRG-005)</td>
                      <td className="px-3 py-2 text-right font-mono">2.54 Kg</td>
                      <td className="px-3 py-2 text-center font-mono">Otomatis</td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-medium">Lunas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>
      </div>
    </ScaledDashboard>
  );
}
