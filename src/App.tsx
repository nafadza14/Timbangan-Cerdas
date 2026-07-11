import React, { useState, useEffect, useRef } from "react";
import { 
  Scale, 
  ShoppingCart, 
  Settings, 
  Database, 
  ShieldAlert, 
  LogOut, 
  User as UserIcon, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Printer, 
  Search, 
  Activity, 
  Code, 
  FileCode, 
  CornerDownRight, 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Download, 
  Lock,
  Package,
  ChevronRight,
  Eye,
  X,
  Play,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  Product, 
  Transaction, 
  TransactionItem, 
  User, 
  ScaleConfig, 
  AuditLog, 
  ScaleConnectionState, 
  WeightStatus, 
  WeightType, 
  WeightReading,
  PaymentMethod
} from "./types";
import { dbStore } from "./data";
import { csharpFiles } from "./csharpFiles";
import Hero from "./components/Hero";
import Logo from "./components/Logo";

export default function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  // Database States (loaded from persistent localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [scaleConfig, setScaleConfig] = useState<ScaleConfig | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation (Views: "KASIR" | "PRODUK" | "PENGGUNA" | "PENGATURAN" | "LAPORAN" | "CSHARP")
  const [currentView, setCurrentView] = useState<string>("KASIR");

  // Load database tables on mount
  useEffect(() => {
    setProducts(dbStore.getProducts());
    setUsers(dbStore.getUsers());
    setTransactions(dbStore.getTransactions());
    setScaleConfig(dbStore.getScaleConfig());
    setAuditLogs(dbStore.getAuditLogs());

    // Auto log-in admin for a smooth initial preview experience, but fully support logout/login!
    const defaultUsers = dbStore.getUsers();
    const adminUser = defaultUsers.find(u => u.username === "admin") || defaultUsers[0];
    setCurrentUser(adminUser);
  }, []);

  // Update localStorage when database state changes
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    dbStore.setProducts(newProducts);
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    dbStore.setUsers(newUsers);
  };

  const updateScaleConfig = (newConfig: ScaleConfig) => {
    setScaleConfig(newConfig);
    dbStore.setScaleConfig(newConfig);
  };

  const updateTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    dbStore.setTransactions(newTransactions);
  };

  const addLog = (actionType: AuditLog["actionType"], description: string) => {
    dbStore.addAuditLog(currentUser?.id || null, currentUser?.username || null, actionType, description);
    setAuditLogs(dbStore.getAuditLogs());
  };

  // --- SCALE SIMULATOR STATE ---
  const [scaleWeight, setScaleWeight] = useState<number>(1.250); // in kg
  const [scaleStatus, setScaleStatus] = useState<WeightStatus>("Stable");
  const [scaleType, setScaleType] = useState<WeightType>("Gross");
  const [isScaleNegative, setIsScaleNegative] = useState<boolean>(false);
  const [scaleConnection, setScaleConnection] = useState<ScaleConnectionState>("Connected");
  const [scaleRawStream, setScaleRawStream] = useState<string>("");
  const [autoReconnectTimer, setAutoReconnectTimer] = useState<boolean>(false);

  // Generate simulated raw serial stream matching CAS SW-II protocol: "ST,GS,+   1.250kg\r\n"
  useEffect(() => {
    if (scaleConnection !== "Connected") {
      setScaleRawStream("--- PORT CLOSED / NO STREAM ---");
      return;
    }
    const statusStr = scaleStatus === "Stable" ? "ST" : "US";
    const typeStr = scaleType === "Gross" ? "GS" : "NT";
    const signStr = isScaleNegative ? "-" : "+";
    const weightVal = scaleWeight.toFixed(3).padStart(8, " ");
    const raw = `${statusStr},${typeStr},${signStr}${weightVal}kg\\r\\n`;
    setScaleRawStream(raw);
  }, [scaleWeight, scaleStatus, scaleType, isScaleNegative, scaleConnection]);

  // Handle simulated cable disconnection and auto-reconnection <= 5 seconds (BR-08)
  const toggleScaleCable = () => {
    if (scaleConnection === "Connected") {
      setScaleConnection("Error");
      addLog("SCALE_CONFIG_UPDATE", "Koneksi serial terputus secara tidak terduga (simulasi kabel lepas).");
      
      // Auto-reconnect after 3 seconds (cable_reconnect)
      setAutoReconnectTimer(true);
      setTimeout(() => {
        setScaleConnection("Connected");
        setAutoReconnectTimer(false);
        addLog("SCALE_CONFIG_UPDATE", "Timbangan otomatis tersambung kembali (auto-reconnect berhasil).");
      }, 3000);
    } else {
      setScaleConnection("Connected");
      addLog("SCALE_CONFIG_UPDATE", "Timbangan tersambung secara manual.");
    }
  };

  // --- ACTIVE KASIR CART STATE ---
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [manualWeightInput, setManualWeightInput] = useState<string>("");
  const [useManualWeight, setUseManualWeight] = useState<boolean>(false);
  const [unitQuantity, setUnitQuantity] = useState<number>(1);
  const [productSearch, setProductSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Semua");

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [testMessage, setTestMessage] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("dashboard_theme") as "light" | "dark";
    return savedTheme || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("dashboard_theme", nextTheme);
  };

  // Math rounding based on BR-04 (round weight * unit price to nearest Rupiah)
  const calculateSubtotal = (product: Product, weight: number | null, qty: number | null): number => {
    if (product.isWeighable && weight !== null) {
      return Math.round(weight * product.pricePerKg);
    } else if (!product.isWeighable && qty !== null) {
      return Math.round(qty * product.pricePerKg);
    }
    return 0;
  };

  // Add Item to Cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    let finalWeight: number | null = null;
    let finalQty: number | null = null;
    let isManual = false;

    if (selectedProduct.isWeighable) {
      if (useManualWeight) {
        // Fallback input berat manual (BR-06)
        const weight = parseFloat(manualWeightInput);
        if (isNaN(weight) || weight <= 0 || weight > 30.0) {
          alert("Input berat manual tidak valid! Harus > 0 kg dan <= 30.0 kg.");
          return;
        }
        finalWeight = weight;
        isManual = true;
      } else {
        // Live Scale connection check
        if (scaleConnection !== "Connected") {
          alert("Timbangan tidak terhubung! Silakan aktifkan input berat manual.");
          return;
        }
        // BR-01: Hanya berat Stabil yang boleh dicatat
        if (scaleStatus !== "Stable") {
          alert("Berat timbangan belum stabil! Tunggu hingga indikator berwarna hijau.");
          return;
        }
        // BR-02: Berat valid: > 0 dan <= kapasitas (30 kg)
        if (scaleWeight <= 0 || scaleWeight > 30.0) {
          alert("Berat timbangan di luar rentang valid (0 - 30kg)!");
          return;
        }
        finalWeight = scaleWeight;
      }
    } else {
      if (unitQuantity <= 0) {
        alert("Jumlah barang harus lebih dari 0!");
        return;
      }
      finalQty = unitQuantity;
    }

    const subtotal = calculateSubtotal(selectedProduct, finalWeight, finalQty);

    const newItem: TransactionItem = {
      id: cart.length + 1,
      productId: selectedProduct.id,
      productNameSnapshot: selectedProduct.name,
      weightKg: finalWeight,
      quantity: finalQty,
      unitPrice: selectedProduct.pricePerKg, // Snapshot price BR-03
      subtotal,
      isManualWeight: isManual
    };

    setCart([...cart, newItem]);
    
    if (isManual) {
      addLog("MANUAL_WEIGHT", `Input berat manual untuk ${selectedProduct.name}: ${finalWeight?.toFixed(3)} kg (Oleh ${currentUser?.username})`);
    }

    // Reset inputs
    setSelectedProduct(null);
    setManualWeightInput("");
    setUnitQuantity(1);
    setUseManualWeight(false);
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getCartTotal = (): number => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Checkout process (atomic local db writing BR-07 & ADR-05)
  const handleCheckout = () => {
    const total = getCartTotal();
    if (paidAmount < total) {
      alert("Nominal pembayaran kurang!");
      return;
    }

    // BR-07: TRX-YYYYMMDD-####
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}${mm}${dd}`;

    const todayTrx = transactions.filter(t => t.transactionCode.startsWith(`TRX-${dateStr}`));
    const seq = String(todayTrx.length + 1).padStart(4, "0");
    const trxCode = `TRX-${dateStr}-${seq}`;

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      transactionCode: trxCode,
      transactionDate: today.toISOString(),
      totalAmount: total,
      paidAmount,
      changeAmount: paidAmount - total, // BR-08
      paymentMethod,
      cashierUserId: currentUser?.id || 1,
      cashierName: currentUser?.fullName || "Kasir",
      status: "COMPLETED",
      items: [...cart],
      createdAt: today.toISOString()
    };

    // Update stocks (basic management P1)
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.productId === p.id);
      if (cartItem && p.stockQty !== null) {
        const deduct = cartItem.weightKg ?? cartItem.quantity ?? 0;
        return {
          ...p,
          stockQty: Math.max(0, p.stockQty - deduct),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    updateProducts(updatedProducts);
    const newTransactionsList = [newTransaction, ...transactions];
    updateTransactions(newTransactionsList);
    addLog("VOID_TRANSACTION", `Transaksi berhasil diselesaikan dengan Kode: ${trxCode}. Total: Rp ${total.toLocaleString("id-ID")}`);

    // Show thermal receipt
    setReceiptTransaction(newTransaction);
    setShowPaymentModal(false);
    setCart([]); // Reset Cart
  };

  // Void transaction (ADMIN only)
  const handleVoidTransaction = (trxId: number) => {
    if (currentUser?.role !== "ADMIN") {
      alert("Hanya Admin yang diizinkan untuk membatalkan (void) transaksi!");
      return;
    }

    const reason = prompt("Masukkan alasan pembatalan transaksi:");
    if (!reason || reason.trim() === "") {
      alert("Alasan void harus diisi!");
      return;
    }

    const updatedTransactions = transactions.map(t => {
      if (t.id === trxId) {
        return { ...t, status: "VOIDED" as const };
      }
      return t;
    });

    updateTransactions(updatedTransactions);
    const code = transactions.find(t => t.id === trxId)?.transactionCode || "";
    addLog("VOID_TRANSACTION", `Pembatalan (VOID) transaksi ${code} disetujui. Alasan: ${reason} (Oleh Admin: ${currentUser.username})`);
    alert(`Transaksi ${code} berhasil di-void!`);
  };

  // --- CRUD MANAGERS ---
  
  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodSKU, setProdSKU] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Buah");
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodIsWeighable, setProdIsWeighable] = useState(true);
  const [prodStock, setProdStock] = useState<string>("");

  const handleOpenProductModal = (p: Product | null) => {
    if (p) {
      setEditingProduct(p);
      setProdSKU(p.sku);
      setProdName(p.name);
      setProdCategory(p.category);
      setProdPrice(p.pricePerKg);
      setProdIsWeighable(p.isWeighable);
      setProdStock(p.stockQty !== null ? String(p.stockQty) : "");
    } else {
      setEditingProduct(null);
      // Auto sku
      const nextId = products.length > 0 ? Math.max(...products.map(pr => pr.id)) + 1 : 1;
      setProdSKU(`BRG-${String(nextId).padStart(3, "0")}`);
      setProdName("");
      setProdCategory("Buah");
      setProdPrice(0);
      setProdIsWeighable(true);
      setProdStock("");
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!prodName.trim() || prodPrice <= 0) {
      alert("Nama produk dan harga per Kg harus valid!");
      return;
    }

    const parsedStock = prodStock.trim() !== "" ? parseFloat(prodStock) : null;

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            sku: prodSKU,
            name: prodName,
            category: prodCategory,
            pricePerKg: prodPrice,
            isWeighable: prodIsWeighable,
            stockQty: parsedStock,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      updateProducts(updated);
      addLog("PRODUCT_UPDATE", `Mengubah data produk: ${prodName} (SKU: ${prodSKU})`);
    } else {
      const nextId = products.length > 0 ? Math.max(...products.map(pr => pr.id)) + 1 : 1;
      const newProd: Product = {
        id: nextId,
        sku: prodSKU,
        name: prodName,
        category: prodCategory,
        pricePerKg: prodPrice,
        isWeighable: prodIsWeighable,
        stockQty: parsedStock,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updateProducts([...products, newProd]);
      addLog("PRODUCT_CREATE", `Menambahkan produk baru: ${prodName} (SKU: ${prodSKU})`);
    }
    setShowProductModal(false);
  };

  const handleToggleProductActive = (id: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextState = !p.isActive;
        addLog("PRODUCT_UPDATE", `${nextState ? "Mengaktifkan" : "Menonaktifkan"} produk: ${p.name}`);
        return { ...p, isActive: nextState, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    updateProducts(updated);
  };

  // User Form State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userUsername, setUserUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userRole, setUserRole] = useState<"ADMIN" | "KASIR">("KASIR");

  const handleCreateUser = () => {
    if (!userUsername.trim() || !userFullName.trim()) {
      alert("Username dan nama lengkap harus diisi!");
      return;
    }

    if (users.some(u => u.username.toLowerCase() === userUsername.trim().toLowerCase())) {
      alert("Username sudah digunakan!");
      return;
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextId,
      username: userUsername.trim().toLowerCase(),
      fullName: userFullName.trim(),
      role: userRole,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    updateUsers([...users, newUser]);
    addLog("USER_CREATE", `Menambahkan pengguna baru: ${newUser.fullName} (${newUser.role})`);
    setShowUserModal(false);
    setUserUsername("");
    setUserFullName("");
  };

  // Scale Settings Form
  const [brandKey, setBrandKey] = useState<"CAS_SW" | "DIGI_SM">("CAS_SW");
  const [portName, setPortName] = useState("COM3");
  const [baudRate, setBaudRate] = useState(9600);
  const [transmissionMode, setTransmissionMode] = useState<"Continuous" | "OnDemand">("Continuous");

  const handleSaveScaleSettings = () => {
    if (!scaleConfig) return;
    const newConfig: ScaleConfig = {
      ...scaleConfig,
      brandKey,
      portName,
      baudRate,
      transmissionMode
    };
    updateScaleConfig(newConfig);
    addLog("SCALE_CONFIG_UPDATE", `Mengubah konfigurasi timbangan: ${brandKey} di ${portName}`);
    alert("Konfigurasi timbangan berhasil disimpan!");
  };

  // --- AUTHENTICATION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase() && u.isActive);
    if (user) {
      // In a real WPF app we would hash verify via BCrypt. Here we simulate successful matching for simplified local demo.
      setCurrentUser(user);
      setUsernameInput("");
      setPasswordInput("");
      setAuthError("");
      setShowLandingPage(false);
      addLog("LOGIN", `Pengguna ${user.fullName} berhasil masuk.`);
    } else {
      setAuthError("Username salah atau akun tidak aktif!");
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog("LOGOUT", `Pengguna ${currentUser.fullName} keluar.`);
    }
    setCurrentUser(null);
    setCurrentView("KASIR");
    setShowLandingPage(true);
  };

  // --- C# CODE EXPLORER STATE ---
  const [selectedProject, setSelectedProject] = useState<string>("TimbanganCerdas.Core");
  const [selectedFile, setSelectedFile] = useState<typeof csharpFiles[0]>(csharpFiles[0]);

  useEffect(() => {
    // Filter files for project and pick the first
    const projectFiles = csharpFiles.filter(f => f.project === selectedProject);
    if (projectFiles.length > 0) {
      setSelectedFile(projectFiles[0]);
    }
  }, [selectedProject]);


  // Filter products for POS
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = categoryFilter === "Semua" || p.category === categoryFilter;
    return matchSearch && matchCategory && p.isActive;
  });

  if (showLandingPage) {
    return (
      <Hero 
        onLoginClick={() => {
          setShowLandingPage(false);
        }} 
      />
    );
  }

  return (
    <div id="app_root" className={`min-h-screen bg-[#1a1a1c] text-slate-200 flex flex-col font-sans selection:bg-[#e8553f] selection:text-white ${theme}`}>
      {/* HEADER BAR */}
      <header id="app_header" className="bg-[#1e1e21] border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#e8553f]/10 border border-[#e8553f]/20 rounded-xl shadow-md">
            <Logo className="w-6 h-6 text-[#e8553f]" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">TIMBANGAN CERDAS</h1>
            <p className="text-xs text-white/40 font-mono">POS + Real-Time Digital Scale Integration • .NET 8 WPF MVP</p>
          </div>
        </div>

        {/* LOGGED IN USER BAR */}
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-[#161618] border border-white/5 py-1.5 px-3 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-white/40">POS PC #01</span>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs font-medium text-slate-200">{currentUser.fullName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  currentUser.role === "ADMIN" ? "bg-[#e8553f]/10 text-[#e8553f] border border-[#e8553f]/20" : "bg-white/10 text-white/80 border border-white/10"
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 bg-[#161618] hover:bg-white/[0.04] border border-white/5 text-white/40 hover:text-white rounded-xl transition duration-200"
              title={theme === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            <button 
              onClick={handleLogout}
              className="p-2 bg-[#161618] hover:bg-red-950/30 border border-white/5 hover:border-red-900/50 text-white/40 hover:text-red-400 rounded-xl transition duration-200"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* LOGIN OR FULL INTERACTIVE INTERFACE */}
      {!currentUser ? (
        <div id="login_screen" className="flex-1 flex items-center justify-center p-6 bg-[#1a1a1c] relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#e8553f]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#e8553f]/5 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-[#1e1e21] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Window controls (traffic lights) */}
            <div className="flex gap-1.5 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-[#e8553f]/10 border border-[#e8553f]/20 rounded-2xl mb-3">
                <Logo className="w-8 h-8 text-[#e8553f]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Masuk ke Sistem</h2>
              <p className="text-sm text-white/60 mt-1">Gunakan akun kredensial kasir atau admin Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin / kasir1 / kasir2"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f] font-mono transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f] font-mono transition duration-200"
                  required
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-[#e8553f] hover:bg-[#d64a35] text-white font-medium text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#e8553f]/20 active:translate-y-px transition duration-200"
              >
                Masuk Sistem
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-white/30 font-mono">
              <p>Default Demo Accounts:</p>
              <div className="flex justify-center gap-3 mt-1.5 text-[11px] text-white/50">
                <span>admin / admin</span>
                <span>•</span>
                <span>kasir1 / kasir1</span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div id="app_workspace" className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-64 bg-[#1e1e21] border-r border-white/5 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3">Main Workspace</span>
                <nav className="mt-2 space-y-1">
                  <button 
                    onClick={() => setCurrentView("KASIR")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                      currentView === "KASIR" 
                        ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Layar Kasir POS</span>
                  </button>

                  <button 
                    onClick={() => setCurrentView("CSHARP")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                      currentView === "CSHARP" 
                        ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span className="flex items-center gap-1.5">
                      C# Code Explorer
                      <span className="bg-emerald-500 text-black font-extrabold text-[9px] px-1 py-0.2 rounded-full">NEW</span>
                    </span>
                  </button>
                </nav>
              </div>

              {currentUser.role === "ADMIN" && (
                <div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3">Administrasi (Admin)</span>
                  <nav className="mt-2 space-y-1">
                    <button 
                      onClick={() => setCurrentView("PRODUK")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                        currentView === "PRODUK" 
                          ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>Kelola Produk</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView("PENGGUNA")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                        currentView === "PENGGUNA" 
                          ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Kelola Kasir & User</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView("PENGATURAN")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                        currentView === "PENGATURAN" 
                          ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Pengaturan Serial</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView("LAPORAN")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                        currentView === "LAPORAN" 
                          ? "bg-[#e8553f] text-white shadow-lg shadow-[#e8553f]/25" 
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Laporan & Log Audit</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* LIVE HARDWARE SIMULATOR CONTROLLER (Attached to sidebar) */}
            <div className="bg-[#161618] border border-white/5 p-4.5 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#e8553f] shrink-0" />
                  Hardware Simulator
                </span>
                <span className={`w-2 h-2 rounded-full ${scaleConnection === "Connected" ? "bg-emerald-500" : "bg-red-500"}`}></span>
              </div>

              {/* Slider for simulated weight */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Berat Timbangan:</span>
                  <span className="text-white font-bold">{scaleWeight.toFixed(3)} kg</span>
                </div>
                <input 
                  type="range" 
                  min="0.000" 
                  max="20.000" 
                  step="0.005"
                  value={scaleWeight}
                  onChange={(e) => setScaleWeight(parseFloat(e.target.value))}
                  disabled={scaleConnection !== "Connected"}
                  className="w-full accent-[#e8553f] h-1 bg-[#101012] rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              {/* Status checkboxes */}
              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={() => setScaleStatus(scaleStatus === "Stable" ? "Unstable" : "Stable")}
                  disabled={scaleConnection !== "Connected"}
                  className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded-lg border text-center transition duration-150 ${
                    scaleStatus === "Stable"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                      : "bg-amber-950/40 text-amber-400 border-amber-800/50 animate-pulse"
                  }`}
                >
                  {scaleStatus === "Stable" ? "ST (Stable)" : "US (Unstable)"}
                </button>

                <button
                  onClick={() => setIsScaleNegative(!isScaleNegative)}
                  disabled={scaleConnection !== "Connected"}
                  className={`text-[10px] font-bold py-1 px-2 rounded-lg border text-center transition duration-150 ${
                    isScaleNegative 
                      ? "bg-red-950/40 text-red-400 border-red-800/50" 
                      : "bg-[#101012] text-slate-400 border-white/5"
                  }`}
                >
                  +/-
                </button>
              </div>

              {/* Connect/Disconnect simulated cable */}
              <button
                onClick={toggleScaleCable}
                className={`w-full text-xs font-semibold py-1.5 px-3 rounded-xl border text-center transition duration-200 ${
                  scaleConnection === "Connected"
                    ? "bg-[#101012] hover:bg-red-950/30 hover:border-red-900/50 hover:text-red-400 text-slate-300 border-white/5"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
                }`}
              >
                {autoReconnectTimer ? (
                  <span className="flex items-center justify-center gap-1 text-[11px]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Auto-Reconnect (3s)
                  </span>
                ) : (
                  scaleConnection === "Connected" ? "Lepas Kabel Serial (Simulate Error)" : "Sambungkan Kabel"
                )}
              </button>

              {/* Output Raw ASCII format */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Stream Port Serial (CAS format)</span>
                <div className="bg-[#101012] rounded-lg p-1.5 font-mono text-[10px] text-[#e8553f] border border-white/5 overflow-x-auto whitespace-nowrap">
                  {scaleRawStream}
                </div>
              </div>
            </div>
          </aside>

          {/* WORKSPACE AREA */}
          <main className="flex-1 overflow-y-auto flex flex-col p-6">
            {/* MOBILE NAVIGATION INDICATOR */}
            <div className="md:hidden mb-4 flex flex-wrap gap-2">
              <button onClick={() => setCurrentView("KASIR")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "KASIR" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>Kasir</button>
              <button onClick={() => setCurrentView("CSHARP")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "CSHARP" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>C# Code</button>
              {currentUser.role === "ADMIN" && (
                <>
                  <button onClick={() => setCurrentView("PRODUK")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "PRODUK" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>Produk</button>
                  <button onClick={() => setCurrentView("PENGGUNA")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "PENGGUNA" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>User</button>
                  <button onClick={() => setCurrentView("PENGATURAN")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "PENGATURAN" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>Serial</button>
                  <button onClick={() => setCurrentView("LAPORAN")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentView === "LAPORAN" ? "bg-[#e8553f] text-white" : "bg-[#1e1e21] text-white/60 hover:text-white"}`}>Laporan</button>
                </>
              )}
            </div>

            {/* ERROR BANNER FOR DISCONNECTED SCALE (cable_disconnected_runtime) */}
            {scaleConnection !== "Connected" && (
              <div className="mb-4 bg-red-950/40 border border-red-900/50 p-4 rounded-2xl flex items-center gap-3.5 shadow-md">
                <div className="p-2 bg-red-500/10 rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-300">Timbangan Digital Terputus!</h4>
                  <p className="text-xs text-red-400/90 mt-0.5">Sistem mendeteksi kegagalan koneksi serial port {scaleConfig?.portName || "COM3"}. Input berat manual diaktifkan secara otomatis (BR-06).</p>
                </div>
              </div>
            )}

            {/* LAYOUTS SWITCHER */}
            {currentView === "KASIR" && (
              <div id="view_kasir" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
                {/* LEFT: PRODUCTS LIST & SELECTION */}
                <div className="lg:col-span-7 space-y-6">
                  {/* SEARCH & FILTERS BAR */}
                  <div className="bg-[#1e1e21] border border-white/5 p-4 rounded-2xl space-y-3.5 shadow-md">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="text"
                        placeholder="Cari produk berdasarkan nama atau SKU..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full bg-[#161618] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f] transition duration-200"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                      {["Semua", "Buah", "Sayur", "Daging"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                            categoryFilter === cat 
                              ? "bg-[#e8553f] text-white" 
                              : "bg-[#161618] text-white/60 border border-white/5 hover:bg-[#1c1c1e] hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCTS BENTO GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProducts.map(prod => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setSelectedProduct(prod);
                          setUseManualWeight(false);
                          setUnitQuantity(1);
                        }}
                        className={`text-left p-4 rounded-2xl border transition duration-200 relative overflow-hidden flex flex-col justify-between h-36 ${
                          selectedProduct?.id === prod.id 
                            ? "bg-[#e8553f]/10 border-[#e8553f] shadow-md shadow-[#e8553f]/10" 
                            : "bg-[#1e1e21] hover:bg-[#242427] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#e8553f]/10 to-transparent rounded-bl-full pointer-events-none"></div>
                        
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{prod.sku}</span>
                          <h4 className="font-bold text-sm text-white tracking-tight mt-1 line-clamp-2">{prod.name}</h4>
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">{prod.isWeighable ? "Per Kg" : "Per Unit"}</span>
                            <span className="text-sm font-extrabold text-[#e8553f] font-mono">Rp {prod.pricePerKg.toLocaleString("id-ID")}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${prod.isWeighable ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                            {prod.isWeighable ? "TIMBANG" : "SATUAN"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RIGHT: WEIGHING PANEL & ACTIVE BASKET */}
                <div className="lg:col-span-5 space-y-6">
                  {/* active weighing console */}
                  {selectedProduct ? (
                    <div className="bg-[#1e1e21] border border-[#e8553f]/25 p-6 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8553f]"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-[#e8553f] uppercase tracking-widest">PRODUK YANG DIPILIH</span>
                          <h3 className="font-bold text-base text-white tracking-tight">{selectedProduct.name}</h3>
                        </div>
                        <button 
                          onClick={() => setSelectedProduct(null)}
                          className="p-1.5 bg-[#161618] border border-white/5 text-slate-400 hover:text-white rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* CONDITIONAL PANEL: WEIGHABLE VS UNIT-ITEM */}
                      {selectedProduct.isWeighable ? (
                        <div className="space-y-4">
                          {/* Live Scale Indicator Panel (weight_panel) */}
                          {!useManualWeight ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                <span>Timbangan Live ({scaleConfig?.brandKey || "CAS"})</span>
                                <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${
                                  scaleConnection !== "Connected" 
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                    : scaleStatus === "Stable" 
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                                      : "bg-amber-500/15 text-amber-400 border border-amber-500/25 animate-pulse"
                                }`}>
                                  {scaleConnection !== "Connected" ? "OFFLINE" : scaleStatus === "Stable" ? "STABIL (SIAP)" : "BELUM STABIL"}
                                </span>
                              </div>

                              <div className={`p-6 rounded-2xl flex flex-col items-center justify-center relative transition border duration-200 ${
                                scaleConnection !== "Connected" 
                                  ? "bg-[#161618] text-slate-500 border-white/5" 
                                  : scaleStatus === "Stable" 
                                    ? "bg-emerald-950/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-950/15" 
                                    : "bg-amber-950/10 border-amber-500/30 text-amber-400"
                              }`}>
                                <span className="font-mono font-extrabold text-5xl tracking-tight">
                                  {scaleConnection !== "Connected" ? "0.000" : (isScaleNegative ? "-" : "") + scaleWeight.toFixed(3)}
                                  <span className="text-xl ml-1 font-medium text-slate-400">kg</span>
                                </span>
                                <span className="text-[10px] font-mono mt-1 text-slate-400 font-semibold tracking-wider uppercase">
                                  Display Timbangan Kasir
                                </span>
                              </div>
                            </div>
                          ) : (
                            /* Fallback Manual Weight Input (BR-06) */
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Input Berat Manual (kg)</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  step="0.001"
                                  min="0.001"
                                  max="30.000"
                                  value={manualWeightInput}
                                  onChange={(e) => setManualWeightInput(e.target.value)}
                                  placeholder="Contoh: 1.250"
                                  className="w-full bg-[#161618] border border-white/5 rounded-2xl px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f] transition duration-200"
                                />
                                <span className="absolute right-4 top-3 text-sm text-slate-400 font-mono font-semibold">kg</span>
                              </div>
                            </div>
                          )}

                          {/* Fallback button trigger */}
                          <div className="flex items-center justify-between gap-4 pt-1">
                            <span className="text-xs text-slate-400 leading-relaxed font-medium">
                              Timbangan bermasalah?
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setUseManualWeight(!useManualWeight);
                                setManualWeightInput("");
                              }}
                              className="text-xs font-bold text-[#e8553f] hover:text-[#d64a35] underline underline-offset-4"
                            >
                              {useManualWeight ? "Gunakan Timbangan Live" : "Aktifkan Input Manual"}
                            </button>
                          </div>

                          {/* Live math subtotal card */}
                          <div className="bg-[#161618] rounded-2xl p-4 flex justify-between items-center font-mono border border-white/5">
                            <div>
                              <span className="text-[10px] text-slate-500 block font-semibold">Kalkulasi Subtotal</span>
                              <span className="text-xs text-slate-300">
                                {useManualWeight 
                                  ? `${manualWeightInput || "0"} kg` 
                                  : `${scaleConnection !== "Connected" ? "0.000" : scaleWeight.toFixed(3)} kg`} × Rp {selectedProduct.pricePerKg.toLocaleString("id-ID")}
                              </span>
                            </div>
                            <span className="font-extrabold text-base text-white">
                              Rp {calculateSubtotal(
                                selectedProduct, 
                                useManualWeight ? parseFloat(manualWeightInput) || 0 : (scaleConnection === "Connected" ? scaleWeight : 0),
                                null
                              ).toLocaleString("id-ID")}
                            </span>
                          </div>

                          {/* Add button with strict state enforcement (BR-01, BR-02) */}
                          <button
                            onClick={handleAddToCart}
                            disabled={
                              selectedProduct.isWeighable && !useManualWeight && 
                              (scaleConnection !== "Connected" || scaleStatus !== "Stable" || scaleWeight <= 0)
                            }
                            className={`w-full font-bold text-sm py-3 px-4 rounded-xl shadow-lg transition duration-200 active:translate-y-px ${
                              selectedProduct.isWeighable && !useManualWeight && 
                              (scaleConnection !== "Connected" || scaleStatus !== "Stable" || scaleWeight <= 0)
                                ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                                : "bg-[#e8553f] hover:bg-[#d64a35] text-white shadow-[#e8553f]/20 cursor-pointer"
                            }`}
                          >
                            {!useManualWeight && scaleStatus !== "Stable" && scaleConnection === "Connected"
                              ? "Menunggu Timbangan Stabil..."
                              : "Tambah ke Keranjang"}
                          </button>
                        </div>
                      ) : (
                        /* NON-WEIGHABLE QUANTITY ENTRY */
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Kuantitas Barang</label>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setUnitQuantity(Math.max(1, unitQuantity - 1))}
                                className="w-12 h-12 bg-[#161618] hover:bg-[#242427] text-slate-200 rounded-xl font-bold border border-white/5 transition text-lg"
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                min="1"
                                value={unitQuantity}
                                onChange={(e) => setUnitQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="flex-1 bg-[#161618] border border-white/5 rounded-xl py-2.5 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-[#e8553f]"
                              />
                              <button 
                                onClick={() => setUnitQuantity(unitQuantity + 1)}
                                className="w-12 h-12 bg-[#161618] hover:bg-[#242427] text-slate-200 rounded-xl font-bold border border-white/5 transition text-lg"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#161618] rounded-2xl p-4 flex justify-between items-center font-mono border border-white/5">
                            <div>
                              <span className="text-[10px] text-slate-500 block font-semibold">Kalkulasi Subtotal</span>
                              <span className="text-xs text-slate-300">
                                {unitQuantity} pcs × Rp {selectedProduct.pricePerKg.toLocaleString("id-ID")}
                              </span>
                            </div>
                            <span className="font-extrabold text-base text-white">
                              Rp {calculateSubtotal(selectedProduct, null, unitQuantity).toLocaleString("id-ID")}
                            </span>
                          </div>

                          <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#e8553f] hover:bg-[#d64a35] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-[#e8553f]/20 transition active:translate-y-px"
                          >
                            Tambah ke Keranjang
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Blank panel message */
                    <div className="bg-[#1e1e21] border border-white/5 p-8 rounded-3xl text-center shadow-md">
                      <div className="inline-block p-4 bg-[#161618] border border-white/5 text-slate-500 rounded-2xl mb-3">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white text-sm">Pilih Barang Dagangan</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Klik salah satu produk timbang atau barang eceran di sebelah kiri untuk memproses berat and menambahkannya ke keranjang.</p>
                    </div>
                  )}

                  {/* ACTIVE BASKET CONTAINER */}
                  <div className="bg-[#1e1e21] border border-white/5 rounded-3xl overflow-hidden shadow-lg flex flex-col">
                    <div className="px-5 py-4 bg-[#161618] border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingCart className="w-4 h-4 text-[#e8553f] shrink-0" />
                        Keranjang Belanja
                      </span>
                      <span className="text-xs font-mono font-bold bg-[#101012] px-2.5 py-1 rounded-full text-slate-300 border border-white/5">
                        {cart.length} Item
                      </span>
                    </div>

                    {cart.length > 0 ? (
                      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                        {cart.map(item => (
                          <div key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition duration-150">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-sm text-white tracking-tight">{item.productNameSnapshot}</h5>
                                {item.isManualWeight && (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/20 uppercase tracking-wider">
                                    MANUAL
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                                <span>
                                  {item.weightKg !== null ? `${item.weightKg.toFixed(3)} kg` : `${item.quantity} pcs`}
                                </span>
                                <span>×</span>
                                <span>Rp {item.unitPrice.toLocaleString("id-ID")}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              <span className="font-bold text-sm text-slate-200 font-mono">
                                Rp {item.subtotal.toLocaleString("id-ID")}
                              </span>
                              <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-950/20 transition duration-150"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto opacity-40 mb-2" />
                        <span className="text-xs text-slate-500">Keranjang masih kosong</span>
                      </div>
                    )}

                    {/* CART TOTALS AREA */}
                    {cart.length > 0 && (
                      <div className="p-5 bg-[#161618] border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">TOTAL TAGIHAN</span>
                          <span className="text-2xl font-extrabold text-white">
                            Rp {getCartTotal().toLocaleString("id-ID")}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setPaidAmount(getCartTotal());
                            setPaymentMethod("CASH");
                            setShowPaymentModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-[#e8553f] to-[#d64a35] hover:from-[#d64a35] hover:to-[#be3b27] text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-[#e8553f]/20 transition duration-150 active:translate-y-px"
                        >
                          PROSES PEMBAYARAN
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* C# SOURCE CODE EXPLORER */}
            {currentView === "CSHARP" && (
              <div id="view_csharp_explorer" className="flex-1 flex flex-col bg-[#1e1e21] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                {/* Explorer Sub-Header */}
                <div className="p-5 bg-[#161618] border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-[#e8553f]/10 text-[#e8553f] rounded-lg border border-[#e8553f]/20">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">C# .NET 8 WPF Solution Explorer</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Pristine C# WPF MVVM files ready for visual studio desktop compile</p>
                    </div>
                  </div>

                  {/* Project selection tab */}
                  <div className="flex gap-1.5 bg-[#101012] p-1 rounded-xl border border-white/5 max-w-full overflow-x-auto">
                    {["TimbanganCerdas.Core", "TimbanganCerdas.Hardware", "TimbanganCerdas.Data", "TimbanganCerdas.Tests"].map(proj => (
                      <button
                        key={proj}
                        onClick={() => setSelectedProject(proj)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                          selectedProject === proj 
                            ? "bg-[#161618] text-white shadow border border-white/5" 
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {proj.replace("TimbanganCerdas.", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main panel layout */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[500px]">
                  {/* File tree sidebar */}
                  <div className="md:col-span-3 border-r border-white/5 bg-[#161618] p-4 space-y-4 overflow-y-auto">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">FILES</span>
                      <div className="space-y-1">
                        {csharpFiles.filter(f => f.project === selectedProject).map(f => (
                          <button
                            key={f.path}
                            onClick={() => setSelectedFile(f)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-left transition duration-150 ${
                              selectedFile.path === f.path 
                                ? "bg-[#e8553f]/10 text-[#e8553f] border border-[#e8553f]/20" 
                                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 font-mono space-y-2 px-1">
                      <p className="font-bold uppercase tracking-wider text-[10px]">Location in Workspace</p>
                      <div className="bg-[#101012] p-2.5 rounded-xl border border-white/5 select-all font-semibold break-all text-[10px] text-slate-400">
                        /csharp_source/{selectedFile.path}
                      </div>
                    </div>
                  </div>

                  {/* Main code editor display */}
                  <div className="md:col-span-9 flex flex-col bg-[#1e1e21] overflow-hidden relative">
                    <div className="px-5 py-3 bg-[#161618] border-b border-white/5 flex justify-between items-center shrink-0">
                      <span className="text-[11px] font-mono font-semibold text-[#e8553f] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        {selectedFile.path}
                      </span>
                      
                      <button
                        onClick={() => {
                          const blob = new Blob([selectedFile.content], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = selectedFile.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-1.5 bg-[#161618] hover:bg-[#e8553f] border border-white/5 hover:border-transparent text-[11px] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg font-bold font-mono transition duration-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </button>
                    </div>

                    {/* Code Container */}
                    <div className="flex-1 p-6 overflow-auto font-mono text-[11px] leading-relaxed text-slate-300 select-text bg-[#101012]">
                      <pre className="whitespace-pre">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT MANAGEMENT VIEW */}
            {currentView === "PRODUK" && currentUser.role === "ADMIN" && (
              <div id="view_produk" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-white">Daftar Produk Toko</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Tambah, ubah, dan nonaktifkan komoditas timbang (buah, sayur, daging)</p>
                  </div>
                  <button 
                    onClick={() => handleOpenProductModal(null)}
                    className="flex items-center gap-1.5 bg-[#e8553f] hover:bg-[#d64a35] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md shadow-[#e8553f]/20"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Baru
                  </button>
                </div>

                <div className="bg-[#1e1e21] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#161618] text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono border-b border-white/5">
                        <th className="p-4">SKU</th>
                        <th className="p-4">Nama Produk</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Tipe Jual</th>
                        <th className="p-4 text-right">Harga per-Kg/Unit</th>
                        <th className="p-4 text-right">Sisa Stok</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-4 font-mono font-bold text-slate-400">{prod.sku}</td>
                          <td className="p-4 font-semibold text-white">{prod.name}</td>
                          <td className="p-4 text-slate-300">{prod.category}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prod.isWeighable ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                              {prod.isWeighable ? "Ditimbang (Kg)" : "Satuan (Pcs)"}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-[#e8553f]">Rp {prod.pricePerKg.toLocaleString("id-ID")}</td>
                          <td className="p-4 text-right font-mono text-slate-300">{prod.stockQty !== null ? prod.stockQty.toFixed(2) : "-"}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${prod.isActive ? "bg-emerald-500" : "bg-slate-600"}`} title={prod.isActive ? "Aktif" : "Tidak Aktif"}></span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleOpenProductModal(prod)}
                                className="text-xs text-[#e8553f] hover:text-[#d64a35] font-bold px-2 py-1 bg-[#161618] rounded-lg border border-white/5"
                              >
                                Ubah
                              </button>
                              <button 
                                onClick={() => handleToggleProductActive(prod.id)}
                                className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                                  prod.isActive 
                                    ? "text-red-400 hover:text-red-300 bg-red-950/10 border-red-950/20" 
                                    : "text-emerald-400 hover:text-emerald-300 bg-emerald-950/10 border-emerald-950/20"
                                }`}
                              >
                                {prod.isActive ? "Nonaktifkan" : "Aktifkan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USER MANAGEMENT VIEW */}
            {currentView === "PENGGUNA" && currentUser.role === "ADMIN" && (
              <div id="view_pengguna" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-white">Manajemen Pengguna</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Kelola izin dan otorisasi peran kasir dan admin sistem</p>
                  </div>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="flex items-center gap-1.5 bg-[#e8553f] hover:bg-[#d64a35] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md shadow-[#e8553f]/20"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kasir Baru
                  </button>
                </div>

                <div className="bg-[#1e1e21] border border-white/5 rounded-3xl overflow-hidden shadow-lg max-w-4xl">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#161618] text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono border-b border-white/5">
                        <th className="p-4">ID</th>
                        <th className="p-4">Username</th>
                        <th className="p-4">Nama Lengkap</th>
                        <th className="p-4">Peran (Role)</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-4 font-mono text-slate-400">{u.id}</td>
                          <td className="p-4 font-mono font-bold text-white">{u.username}</td>
                          <td className="p-4 font-semibold text-slate-300">{u.fullName}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              u.role === "ADMIN" ? "bg-[#e8553f]/10 text-[#e8553f] border border-[#e8553f]/20" : "bg-white/10 text-white/80 border border-white/10"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-600"}`} title={u.isActive ? "Aktif" : "Tidak Aktif"}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SERIAL SETTINGS VIEW */}
            {currentView === "PENGATURAN" && currentUser.role === "ADMIN" && scaleConfig && (
              <div id="view_settings" className="max-w-2xl space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-white">Konfigurasi Timbangan Digital</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Atur parameter serial port RS-232 / USB agar tersambung ke driver timbangan fisik</p>
                </div>

                <div className="bg-[#1e1e21] border border-white/5 p-6 rounded-3xl space-y-5 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Merk Timbangan</label>
                      <select 
                        value={brandKey}
                        onChange={(e) => setBrandKey(e.target.value as "CAS_SW" | "DIGI_SM")}
                        className="w-full bg-[#161618] border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8553f] font-mono text-white"
                      >
                        <option value="CAS_SW">CAS SW-II (Continuous)</option>
                        <option value="DIGI_SM">DIGI SM-100 (On-Demand)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Serial Port COM Name</label>
                      <select 
                        value={portName}
                        onChange={(e) => setPortName(e.target.value)}
                        className="w-full bg-[#161618] border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8553f] font-mono text-white"
                      >
                        <option value="COM1">COM1 (Hardware DB9)</option>
                        <option value="COM2">COM2</option>
                        <option value="COM3">COM3 (USB Serial Converter)</option>
                        <option value="COM4">COM4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Baud Rate (bps)</label>
                      <select 
                        value={baudRate}
                        onChange={(e) => setBaudRate(parseInt(e.target.value))}
                        className="w-full bg-[#161618] border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8553f] font-mono text-white"
                      >
                        <option value="2400">2400</option>
                        <option value="4800">4800</option>
                        <option value="9600">9600 (Recommended)</option>
                        <option value="19200">19200</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Mode Transmisi</label>
                      <select 
                        value={transmissionMode}
                        onChange={(e) => setTransmissionMode(e.target.value as "Continuous" | "OnDemand")}
                        className="w-full bg-[#161618] border border-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8553f] font-mono text-white"
                      >
                        <option value="Continuous">Continuous (Stream terus menerus)</option>
                        <option value="OnDemand">On Demand (Kirim saat stabil)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3 border-t border-white/5">
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveScaleSettings}
                        className="bg-[#e8553f] hover:bg-[#d64a35] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-[#e8553f]/20"
                      >
                        Simpan Konfigurasi
                      </button>

                      <button
                        onClick={() => {
                          setTestMessage("Menghubungi timbangan... Tes Koneksi Sukses! Driver dapat berkomunikasi dengan CAS SW-II secara stabil (RS232 Port COM3).");
                          setTimeout(() => setTestMessage(""), 5000);
                        }}
                        className="bg-[#161618] hover:bg-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-white/5 transition"
                      >
                        Tes Koneksi Port
                      </button>
                    </div>

                    {testMessage && (
                      <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 px-3 rounded-xl animate-pulse">
                        {testMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* REPORTS & AUDIT TRAIL VIEW */}
            {currentView === "LAPORAN" && currentUser.role === "ADMIN" && (
              <div id="view_reports" className="space-y-6">
                {/* Daily Dashboard Summary Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-[#1e1e21] border border-white/5 p-5 rounded-3xl relative overflow-hidden shadow">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Omzet Hari Ini</span>
                    <h3 className="text-2xl font-black text-white mt-1.5 font-mono">
                      Rp {transactions.filter(t => t.status === "COMPLETED").reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString("id-ID")}
                    </h3>
                    <div className="absolute right-4 bottom-4 p-2 bg-[#e8553f]/10 text-[#e8553f] rounded-xl border border-[#e8553f]/20">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-[#1e1e21] border border-white/5 p-5 rounded-3xl relative overflow-hidden shadow">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Transaksi Sukses</span>
                    <h3 className="text-2xl font-black text-white mt-1.5 font-mono">
                      {transactions.filter(t => t.status === "COMPLETED").length}
                    </h3>
                    <div className="absolute right-4 bottom-4 p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-[#1e1e21] border border-white/5 p-5 rounded-3xl relative overflow-hidden shadow">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Transaksi Void (Batal)</span>
                    <h3 className="text-2xl font-black text-white mt-1.5 font-mono">
                      {transactions.filter(t => t.status === "VOIDED").length}
                    </h3>
                    <div className="absolute right-4 bottom-4 p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Transaction History */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="font-bold text-sm text-slate-300">Histori Penjualan POS</h4>
                    <div className="bg-[#1e1e21] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-[#161618] text-slate-400 text-[10px] font-semibold uppercase tracking-wider font-mono border-b border-white/5">
                            <th className="p-3">Kode TRX</th>
                            <th className="p-3">Kasir</th>
                            <th className="p-3 text-right">Total Tagihan</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {transactions.map(trx => (
                            <tr key={trx.id} className="hover:bg-white/[0.02] transition">
                              <td className="p-3 font-mono font-bold text-slate-300">{trx.transactionCode}</td>
                              <td className="p-3 text-slate-300">{trx.cashierName.split(" ")[0]}</td>
                              <td className="p-3 text-right font-mono font-bold text-[#e8553f]">Rp {trx.totalAmount.toLocaleString("id-ID")}</td>
                              <td className="p-3 text-center">
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                  trx.status === "COMPLETED" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                  {trx.status}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button 
                                    onClick={() => setReceiptTransaction(trx)}
                                    className="p-1 bg-[#161618] hover:bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white"
                                    title="Tampilkan Struk"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                                  {trx.status === "COMPLETED" && (
                                    <button 
                                      onClick={() => handleVoidTransaction(trx.id)}
                                      className="p-1 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded text-red-400 hover:text-red-300"
                                      title="Void Transaksi"
                                    >
                                      Void
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Audit Log Tracker */}
                  <div className="lg:col-span-5 space-y-4">
                    <h4 className="font-bold text-sm text-slate-300">Jejak Audit Sistem (Audit Log)</h4>
                    <div className="bg-[#1e1e21] border border-white/5 rounded-3xl p-4 shadow-lg space-y-3.5 max-h-96 overflow-y-auto">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-3 bg-[#161618] rounded-2xl border border-white/5 hover:border-white/10 transition duration-150 flex gap-2.5 items-start">
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                            log.actionType === "MANUAL_WEIGHT" 
                              ? "bg-amber-500/10 text-amber-400" 
                              : log.actionType === "VOID_TRANSACTION"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-[#e8553f]/10 text-[#e8553f]"
                          }`}>
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 bg-[#101012] rounded text-slate-400 border border-white/5 font-mono">
                                {log.actionType}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-normal">{log.description}</p>
                            <span className="text-[9px] text-slate-500 font-mono font-bold block">User: {log.username}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* DETAILED DIALOGS & MODALS */}

      {/* 1. PAYMENT & RECEIPT DIALOG */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1e1e21] border border-white/5 p-6 rounded-3xl shadow-2xl space-y-6"
          >
            <div>
              <h3 className="font-bold text-lg text-white">Pembayaran Kasir</h3>
              <p className="text-xs text-slate-400">Pilih metode pembayaran dan masukkan jumlah uang yang diterima</p>
            </div>

            <div className="space-y-4">
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2">
                {(["CASH", "QRIS", "CARD"] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => {
                      setPaymentMethod(method);
                      if (method !== "CASH") {
                        setPaidAmount(getCartTotal()); // QRIS and CARD are exact amounts
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition duration-150 ${
                      paymentMethod === method 
                        ? "bg-[#e8553f] border-[#e8553f] text-white" 
                        : "bg-[#161618] border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Total Tagihan */}
              <div className="bg-[#101012] rounded-2xl p-4 flex justify-between items-center font-mono border border-white/5">
                <span className="text-xs text-slate-400 font-bold">Total Belanja:</span>
                <span className="text-xl font-extrabold text-white">Rp {getCartTotal().toLocaleString("id-ID")}</span>
              </div>

              {/* Cash Input if CASH chosen */}
              {paymentMethod === "CASH" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Uang Tunai Diterima</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm text-slate-400 font-bold">Rp</span>
                    <input 
                      type="number" 
                      value={paidAmount || ""}
                      onChange={(e) => setPaidAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#101012] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                    />
                  </div>

                  {/* Fast denomination buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[getCartTotal(), 10000, 20000, 50000, 100000].map(val => (
                      <button
                        key={val}
                        onClick={() => {
                          if (val === getCartTotal()) {
                            setPaidAmount(val);
                          } else {
                            setPaidAmount(val);
                          }
                        }}
                        className="bg-[#161618] hover:bg-slate-800 text-[11px] font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/5 transition"
                      >
                        {val === getCartTotal() ? "Uang Pas" : `Rp ${val.toLocaleString("id-ID")}`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 leading-relaxed bg-[#101012] p-3.5 rounded-xl border border-white/5">
                  Pembayaran non-tunai via {paymentMethod} akan diproses dan divalidasi langsung oleh EDC/aplikasi pembayaran bank secara otomatis.
                </div>
              )}

              {/* Change calculation */}
              {paymentMethod === "CASH" && (
                <div className="bg-[#101012] rounded-2xl p-4 flex justify-between items-center font-mono border border-white/5">
                  <span className="text-xs text-slate-400 font-bold">Uang Kembalian:</span>
                  <span className={`text-xl font-extrabold ${paidAmount - getCartTotal() >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    Rp {(paidAmount - getCartTotal() >= 0 ? paidAmount - getCartTotal() : 0).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-[#101012] hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs py-3 px-4 rounded-xl border border-white/5 transition"
              >
                Kembali
              </button>
              <button
                onClick={handleCheckout}
                disabled={paidAmount < getCartTotal()}
                className={`flex-1 font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition active:translate-y-px ${
                  paidAmount < getCartTotal() 
                    ? "bg-[#161618] text-slate-500 cursor-not-allowed border border-white/5" 
                    : "bg-[#e8553f] hover:bg-[#d64a35] text-white shadow-[#e8553f]/20"
                }`}
              >
                Konfirmasi & Cetak Struk
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. RECEIPT THERMAL PRINTER PREVIEW MODAL */}
      {receiptTransaction && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#1e1e21] border border-white/5 p-5 rounded-3xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Simulasi Print Struk Thermal (ESC/POS)</h3>
              
              {/* Receipt Body */}
              <div className="bg-white text-black p-5 rounded-xl font-mono text-[11px] leading-relaxed shadow-inner max-h-[400px] overflow-y-auto">
                <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                  <h4 className="font-extrabold text-xs">TIMBANGAN CERDAS MINIMARKET</h4>
                  <p>Jl. Raya Pembangunan No. 42</p>
                  <p>Bandung, Jawa Barat</p>
                  <p className="text-[10px]">Telp: (022) 555-0199</p>
                </div>

                <div className="py-3 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
                  <p>Kode: {receiptTransaction.transactionCode}</p>
                  <p>Tanggal: {new Date(receiptTransaction.transactionDate).toLocaleString("id-ID")}</p>
                  <p>Kasir: {receiptTransaction.cashierName}</p>
                  <p>Status: <span className="font-bold">{receiptTransaction.status}</span></p>
                </div>

                {/* Receipt Items */}
                <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
                  {receiptTransaction.items.map(item => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span>{item.productNameSnapshot}</span>
                        <span>Rp {item.subtotal.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-600 pl-2">
                        <span>
                          {item.weightKg !== null ? `${item.weightKg.toFixed(3)} kg` : `${item.quantity} pcs`} @ Rp {item.unitPrice.toLocaleString("id-ID")}
                        </span>
                        {item.isManualWeight && <span className="font-bold italic">(MANUAL)</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="py-3 space-y-1 border-b border-dashed border-slate-400 font-bold">
                  <div className="flex justify-between">
                    <span>TOTAL TAGIHAN:</span>
                    <span>Rp {receiptTransaction.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>JUMLAH DIBAYAR:</span>
                    <span>Rp {receiptTransaction.paidAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>METODE BAYAR:</span>
                    <span>{receiptTransaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>UANG KEMBALIAN:</span>
                    <span>Rp {receiptTransaction.changeAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="text-center pt-3 text-[10px] text-slate-600">
                  <p>*** Terima Kasih Atas Kunjungan Anda ***</p>
                  <p>Layanan Timbangan Digital Terintegrasi</p>
                </div>
              </div>
            </div>

            {testMessage && (
              <div className="mt-3 text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2 px-3 rounded-xl">
                {testMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setTestMessage("Perintah cetak struk terkirim ke printer thermal ESC/POS di USB001! Laci uang (Cash Drawer) dibuka secara otomatis.");
                  setTimeout(() => setTestMessage(""), 5000);
                }}
                className="flex-1 bg-[#e8553f] hover:bg-[#d64a35] text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk (ESC/POS)
              </button>

              <button
                onClick={() => {
                  setReceiptTransaction(null);
                  setTestMessage("");
                }}
                className="bg-[#101012] hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/5 transition"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. PRODUCT CRUD MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1e1e21] border border-white/5 p-6 rounded-3xl shadow-2xl space-y-4"
          >
            <div>
              <h3 className="font-bold text-base text-white">{editingProduct ? "Ubah Data Produk" : "Tambah Produk Baru"}</h3>
              <p className="text-xs text-slate-400">Pastikan Kode SKU unik untuk produk timbang baru Anda</p>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Kode SKU</label>
                  <input 
                    type="text"
                    value={prodSKU}
                    onChange={(e) => setProdSKU(e.target.value)}
                    className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Kategori</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                  >
                    <option value="Buah">Buah</option>
                    <option value="Sayur">Sayur</option>
                    <option value="Daging">Daging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Produk</label>
                <input 
                  type="text"
                  placeholder="Contoh: Apel Fuji Segar"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Harga Jual (Rp/Kg atau Unit)</label>
                  <input 
                    type="number"
                    value={prodPrice || ""}
                    onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                    placeholder="Harga Rp"
                    className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Kuantitas Stok Awal</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="Kosongkan jika tidak dilacak"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                  />
                </div>
              </div>

              <div className="bg-[#101012] p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Tipe Jual Ditimbang</span>
                  <span className="text-[10px] text-slate-400 leading-normal">Memicu integrasi timbangan saat dipilih kasir</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProdIsWeighable(!prodIsWeighable)}
                  className={`w-12 h-6 rounded-full transition relative ${prodIsWeighable ? "bg-[#e8553f]" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${prodIsWeighable ? "right-1" : "left-1"}`}></div>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 bg-[#101012] hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-white/5 transition"
              >
                Batalkan
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-[#e8553f] hover:bg-[#d64a35] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow shadow-[#e8553f]/10"
              >
                Simpan Produk
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 4. USER CREATION MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#1e1e21] border border-white/5 p-6 rounded-3xl shadow-2xl space-y-4"
          >
            <div>
              <h3 className="font-bold text-base text-white">Tambah Pengguna Baru</h3>
              <p className="text-xs text-slate-400">Tambahkan akun baru kasir atau administrator sistem</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Username Login</label>
                <input 
                  type="text"
                  placeholder="Contoh: kasir3"
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  placeholder="Contoh: Muhammad Yusuf"
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hak Akses Peran (Role)</label>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as "ADMIN" | "KASIR")}
                  className="w-full bg-[#101012] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e8553f] focus:ring-1 focus:ring-[#e8553f]"
                >
                  <option value="KASIR">KASIR - Hanya Akses Layar POS</option>
                  <option value="ADMIN">ADMIN - Kontrol Penuh Pengaturan & Laporan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 bg-[#101012] hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-white/5 transition"
              >
                Kembali
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-[#e8553f] hover:bg-[#d64a35] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow shadow-[#e8553f]/10"
              >
                Buat Pengguna
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
