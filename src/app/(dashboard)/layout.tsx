"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Factory, Users, LogOut, ShoppingBag, Package, Building2, Receipt, Menu, X } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
      ]
    },
    {
      label: "Suppliers",
      items: [
        { name: "Factories", path: "/factories", icon: Building2 },
        { name: "Products", path: "/products", icon: Package },
        { name: "Orders", path: "/suppliers", icon: Factory },
      ]
    },
    {
      label: "Distributors",
      items: [
        { name: "Partners", path: "/distributors", icon: Users },
        { name: "Orders", path: "/invoices", icon: Receipt },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-slate-950 text-white flex flex-col z-50 transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="py-10 flex flex-col items-center justify-center border-b border-slate-800/50 shrink-0 relative">
          <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <Image src="/icon.png" alt="Phenex Pulse" width={110} height={110} className="object-contain drop-shadow-xl mb-4" priority />
          <span className="font-bold text-2xl tracking-widest text-amber-500 uppercase">Phenex</span>
          <span className="text-[11px] tracking-[0.3em] text-slate-400 mt-1 uppercase">Pulse</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${
                        isActive 
                          ? "bg-amber-500/10 text-amber-500" 
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" /> {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 shrink-0">
          <div className="mb-6">
            <h4 className="font-bold text-slate-200 tracking-wider">PHENEX</h4>
            <p className="text-xs text-slate-400 mt-1 italic">Senarnya Para Juara</p>
          </div>
          
          <div className="flex items-center gap-4 mb-6 text-slate-400">
            <a href="https://www.instagram.com/phenexfishingline" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@phenexfishingline" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
              <FaTiktok className="w-5 h-5" />
            </a>
            <a href="https://shopee.co.id/phenexfishingline" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </a>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button onClick={() => setIsMobileOpen(true)} className="md:hidden text-slate-600 hover:text-amber-500">
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 font-bold ml-auto">
            DV
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}