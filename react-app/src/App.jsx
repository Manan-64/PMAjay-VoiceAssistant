import { useState } from 'react';
import { Mic, CheckSquare, MessageCircle, BarChart3, Globe } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [lang, setLang] = useState('en');

  const toggleLang = () => setLang(lang === 'en' ? 'hi' : 'en');

  const tabs = [
    { id: 'voice', label: lang === 'en' ? '🎙️ Voice Assistant (Kiosk)' : '🎙️ वॉयस असिस्टेंट (कियोस्क)' },
    { id: 'matches', label: lang === 'en' ? '📋 NSQF Skill & Grant Matches' : '📋 NSQF कौशल और अनुदान मिलान' },
    { id: 'whatsapp', label: lang === 'en' ? '💬 WhatsApp Mode' : '💬 व्हाट्सएप मोड' },
    { id: 'admin', label: lang === 'en' ? '📊 District Admin & AAP Planning' : '📊 जिला प्रशासन और AAP योजना' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 w-full">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-orange-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Emblem Placeholder */}
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-green-600 p-1 flex-shrink-0">
              <div className="text-[10px] text-slate-800 font-bold text-center leading-tight">Govt<br/>Emblem</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-orange-500">PM-AJAY</span> Sahayata (सहायता)
              </h1>
              <p className="text-sm text-slate-300">Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</p>
            </div>
          </div>
          
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Globe className="w-4 h-4 text-green-500" />
            <span className="font-medium">{lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const activeClasses = "bg-white text-orange-700 border-t-2 border-l border-r border-orange-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] -mb-[17px] z-10";
            const inactiveClasses = "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent";
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={"px-4 py-2 rounded-t-lg font-medium transition-colors " + (isActive ? activeClasses : inactiveClasses)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg border border-slate-200 p-6 min-h-[500px]">
          {activeTab === 'voice' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">
                {lang === 'en' ? 'Voice Assistant Active' : 'वॉयस असिस्टेंट सक्रिय'}
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                {lang === 'en' 
                  ? 'Speak your queries regarding grants, skill training, or eligibility. The AI is listening...'
                  : 'अनुदान, कौशल प्रशिक्षण या पात्रता के संबंध में अपने प्रश्न बोलें। एआई सुन रहा है...'}
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">
                {lang === 'en' ? 'Start Recording' : 'रिकॉर्डिंग शुरू करें'}
              </button>
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CheckSquare className="text-orange-600" />
                {lang === 'en' ? 'NSQF Skill & Grant Matches' : 'NSQF कौशल और अनुदान मिलान'}
              </h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 border border-slate-200 rounded-lg hover:border-green-500 transition-colors flex justify-between items-center bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {lang === 'en' ? 'Data Entry Operator (Level 4)' : 'डेटा एंट्री ऑपरेटर (स्तर 4)'}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">Status: Eligible for 100% Grant</p>
                    </div>
                    <button className="text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded font-medium text-sm">
                      {lang === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <MessageCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">WhatsApp Integration</h2>
              <p className="text-slate-600 max-w-md text-center mb-6">
                Connect directly to the PM-AJAY WhatsApp bot to query application status or request forms seamlessly.
              </p>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-800 border border-slate-300">
                Send "Hi" to +91 98765 43210
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-orange-600" />
                {lang === 'en' ? 'District Admin Dashboard' : 'जिला प्रशासन डैशबोर्ड'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <div className="text-orange-800 font-medium mb-1">Total Beneficiaries</div>
                  <div className="text-3xl font-bold text-orange-600">12,450</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-green-800 font-medium mb-1">Funds Disbursed</div>
                  <div className="text-3xl font-bold text-green-600">₹4.2 Cr</div>
                </div>
                <div className="bg-slate-100 p-6 rounded-lg border border-slate-300">
                  <div className="text-slate-700 font-medium mb-1">Pending Applications</div>
                  <div className="text-3xl font-bold text-slate-800">842</div>
                </div>
              </div>
              <div className="bg-slate-50 h-64 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                [ Adarsh Gram Yojana (AAP) Planning Chart Placeholder ]
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
