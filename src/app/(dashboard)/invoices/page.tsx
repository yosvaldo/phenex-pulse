"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X, Receipt } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [distributors, setDistributors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [distributorId, setDistributorId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("OUTSTANDING");

  const fetchData = async () => {
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data.invoices);
      setDistributors(res.data.distributors);
      setProducts(res.data.products);
      
      if (!editId && res.data.distributors.length > 0) setDistributorId(res.data.distributors[0].id);
      if (!editId && res.data.products.length > 0) setProductId(res.data.products[0].id);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (invoice: any) => {
    setEditId(invoice.id);
    setDistributorId(invoice.distributorId);
    setStatus(invoice.status);
    
    const formattedDate = new Date(invoice.dueDate).toISOString().split('T')[0];
    setDueDate(formattedDate);
    
    if (invoice.items && invoice.items.length > 0) {
      setProductId(invoice.items[0].productId);
      setQuantity(invoice.items[0].quantity.toString());
      setPrice(invoice.items[0].price.toString());
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      await fetchData();
    } catch {
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        distributorId,
        dueDate,
        status,
        items: [{ productId, quantity: Number(quantity), price: Number(price) }]
      };

      if (editId) {
        await api.patch(`/invoices/${editId}`, payload);
      } else {
        await api.post("/invoices", payload);
      }
      await fetchData();
      resetForm();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setShowForm(false);
    setDueDate("");
    setQuantity("");
    setPrice("");
    setStatus("OUTSTANDING");
    if (distributors.length > 0) setDistributorId(distributors[0].id);
    if (products.length > 0) setProductId(products[0].id);
  };

  const getStatusBadge = (currentStatus: string) => {
    const styles: Record<string, string> = {
      OUTSTANDING: "bg-amber-100 text-amber-700 border-amber-200",
      OVERDUE: "bg-red-100 text-red-700 border-red-200",
      PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[currentStatus]}`}>
        {currentStatus}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Distributor Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage B2B orders and track invoice payments.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-amber-500 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Order</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">{editId ? "Edit Invoice Details" : "Create New Distributor Order"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Distributor</label>
              <select value={distributorId} onChange={(e) => setDistributorId(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white">
                {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Payment Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white">
                <option value="OUTSTANDING">OUTSTANDING</option>
                <option value="OVERDUE">OVERDUE</option>
                <option value="PAID">PAID</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Product</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white">
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Quantity (pcs)</label>
              <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Unit Price (IDR)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50000" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            
            <div className="md:col-span-4 flex justify-end mt-2">
              <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {submitting ? "Saving..." : (editId ? "Update Invoice" : "Create Invoice")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Distributor</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No invoices found.</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Receipt className="w-4 h-4"/></div>
                    {invoice.distributor.name}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.items.map((item: any) => (
                      <div key={item.id} className="text-xs">
                        <span className="font-semibold">{item.quantity} pcs</span> {item.product.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(invoice.totalAmount)}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(invoice)} className="text-slate-400 hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(invoice.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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