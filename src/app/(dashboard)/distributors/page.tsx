"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, Edit, Trash2, X, Users } from "lucide-react";

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/distributors");
      setDistributors(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (distributor: any) => {
    setEditId(distributor.id);
    setName(distributor.name);
    setLocation(distributor.location || "");
    setLogoUrl(distributor.logoUrl || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this distributor? This will fail if they have active invoices.")) return;
    try {
      await api.delete(`/distributors/${id}`);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete distributor.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { name, location, logoUrl };
      if (editId) {
        await api.patch(`/distributors/${editId}`, payload);
      } else {
        await api.post("/distributors", payload);
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
    setLocation("");
    setLogoUrl("");
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Distributors</h2>
          <p className="text-slate-500 text-sm mt-1">Manage B2B partners and retail networks.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-slate-900 hover:bg-slate-800 text-amber-500 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Distributor</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">{editId ? "Edit Distributor" : "Register New Distributor"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Distributor Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Surya Fishing" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Jakarta, Indonesia" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Logo URL (Optional)</label>
              <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-amber-500"/>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {submitting ? "Saving..." : (editId ? "Update Distributor" : "Save Distributor")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Distributor Name</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {distributors.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No distributors found.</td></tr>
            ) : (
              distributors.map((distributor) => (
                <tr key={distributor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      {distributor.logoUrl ? <img src={distributor.logoUrl} alt="logo" className="w-5 h-5 object-contain" /> : <Users className="w-4 h-4"/>}
                    </div>
                    {distributor.name}
                  </td>
                  <td className="px-6 py-4">{distributor.location || "-"}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(distributor)} className="text-slate-400 hover:text-amber-500 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(distributor.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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