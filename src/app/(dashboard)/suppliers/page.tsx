"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X } from "lucide-react";

export default function SuppliersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [factoryId, setFactoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productionDays, setProductionDays] = useState("30");
  const [status, setStatus] = useState("PRODUCTION");

  const fetchData = async () => {
    try {
      const res = await api.get("/suppliers");
      setOrders(res.data.orders);
      setFactories(res.data.factories);
      setProducts(res.data.products);
      
      if (!editId && res.data.factories.length > 0) setFactoryId(res.data.factories[0].id);
      if (!editId && res.data.products.length > 0) setProductId(res.data.products[0].id);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (order: any) => {
    setEditId(order.id);
    setProductId(order.productId);
    setFactoryId(order.factoryId);
    setQuantity(order.quantity.toString());
    setStatus(order.status);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      await fetchData();
    } catch {
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.patch(`/suppliers/${editId}`, { quantity, status });
      } else {
        await api.post("/suppliers", { factoryId, productId, quantity, productionDays });
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
    setQuantity("");
    setStatus("PRODUCTION");
    if (factories.length > 0) setFactoryId(factories[0].id);
    if (products.length > 0) setProductId(products[0].id);
  };

  const getStatusBadge = (currentStatus: string) => {
    const styles: Record<string, string> = {
      PRODUCTION: "bg-blue-100 text-blue-700 border-blue-200",
      TRANSIT: "bg-amber-100 text-amber-700 border-amber-200",
      TRANSPORT: "bg-purple-100 text-purple-700 border-purple-200",
      READY: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[currentStatus]}`}>
        {currentStatus}
      </span>
    );
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Production Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage factory logistics and incoming stock.</p>
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
          <h3 className="font-bold text-slate-800 mb-4">{editId ? "Edit Order" : "Create New Factory Order"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Product</label>
              <select disabled={!!editId} value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 disabled:bg-slate-100">
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Factory</label>
              <select disabled={!!editId} value={factoryId} onChange={(e) => setFactoryId(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 disabled:bg-slate-100">
                {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Quantity</label>
                <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
              </div>
              <div className="w-1/2">
                {editId ? (
                  <>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500">
                      <option value="PRODUCTION">PRODUCTION</option>
                      <option value="TRANSIT">TRANSIT</option>
                      <option value="TRANSPORT">TRANSPORT</option>
                      <option value="READY">READY</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Days</label>
                    <select value={productionDays} onChange={(e) => setProductionDays(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500">
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                      <option value="60">60</option>
                      <option value="75">75</option>
                    </select>
                  </>
                )}
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {submitting ? "Saving..." : (editId ? "Update Order" : "Submit Order")}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Factory</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Est. Arrival</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No active orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{order.product.name}</td>
                  <td className="px-6 py-4">{order.factory.name}</td>
                  <td className="px-6 py-4 font-medium">{order.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(order.estimatedArrival).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(order)} className="text-slate-400 hover:text-amber-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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