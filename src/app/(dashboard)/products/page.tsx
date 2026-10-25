"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X, Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [reorderRule, setReorderRule] = useState("THRESHOLD");
  const [currentStock, setCurrentStock] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product: any) => {
    setEditId(product.id);
    setName(product.name);
    setSku(product.sku);
    setReorderPoint(product.reorderPoint.toString());
    setReorderRule(product.reorderRule || "THRESHOLD");
    setCurrentStock(product.currentStock.toString());
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? It will fail if linked to existing orders.")) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchData();
    } catch (err: any) {
      alert("Cannot delete product: " + (err.response?.data?.message || "In use by an order."));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { name, sku, reorderPoint, reorderRule, currentStock };
      if (editId) {
        await api.patch(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
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
    setName("");
    setSku("");
    setReorderPoint("");
    setReorderRule("THRESHOLD");
    setCurrentStock("");
  };

  const formatRule = (rule: string) => {
    if (!rule || rule === "THRESHOLD") return "Numeric";
    return rule.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Product Catalog</h2>
          <p className="text-slate-500 text-sm mt-1">Manage SKUs and stock thresholds.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-amber-500 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">{editId ? "Edit Product" : "Create New Product"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Inferno X8 300m" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">SKU</label>
              <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} placeholder="INF-X8-300" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Threshold</label>
              <input type="number" required value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} placeholder="15000" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Strategy</label>
              <select value={reorderRule} onChange={(e) => setReorderRule(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white">
                <option value="THRESHOLD">Numeric</option>
                <option value="ONCE_DISTRIBUTED">Once Distributed</option>
                <option value="TWICE_A_YEAR">Twice a Year</option>
                <option value="ONCE_A_YEAR">Once a Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Stock</label>
              <input type="number" required value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} placeholder="0" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div className="md:col-span-6 flex justify-end mt-2">
              <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {submitting ? "Saving..." : (editId ? "Update Product" : "Save Product")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Reorder Point</th>
              <th className="px-6 py-4">Strategy</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No products found.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Package className="w-4 h-4"/></div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                  <td className={`px-6 py-4 font-medium ${product.currentStock <= product.reorderPoint && (!product.reorderRule || product.reorderRule === 'THRESHOLD') ? 'text-red-500' : 'text-emerald-600'}`}>
                    {product.currentStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{product.reorderPoint.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{formatRule(product.reorderRule)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(product)} className="text-slate-400 hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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