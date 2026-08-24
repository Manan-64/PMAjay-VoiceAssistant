import React, { useState } from 'react';

export default function DistrictAdmin() {
  const [selectedDistrict, setSelectedDistrict] = useState('Varanasi');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample District Beneficiary Records
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 'PMAJ-2601', name: 'Ramesh Kumar', skill: 'पोल्ट्री फार्म', block: 'पिंडरा', date: '2026-08-20', subsidy: 10000, status: 'स्वीकृत' },
    { id: 'PMAJ-2602', name: 'Sunita Devi', skill: 'सिलाई', block: 'अराजीलाइन', date: '2026-08-21', subsidy: 10000, status: 'समीक्षाधीन' },
    { id: 'PMAJ-2603', name: 'Amit Verma', skill: 'सोलर पैनल तकनीशियन', block: 'काशी विद्यापीठ', date: '2026-08-22', subsidy: 10000, status: 'स्वीकृत' },
    { id: 'PMAJ-2604', name: 'Pooja Rani', skill: 'ब्यूटी पार्लर', block: 'चोलापुर', date: '2026-08-22', subsidy: 10000, status: 'फील्ड निरीक्षण लंबित' },
    { id: 'PMAJ-2605', name: 'Manoj Paswan', skill: 'टू-व्हीलर मैकेनिक', block: 'हरहुआ', date: '2026-08-23', subsidy: 10000, status: 'समीक्षाधीन' },
    { id: 'PMAJ-2606', name: 'Geeta Kumari', skill: 'डेयरी फार्मिंग', block: 'पिंडरा', date: '2026-08-23', subsidy: 10000, status: 'स्वीकृत' },
    { id: 'PMAJ-2607', name: 'Vikas Sonkar', skill: 'मोबाइल रिपेयर शॉप', block: 'अराजीलाइन', date: '2026-08-24', subsidy: 10000, status: 'वितरित' }
  ]);

  const blockStats = [
    { name: 'पिंडरा', target: 600, applied: 540, disbursed: 420, fundUsed: '₹42,00,000' },
    { name: 'अराजीलाइन', target: 500, applied: 460, disbursed: 380, fundUsed: '₹38,00,000' },
    { name: 'काशी विद्यापीठ', target: 700, applied: 690, disbursed: 510, fundUsed: '₹51,00,000' },
    { name: 'चोलापुर', target: 450, applied: 380, disbursed: 310, fundUsed: '₹31,00,000' },
    { name: 'हरहुआ', target: 550, applied: 490, disbursed: 410, fundUsed: '₹41,00,000' },
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
    { sector: 'कृषि एवं पशुपालन (पोल्ट्री/डेयरी)', percent: 38, count: '1,240 अनुदान', color: 'bg-emerald-500' },
    { sector: 'वस्त्र एवं परिधान (सिलाई)', percent: 24, count: '780 अनुदान', color: 'bg-blue-500' },
    { sector: 'तकनीकी व्यवसाय (सोलर, मोबाइल, ऑटो)', percent: 20, count: '650 अनुदान', color: 'bg-amber-500' },
    { sector: 'खुदरा एवं सेवाएं (किराना, सैलून, सीएससी)', percent: 18, count: '590 अनुदान', color: 'bg-indigo-500' }
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
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">ज़िला प्रशासन नोड</span>
            <span className="flex items-center text-xs text-green-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              लाइव पोर्टल सिंक
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">पीएम-अजय (PM-AJAY) निगरानी एवं अनुदान वितरण डैशबोर्ड</h1>
          <p className="text-sm text-gray-500">प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना • वित्त वर्ष 2026–27</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-50 border border-gray-300 font-semibold text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Varanasi">ज़िला: वाराणसी (उ.प्र.)</option>
            <option value="Lucknow">ज़िला: लखनऊ (उ.प्र.)</option>
            <option value="Pune">ज़िला: पुणे (महा.)</option>
            <option value="Patna">ज़िला: पटना (बिहार)</option>
          </select>

          <button
            onClick={() => alert("Official District PM-AJAY Beneficiary Audit Report downloaded (CSV/PDF).")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-2"
          >
            <span>📥</span>
            <span>रिपोर्ट निर्यात करें</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">कुल आवेदन</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">3,260</h3>
          <p className="text-xs text-green-600 font-semibold mt-2 flex items-center">
            <span className="mr-1">▲ पिछले महीने से +14.8%</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">प्रत्यक्ष सब्सिडी वितरित</p>
          <h3 className="text-3xl font-black text-blue-600 mt-2">₹2.03 Cr</h3>
          <p className="text-xs text-gray-500 mt-2 font-medium">अधिकतम सीमा: ₹10,000 / प्रति व्यक्ति</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">लंबित फ़ील्ड समीक्षाएं</p>
          <h3 className="text-3xl font-black text-amber-500 mt-2">148</h3>
          <p className="text-xs text-amber-700 font-semibold mt-2">BDO सत्यापन आवश्यक</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ज़िला निधि उपयोग</p>
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
              <h2 className="text-lg font-bold text-slate-900">आवेदन प्राप्ति एवं अनुदान वितरण रुझान</h2>
              <p className="text-xs text-gray-400">मासिक लाभार्थी संख्या प्रगति (2026)</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-sm mr-1.5"></span> आवेदित</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-sm mr-1.5"></span> वितरित</span>
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
                    {t.month}: {t.applications} आवेदित | {t.disbursed} वितरित
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
            <h2 className="text-lg font-bold text-slate-900">क्षेत्रवार मांग हिस्सेदारी</h2>
            <p className="text-xs text-gray-400 mb-6">12 अनुमोदित व्यवसायों में वितरण</p>

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
        <h2 className="text-lg font-bold text-slate-900 mb-1">ब्लॉक-वार आवंटन एवं वितरण स्थिति</h2>
        <p className="text-xs text-gray-400 mb-4">उप-ज़िला प्रदर्शन विवरण</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">उप-ज़िला ब्लॉक</th>
                <th className="py-3 px-4">लक्षित लाभार्थी</th>
                <th className="py-3 px-4">आवेदन</th>
                <th className="py-3 px-4">स्वीकृत एवं वितरित</th>
                <th className="py-3 px-4">सब्सिडी उपयोग</th>
                <th className="py-3 px-4">लक्ष्य प्रगति</th>
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
            <h2 className="text-lg font-bold text-slate-900">लाभार्थी आवेदन सत्यापन कतार</h2>
            <p className="text-xs text-gray-400">प्रत्यक्ष अनुदान सत्यापन एवं अनुमोदन नियंत्रण</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="आईडी, नाम या कौशल द्वारा खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />

            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-3 py-2 font-semibold"
            >
              <option value="All">सभी ब्लॉक</option>
              <option value="पिंडरा">पिंडरा</option>
              <option value="अराजीलाइन">अराजीलाइन</option>
              <option value="काशी विद्यापीठ">काशी विद्यापीठ</option>
              <option value="चोलापुर">चोलापुर</option>
              <option value="हरहुआ">हरहुआ</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-3 py-2 font-semibold"
            >
              <option value="All">सभी स्थितियां</option>
              <option value="स्वीकृत">स्वीकृत</option>
              <option value="समीक्षाधीन">समीक्षाधीन</option>
              <option value="फील्ड निरीक्षण लंबित">फील्ड निरीक्षण लंबित</option>
              <option value="वितरित">वितरित</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">आवेदन आईडी</th>
                <th className="py-3 px-4">लाभार्थी का नाम</th>
                <th className="py-3 px-4">व्यवसाय / कौशल</th>
                <th className="py-3 px-4">ब्लॉक</th>
                <th className="py-3 px-4">आवेदन तिथि</th>
                <th className="py-3 px-4">अधिकतम सब्सिडी</th>
                <th className="py-3 px-4">वर्तमान स्थिति</th>
                <th className="py-3 px-4 text-center">कार्रवाई नियंत्रण</th>
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
                      b.status === 'स्वीकृत' ? 'bg-green-100 text-green-700' :
                      b.status === 'वितरित' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'समीक्षाधीन' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {b.status !== 'वितरित' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'वितरित')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                          title="Authorize ₹10,000 Direct Bank Transfer"
                        >
                          वितरित करें
                        </button>
                      )}
                      {b.status !== 'स्वीकृत' && b.status !== 'वितरित' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'स्वीकृत')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                        >
                          अनुमोदित करें
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(b.id, 'फील्ड निरीक्षण लंबित')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                      >
                        निरीक्षण करें
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
