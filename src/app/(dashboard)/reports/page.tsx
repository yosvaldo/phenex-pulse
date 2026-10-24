"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, TrendingUp, AlertTriangle, PackageOpen, Wallet } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setData(res.data);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Business Intelligence Reports</h2>
        <p className="text-slate-500 text-sm mt-1">High-level financial and inventory health overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Wallet className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(data.financials.totalRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full z-0"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Outstanding</p>
            <h3 className="text-2xl font-bold text-amber-600">{formatCurrency(data.financials.outstandingRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><PackageOpen className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Mfg Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{data.inventory.activeOrders} Shipments</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-red-600">{data.inventory.lowStock} Action Required</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attention Required: Overdue Collections</h3>
          {data.financials.overdueInvoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">All accounts are up to date.</div>
          ) : (
            <div className="space-y-4">
              {data.financials.overdueInvoices.map((inv: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">{inv.distributor}</p>
                    <p className="text-xs text-red-500 font-semibold mt-1">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right font-bold text-slate-800">
                    {formatCurrency(inv.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}