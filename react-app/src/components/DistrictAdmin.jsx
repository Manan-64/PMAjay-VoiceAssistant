import React, { useState } from 'react';

export default function DistrictAdmin() {
  const [selectedDistrict, setSelectedDistrict] = useState('Varanasi');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample District Beneficiary Records
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 'PMAJ-2601', name: 'Ramesh Kumar', skill: 'Poultry Farm', block: 'Pindra', date: '2026-08-20', subsidy: 10000, status: 'Approved' },
    { id: 'PMAJ-2602', name: 'Sunita Devi', skill: 'Custom Tailoring', block: 'Arajiline', date: '2026-08-21', subsidy: 10000, status: 'Under Review' },
    { id: 'PMAJ-2603', name: 'Amit Verma', skill: 'Solar Panel Technician', block: 'Kashi Vidyapeeth', date: '2026-08-22', subsidy: 10000, status: 'Approved' },
    { id: 'PMAJ-2604', name: 'Pooja Rani', skill: 'Beauty Parlor', block: 'Cholapur', date: '2026-08-22', subsidy: 10000, status: 'Field Inspection Pending' },
    { id: 'PMAJ-2605', name: 'Manoj Paswan', skill: 'Two-Wheeler Mechanic', block: 'Harahua', date: '2026-08-23', subsidy: 10000, status: 'Under Review' },
    { id: 'PMAJ-2606', name: 'Geeta Kumari', skill: 'Dairy Farming', block: 'Pindra', date: '2026-08-23', subsidy: 10000, status: 'Approved' },
    { id: 'PMAJ-2607', name: 'Vikas Sonkar', skill: 'Mobile Repair Shop', block: 'Arajiline', date: '2026-08-24', subsidy: 10000, status: 'Disbursed' }
  ]);

  const blockStats = [
    { name: 'Pindra', target: 600, applied: 540, disbursed: 420, fundUsed: '₹42,00,000' },
    { name: 'Arajiline', target: 500, applied: 460, disbursed: 380, fundUsed: '₹38,00,000' },
    { name: 'Kashi Vidyapeeth', target: 700, applied: 690, disbursed: 510, fundUsed: '₹51,00,000' },
    { name: 'Cholapur', target: 450, applied: 380, disbursed: 310, fundUsed: '₹31,00,000' },
    { name: 'Harahua', target: 550, applied: 490, disbursed: 410, fundUsed: '₹41,00,000' },
  ];

  const monthlyTrends = [
    { month: 'Jan', applications: 240, disbursed: 190 },
    { month: 'Feb', applications: 310, disbursed: 260 },
    { month: 'Mar', applications: 420, disbursed: 350 },
    { month: 'Apr', applications: 380, disbursed: 340 },
    { month: 'May', applications: 510, disbursed: 440 },
    { month: 'Jun', applications: 620, disbursed: 530 },
    { month: 'Jul', applications: 740, disbursed: 680 },
    { month: 'Aug', applications: 850, disbursed: 720 }
  ];

  const sectorShare = [
    { sector: 'Agriculture & Livestock (Poultry/Dairy)', percent: 38, count: '1,240 Grants', color: 'bg-emerald-500' },
    { sector: 'Textiles & Apparel (Tailoring)', percent: 24, count: '780 Grants', color: 'bg-blue-500' },
    { sector: 'Technical Trades (Solar, Mobile, Auto)', percent: 20, count: '650 Grants', color: 'bg-amber-500' },
    { sector: 'Retail & Services (Kirana, Salon, CSC)', percent: 18, count: '590 Grants', color: 'bg-indigo-500' }
  ];

  const handleStatusChange = (id, newStatus) => {
    setBeneficiaries(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.skill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || b.block === selectedBlock;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6">
      {/* Top Header & Context Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">District Administration Node</span>
            <span className="flex items-center text-xs text-green-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Live Portal Sync
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">PM-AJAY Monitoring & Grant Disbursement Dashboard</h1>
          <p className="text-sm text-gray-500">Pradhan Mantri Anusuchit Jaati Abhyuday Yojana • FY 2026–27</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-50 border border-gray-300 font-semibold text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Varanasi">District: Varanasi (UP)</option>
            <option value="Lucknow">District: Lucknow (UP)</option>
            <option value="Pune">District: Pune (MH)</option>
            <option value="Patna">District: Patna (BR)</option>
          </select>

          <button
            onClick={() => alert("Official District PM-AJAY Beneficiary Audit Report downloaded (CSV/PDF).")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applications</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">3,260</h3>
          <p className="text-xs text-green-600 font-semibold mt-2 flex items-center">
            <span className="mr-1">▲ +14.8%</span> from last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Subsidy Disbursed</p>
          <h3 className="text-3xl font-black text-blue-600 mt-2">₹2.03 Cr</h3>
          <p className="text-xs text-gray-500 mt-2 font-medium">Cap: ₹10,000 / individual</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Field Reviews</p>
          <h3 className="text-3xl font-black text-amber-500 mt-2">148</h3>
          <p className="text-xs text-amber-700 font-semibold mt-2">Requires BDO validation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">District Fund Utilization</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-2">86.4%</h3>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86.4%' }}></div>
          </div>
        </div>
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Applications vs Disbursed Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Application Intake & Grant Disbursement Trend</h2>
              <p className="text-xs text-gray-400">Monthly beneficiary volume progression (2026)</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-sm mr-1.5"></span> Applied</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-sm mr-1.5"></span> Disbursed</span>
            </div>
          </div>

          {/* Pure SVG Scalable Bar Chart */}
          <div className="w-full h-64 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-200">
            {monthlyTrends.map((t, idx) => {
              const maxVal = 900;
              const appHeight = `${(t.applications / maxVal) * 100}%`;
              const disbHeight = `${(t.disbursed / maxVal) * 100}%`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20 whitespace-nowrap">
                    {t.month}: {t.applications} Applied | {t.disbursed} Disbursed
                  </div>

                  <div className="w-full flex items-end justify-center space-x-1 h-full">
                    <div className="w-3 sm:w-5 bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600" style={{ height: appHeight }}></div>
                    <div className="w-3 sm:w-5 bg-emerald-500 rounded-t-md transition-all duration-300 hover:bg-emerald-600" style={{ height: disbHeight }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 mt-2">{t.month}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 text-right">Data synced with State Welfare Repository</p>
        </div>

        {/* Sector-wise Distribution Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sector-wise Demand Share</h2>
            <p className="text-xs text-gray-400 mb-6">Distribution across 12 approved trades</p>

            <div className="space-y-4">
              {sectorShare.map((s, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">{s.sector}</span>
                    <span className="text-slate-900">{s.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${s.color} h-full rounded-full transition-all`} style={{ width: `${s.percent}%` }}></div>
                  </div>
                  <span className="text-[11px] text-gray-400">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
            💡 <strong>High Demand:</strong> Agriculture and Livestock equipment represent the majority of subsidy requests in rural blocks.
          </div>
        </div>
      </div>

      {/* Block-Level Performance Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Block-Wise Allocation & Disbursement Status</h2>
        <p className="text-xs text-gray-400 mb-4">Sub-district performance breakdown</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Sub-District Block</th>
                <th className="py-3 px-4">Target Beneficiaries</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Approved & Disbursed</th>
                <th className="py-3 px-4">Subsidy Utilized</th>
                <th className="py-3 px-4">Target Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {blockStats.map((b, idx) => {
                const percent = Math.round((b.disbursed / b.target) * 100);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{b.target}</td>
                    <td className="py-3.5 px-4 text-gray-600">{b.applied}</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{b.disbursed}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-semibold">{b.fundUsed}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-28 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Application Verification Queue */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Beneficiary Application Verification Queue</h2>
            <p className="text-xs text-gray-400">Direct grant verification and approval controls</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by ID, name, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 w-64"
            />

            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-3 py-2 font-semibold"
            >
              <option value="All">All Blocks</option>
              <option value="Pindra">Pindra</option>
              <option value="Arajiline">Arajiline</option>
              <option value="Kashi Vidyapeeth">Kashi Vidyapeeth</option>
              <option value="Cholapur">Cholapur</option>
              <option value="Harahua">Harahua</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-3 py-2 font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Field Inspection Pending">Field Inspection Pending</option>
              <option value="Disbursed">Disbursed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Beneficiary Name</th>
                <th className="py-3 px-4">Trade / Skill</th>
                <th className="py-3 px-4">Block</th>
                <th className="py-3 px-4">Application Date</th>
                <th className="py-3 px-4">Max Subsidy</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-center">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredBeneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                  <td className="py-3.5 px-4 text-gray-700">{b.skill}</td>
                  <td className="py-3.5 px-4 text-gray-500">{b.block}</td>
                  <td className="py-3.5 px-4 text-gray-500">{b.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{b.subsidy.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      b.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {b.status !== 'Disbursed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Disbursed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                          title="Authorize ₹10,000 Direct Bank Transfer"
                        >
                          Disburse
                        </button>
                      )}
                      {b.status !== 'Approved' && b.status !== 'Disbursed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'Approved')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(b.id, 'Field Inspection Pending')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
