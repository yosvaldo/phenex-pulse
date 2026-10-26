"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X, Receipt } from "lucide-react";

export default function InvoicesPage() {
  const [data, setData] = useState({ invoices: [] as any[], distributors: [] as any[], products: [] as any[] });
  const [ui, setUi] = useState({ loading: true, showForm: false, submitting: false, editId: null as string | null });
  const [form, setForm] = useState({ distId: "", date: "", prodId: "", qty: "", price: "", status: "OUTSTANDING" });

  const fetchData = async () => {
    try {
      const res = await api.get("/invoices");
      setData({ invoices: res.data.invoices, distributors: res.data.distributors, products: res.data.products });
      if (!ui.editId && res.data.distributors.length > 0) setForm(f => ({ ...f, distId: res.data.distributors[0].id }));
      if (!ui.editId && res.data.products.length > 0) setForm(f => ({ ...f, prodId: res.data.products[0].id }));
    } catch {} finally { setUi(u => ({ ...u, loading: false })); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (inv: any) => {
    setUi({ ...ui, editId: inv.id, showForm: true });
    setForm({
      distId: inv.distributorId, status: inv.status,
      date: new Date(inv.dueDate).toISOString().split('T')[0],
      prodId: inv.items?.[0]?.productId || "",
      qty: inv.items?.[0]?.quantity?.toString() || "",
      price: inv.items?.[0]?.price?.toString() || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try { await api.delete(`/invoices/${id}`); await fetchData(); } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUi(u => ({ ...u, submitting: true }));
    try {
      const payload = { distributorId: form.distId, dueDate: form.date, status: form.status, items: [{ productId: form.prodId, quantity: Number(form.qty), price: Number(form.price) }] };
      ui.editId ? await api.patch(`/invoices/${ui.editId}`, payload) : await api.post("/invoices", payload);
      await fetchData(); resetForm();
    } catch {} finally { setUi(u => ({ ...u, submitting: false })); }
  };

  const resetForm = () => {
    setUi({ ...ui, editId: null, showForm: false });
    setForm({ distId: data.distributors[0]?.id || "", date: "", prodId: data.products[0]?.id || "", qty: "", price: "", status: "OUTSTANDING" });
  };

  const badgeCols: Record<string, string> = { OUTSTANDING: "bg-amber-100 text-amber-700 border-amber-200", OVERDUE: "bg-red-100 text-red-700 border-red-200", PAID: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  const getBadge = (s: string) => <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badgeCols[s]}`}>{s}</span>;
  const formatMoney = (amt: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amt);
  const inputCls = "w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white";

  if (ui.loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Distributor Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage B2B orders and track invoice payments.</p>
        </div>
        <button onClick={() => ui.showForm ? resetForm() : setUi({ ...ui, showForm: true })} className="bg-slate-900 hover:bg-slate-800 text-amber-500 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors">
          {ui.showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Order</>}
        </button>
      </div>

      {ui.showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">{ui.editId ? "Edit Invoice Details" : "Create New Distributor Order"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Distributor</label>
              <select value={form.distId} onChange={e => setForm({...form, distId: e.target.value})} className={inputCls}>{data.distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Due Date</label>
              <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Payment Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}>
                <option value="OUTSTANDING">OUTSTANDING</option><option value="OVERDUE">OVERDUE</option><option value="PAID">PAID</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Product</label>
              <select value={form.prodId} onChange={e => setForm({...form, prodId: e.target.value})} className={inputCls}>{data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Quantity (pcs)</label>
              <input type="number" required value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} placeholder="0" className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Unit Price (IDR)</label>
              <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="50000" className={inputCls}/>
            </div>
            <div className="md:col-span-4 flex justify-end mt-2">
              <button type="submit" disabled={ui.submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {ui.submitting ? "Saving..." : (ui.editId ? "Update Invoice" : "Create Invoice")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr><th className="px-6 py-4">Distributor</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Total Amount</th><th className="px-6 py-4">Due Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.invoices.length === 0 ? (<tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No invoices found.</td></tr>) : (
              data.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Receipt className="w-4 h-4"/></div>{inv.distributor.name}</td>
                  <td className="px-6 py-4">{inv.items.map((i: any) => <div key={i.id} className="text-xs"><span className="font-semibold">{i.quantity} pcs</span> {i.product.name}</div>)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatMoney(inv.totalAmount)}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getBadge(inv.status)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(inv)} className="text-slate-400 hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}