"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Factory, Users, BarChart3, LogOut, ShoppingBag } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Suppliers", path: "/suppliers", icon: Factory },
    { name: "Distributors", path: "/distributors", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-950 text-white flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="Phenex Pulse" width={32} height={32} className="object-contain" />
            <span className="font-bold text-lg tracking-wider text-amber-500">PHENEX PULSE</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
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

          <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-800">Welcome, Dev</h1>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 font-bold">
            DV
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}