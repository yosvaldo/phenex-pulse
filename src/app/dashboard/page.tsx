export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Real-time insights for a stronger tomorrow.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Products Sold</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">250,000+</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Distributors</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">20+</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Factories</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}