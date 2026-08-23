import { useState, useRef, useEffect } from 'react';
import { Mic, CheckSquare, MessageCircle, BarChart3, Globe, Square, Play, Zap, Bot, ChevronRight, Check } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [lang, setLang] = useState('en');

  // --- Voice Assistant State ---
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '', 4: '' });
  const [interpretation, setInterpretation] = useState('');
  
  const recognitionRef = useRef(null);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const tabs = [
    { id: 'voice', label: lang === 'en' ? '🎙️ Voice Assistant' : '🎙️ वॉयस असिस्टेंट' },
    { id: 'matches', label: lang === 'en' ? '📋 Skill & Grant Matches' : '📋 कौशल और अनुदान' },
    { id: 'whatsapp', label: lang === 'en' ? '💬 WhatsApp Mode' : '💬 व्हाट्सएप मोड' },
    { id: 'admin', label: lang === 'en' ? '📊 District Admin' : '📊 जिला प्रशासन' },
  ];

  const voiceSteps = [
    {
      id: 1,
      en: "What is your current work or traditional family skill?",
      hi: "आपका वर्तमान कार्य या पारंपरिक पारिवारिक कौशल क्या है?"
    },
    {
      id: 2,
      en: "What is your education qualification? Do you have a BPL or Antyodaya Ration card?",
      hi: "आपकी शिक्षा योग्यता क्या है? क्या आपके पास बीपीएल या अंत्योदय राशन कार्ड है?"
    },
    {
      id: 3,
      en: "Can you travel for training, or do you need it in your local village?",
      hi: "क्या आप प्रशिक्षण के लिए यात्रा कर सकते हैं, या आपको अपने स्थानीय गांव में इसकी आवश्यकता है?"
    },
    {
      id: 4,
      en: "What is your goal: starting a self-employment enterprise or getting a wage job?",
      hi: "आपका लक्ष्य क्या है: स्वरोजगार उद्यम शुरू करना या वेतन वाली नौकरी प्राप्त करना?"
    }
  ];

  // TTS Helper
  const speakQuestion = (stepIndex) => {
    window.speechSynthesis.cancel();
    const step = voiceSteps[stepIndex - 1];
    if (!step) return;
    const text = lang === 'en' ? step.en : step.hi;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  // Play current question if step changes (and not in demo fast-forward)
  useEffect(() => {
    if (activeTab === 'voice' && !isRecording && currentStep <= 4) {
      speakQuestion(currentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, lang, activeTab]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser. Try Chrome.");
      return;
    }
    
    setTranscript('');
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      
      // Simple mock semantic translation based on keywords
      const lower = finalTranscript.toLowerCase();
      if (lower.includes('bijli') || lower.includes('light') || lower.includes('electricity') || lower.includes('solar')) {
        setInterpretation('Sector: Green Energy | Target NSQF: Solar PV Installer Level 4');
      } else if (lower.includes('kapda') || lower.includes('silai') || lower.includes('tailor') || lower.includes('sewing')) {
        setInterpretation('Sector: Apparel | Target NSQF: Self Employed Tailor Level 3');
      } else if (lower.includes('kheti') || lower.includes('murgi') || lower.includes('farm') || lower.includes('poultry')) {
        setInterpretation('Sector: Agriculture | Target NSQF: Small Poultry Farmer Level 3');
      } else if (finalTranscript.length > 5) {
        setInterpretation('Analyzing intent...');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    
    // Save answer and auto-advance
    setAnswers(prev => ({ ...prev, [currentStep]: transcript || '(Audio Captured)' }));
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setTranscript('');
      setInterpretation('');
    } else {
      setCurrentStep(5); // 5 means Done
      setInterpretation('Interview Complete! Processing matches...');
    }
  };

  // Quick Demo Scenarios
  const runScenario = (scenarioId) => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    
    if (scenarioId === 'A') {
      setAnswers({
        1: lang === 'en' ? "I am a farmer, my crops were ruined by rain." : "मैं एक किसान हूँ, बारिश से मेरी फसलें बर्बाद हो गईं।",
        2: lang === 'en' ? "8th pass. I have Antyodaya ration card." : "8वीं पास। मेरे पास अंत्योदय राशन कार्ड है।",
        3: lang === 'en' ? "I want to stay in my village." : "मैं अपने गांव में ही रहना चाहता हूँ।",
        4: lang === 'en' ? "I want to start a poultry farm." : "मैं मुर्गी पालन शुरू करना चाहता हूँ।"
      });
      setTranscript(lang === 'en' ? "I want to start a poultry farm." : "मैं मुर्गी पालन शुरू करना चाहता हूँ।");
      setInterpretation("Sector: Agriculture | Target NSQF: Small Poultry Farmer Level 3");
    } else if (scenarioId === 'B') {
      setAnswers({
        1: lang === 'en' ? "I do sewing and stitching at home." : "मैं घर पर सिलाई का काम करती हूँ।",
        2: lang === 'en' ? "10th pass. BPL card holder." : "10वीं पास। बीपीएल कार्ड धारक।",
        3: lang === 'en' ? "Local block center is fine." : "स्थानीय ब्लॉक केंद्र ठीक है।",
        4: lang === 'en' ? "Self employment, want a boutique." : "स्वरोजगार, एक बुटीक चाहिए।"
      });
      setTranscript(lang === 'en' ? "Self employment, want a boutique." : "स्वरोजगार, एक बुटीक चाहिए।");
      setInterpretation("Sector: Apparel | Target NSQF: Self Employed Tailor Level 3");
    } else if (scenarioId === 'C') {
      setAnswers({
        1: lang === 'en' ? "I repair basic electronics." : "मैं बुनियादी इलेक्ट्रॉनिक्स की मरम्मत करता हूँ।",
        2: lang === 'en' ? "12th pass. No ration card." : "12वीं पास। राशन कार्ड नहीं।",
        3: lang === 'en' ? "I can travel to the district center." : "मैं जिला केंद्र की यात्रा कर सकता हूँ।",
        4: lang === 'en' ? "I want a wage job in solar tech." : "मुझे सोलर टेक में वेतन वाली नौकरी चाहिए।"
      });
      setTranscript(lang === 'en' ? "I want a wage job in solar tech." : "मुझे सोलर टेक में वेतन वाली नौकरी चाहिए।");
      setInterpretation("Sector: Green Energy | Target NSQF: Solar PV Installer Level 4");
    }
    setCurrentStep(5);
  };

  const resetInterview = () => {
    setAnswers({ 1: '', 2: '', 3: '', 4: '' });
    setTranscript('');
    setInterpretation('');
    setCurrentStep(1);
    speakQuestion(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 w-full">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-orange-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
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
          
          {/* VOICE ASSISTANT TAB */}
          {activeTab === 'voice' && (
            <div className="flex flex-col h-full max-w-4xl mx-auto">
              
              {/* Quick Scenarios Drawer */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Quick Demo Scenarios (SIH Test)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => runScenario('A')} className="text-xs font-medium bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 px-3 py-2 rounded shadow-sm transition-colors">
                    A: Rain-affected Farmer
                  </button>
                  <button onClick={() => runScenario('B')} className="text-xs font-medium bg-white border border-slate-300 hover:border-green-500 hover:text-green-600 px-3 py-2 rounded shadow-sm transition-colors">
                    B: Rural Homemaker (Tailoring)
                  </button>
                  <button onClick={() => runScenario('C')} className="text-xs font-medium bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 px-3 py-2 rounded shadow-sm transition-colors">
                    C: Youth (Solar Tech Job)
                  </button>
                  {currentStep === 5 && (
                    <button onClick={resetInterview} className="text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 px-3 py-2 rounded shadow-sm transition-colors ml-auto">
                      Reset Interview
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4].map(step => {
                  const isCompleted = step < currentStep;
                  const isCurrent = step === currentStep;
                  return (
                    <div key={step} className={"w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors " + (
                      isCompleted ? "bg-green-500 border-green-500 text-white" :
                      isCurrent ? "bg-orange-500 border-orange-500 text-white ring-4 ring-orange-200" :
                      "bg-white border-slate-300 text-slate-400"
                    )}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step}
                    </div>
                  );
                })}
              </div>

              {/* Main Interview Area */}
              {currentStep <= 4 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-8">
                  
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-tight max-w-2xl">
                    {lang === 'en' ? voiceSteps[currentStep - 1].en : voiceSteps[currentStep - 1].hi}
                  </h2>
                  
                  <div className="relative">
                    <button 
                      onClick={toggleRecording}
                      className={"flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-all transform hover:scale-105 " + (
                        isRecording 
                          ? "bg-red-500 animate-pulse ring-8 ring-red-200" 
                          : "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-10 h-10" />}
                    </button>
                    {isRecording && (
                      <div className="absolute -inset-4 border-2 border-red-500 rounded-full animate-ping opacity-20"></div>
                    )}
                  </div>

                  <p className={"font-medium text-lg " + (isRecording ? "text-red-500" : "text-slate-500")}>
                    {isRecording 
                      ? (lang === 'en' ? 'Recording... Tap to Stop' : 'रिकॉर्डिंग हो रही है... रोकने के लिए टैप करें') 
                      : (lang === 'en' ? 'Tap Microphone to Speak' : 'बोलने के लिए माइक्रोफ़ोन टैप करें')}
                  </p>

                  {/* Live Transcript & Interpretation */}
                  {(transcript || interpretation) && (
                    <div className="w-full max-w-2xl mt-8 text-left space-y-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner min-h-[80px]">
                        <p className="text-sm text-slate-400 mb-1 font-medium flex items-center gap-1">
                          <Mic className="w-3 h-3" /> Live Transcript
                        </p>
                        <p className="text-slate-800 text-lg">{transcript || "..."}</p>
                      </div>
                      
                      {interpretation && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                          <Bot className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-orange-800 uppercase mb-1">AI Semantic Translator</p>
                            <p className="text-sm font-medium text-orange-900">{interpretation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                /* Completed State */
                <div className="py-12 text-center animate-in fade-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckSquare className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    {lang === 'en' ? 'Profile Completed Successfully!' : 'प्रोफ़ाइल सफलतापूर्वक पूरी हुई!'}
                  </h2>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    {lang === 'en' 
                      ? 'Based on your interview, the AI has prepared your skill mapping. Generating NSQF matches and grant eligibility...' 
                      : 'आपके साक्षात्कार के आधार पर, एआई ने आपका कौशल मानचित्र तैयार किया है। NSQF मिलान उत्पन्न हो रहा है...'}
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-left max-w-2xl mx-auto space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Captured Interview Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 block text-xs uppercase">Step 1: Skill/Work</span><strong className="text-slate-800">{answers[1]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 2: Education & BPL</span><strong className="text-slate-800">{answers[2]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 3: Mobility</span><strong className="text-slate-800">{answers[3]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 4: Goal</span><strong className="text-slate-800">{answers[4]}</strong></div>
                    </div>
                    {interpretation && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 font-medium text-sm flex gap-2 items-center">
                        <Zap className="w-4 h-4 flex-shrink-0" />
                        Final AI Determination: {interpretation}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('matches')} 
                    className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors inline-flex items-center gap-2"
                  >
                    {lang === 'en' ? 'View Recommended Grants' : 'अनुशंसित अनुदान देखें'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* OTHER TABS */}
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
