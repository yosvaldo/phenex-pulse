"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X } from "lucide-react";

export default function SuppliersPage() {
  const [data, setData] = useState({ orders: [] as any[], factories: [] as any[], products: [] as any[] });
  const [ui, setUi] = useState({ loading: true, showForm: false, submitting: false, editId: null as string | null });
  const [form, setForm] = useState({ factId: "", prodId: "", qty: "", days: "30", status: "PRODUCTION", eta: "" });

  const fetchData = async () => {
    try {
      const res = await api.get("/suppliers");
      setData({ orders: res.data.orders, factories: res.data.factories, products: res.data.products });
      if (!ui.editId && res.data.factories.length > 0) setForm(f => ({ ...f, factId: res.data.factories[0].id }));
      if (!ui.editId && res.data.products.length > 0) setForm(f => ({ ...f, prodId: res.data.products[0].id }));
    } catch {} finally { setUi(u => ({ ...u, loading: false })); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (order: any) => {
    setUi({ ...ui, editId: order.id, showForm: true });
    setForm({ factId: order.factoryId, prodId: order.productId, qty: order.quantity.toString(), status: order.status, days: "30", eta: order.estimatedArrival ? new Date(order.estimatedArrival).toISOString().split('T')[0] : "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try { await api.delete(`/suppliers/${id}`); await fetchData(); } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUi(u => ({ ...u, submitting: true }));
    try {
      if (ui.editId) await api.patch(`/suppliers/${ui.editId}`, { quantity: form.qty, status: form.status, estimatedArrival: form.status === "READY" ? form.eta : undefined });
      else await api.post("/suppliers", { factoryId: form.factId, productId: form.prodId, quantity: form.qty, productionDays: form.days });
      await fetchData(); resetForm();
    } catch {} finally { setUi(u => ({ ...u, submitting: false })); }
  };

  const resetForm = () => {
    setUi({ ...ui, editId: null, showForm: false });
    setForm({ factId: data.factories[0]?.id || "", prodId: data.products[0]?.id || "", qty: "", days: "30", status: "PRODUCTION", eta: "" });
  };

  const badgeCols: Record<string, string> = { PRODUCTION: "bg-blue-100 text-blue-700 border-blue-200", TRANSIT: "bg-amber-100 text-amber-700 border-amber-200", TRANSPORT: "bg-purple-100 text-purple-700 border-purple-200", READY: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  const getBadge = (s: string) => <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badgeCols[s]}`}>{s}</span>;
  const inputCls = "w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white disabled:bg-slate-100";

  if (ui.loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Production Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage factory logistics and incoming stock.</p>
        </div>
        <button onClick={() => ui.showForm ? resetForm() : setUi({ ...ui, showForm: true })} className="bg-slate-900 hover:bg-slate-800 text-amber-500 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors">
          {ui.showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Order</>}
        </button>
      </div>

      {ui.showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">{ui.editId ? "Edit Order" : "Create New Factory Order"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Product</label>
              <select disabled={!!ui.editId} value={form.prodId} onChange={e => setForm({...form, prodId: e.target.value})} className={inputCls}>{data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Factory</label>
              <select disabled={!!ui.editId} value={form.factId} onChange={e => setForm({...form, factId: e.target.value})} className={inputCls}>{data.factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Quantity</label>
              <input type="number" required value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} placeholder="0" className={inputCls}/>
            </div>
            {ui.editId ? (
              <div className="md:col-span-4 flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}><option value="PRODUCTION">PRODUCTION</option><option value="TRANSIT">TRANSIT</option><option value="TRANSPORT">TRANSPORT</option><option value="READY">READY</option></select>
                </div>
                {form.status === "READY" && <div className="w-1/2"><label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Manual ETA</label><input type="date" required value={form.eta} onChange={e => setForm({...form, eta: e.target.value})} className={inputCls}/></div>}
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Production Days</label>
                <select value={form.days} onChange={e => setForm({...form, days: e.target.value})} className={inputCls}><option value="15">15</option><option value="30">30</option><option value="45">45</option><option value="60">60</option><option value="75">75</option></select>
              </div>
            )}
            <div className="md:col-span-6 flex justify-end mt-4">
              <button type="submit" disabled={ui.submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {ui.submitting ? "Saving..." : (ui.editId ? "Update Order" : "Submit Order")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Factory</th><th className="px-6 py-4">Quantity</th><th className="px-6 py-4">Order Date</th><th className="px-6 py-4">Est. Arrival</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.orders.length === 0 ? (<tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No active orders found.</td></tr>) : (
              data.orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{o.product.name}</td>
                  <td className="px-6 py-4">{o.factory.name}</td><td className="px-6 py-4 font-medium">{o.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(o.estimatedArrival).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getBadge(o.status)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3"><button onClick={() => handleEdit(o)} className="text-slate-400 hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(o.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}