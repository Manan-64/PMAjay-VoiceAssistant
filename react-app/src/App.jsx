import { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, CheckSquare, MessageCircle, BarChart3, Globe, Square, Zap, Bot, ChevronRight, ChevronDown, Check, Volume2, Wallet, Building, PiggyBank, Briefcase, Scissors, Leaf, Laptop, IndianRupee, Phone, MoreVertical, Play, Smile, Paperclip, Camera, BadgeCheck } from 'lucide-react';
import { nsqfData } from './data/nsqfData';
import { analyzeBeneficiarySituation } from './lib/aiMatcher';
import { speakWithVoice } from './lib/ttsService';
import { translations, audioTemplates } from './data/translations';
import WhatsAppMode from './components/WhatsAppMode';
import DistrictAdmin from './components/DistrictAdmin';
import './App.css';

const LANGUAGES = {
  'en-IN': { name: 'English', loading: 'AI is analyzing beneficiary context...', aiTitle: 'AI Recommended Matches', wait: 'Recording audio...' },
  'hi-IN': { name: 'हिन्दी (Hindi)', loading: 'एआई लाभार्थी के संदर्भ का विश्लेषण कर रहा है...', aiTitle: 'AI अनुशंसित NSQF मिलान', wait: 'ऑडियो रिकॉर्ड हो रहा है...' },
  'mr-IN': { name: 'मराठी (Marathi)', loading: 'AI लाभार्थ्यांच्या संदर्भाचे विश्लेषण करत आहे...', aiTitle: 'AI शिफारस केलेले सामने', wait: 'ऑडिओ रेकॉर्ड करत आहे...' },
  'ta-IN': { name: 'தமிழ் (Tamil)', loading: 'AI பயனாளியின் சூழலை பகுப்பாய்வு செய்கிறது...', aiTitle: 'AI பரிந்துரைக்கப்பட்ட போட்டிகள்', wait: 'ஆடியோ பதிவு செய்யப்படுகிறது...' },
  'bn-IN': { name: 'বাংলা (Bengali)', loading: 'এআই সুবিধাভোগীর প্রেক্ষাপট বিশ্লেষণ করছে...', aiTitle: 'AI প্রস্তাবিত মিলগুলি', wait: 'অডিও রেকর্ড করা হচ্ছে...' },
  'te-IN': { name: 'తెలుగు (Telugu)', loading: 'AI లబ్ధిదారుని సందర్భాన్ని విశ్లేషిస్తోంది...', aiTitle: 'AI సిఫార్సు చేసిన సరిపోలికలు', wait: 'ఆడియో రికార్డ్ చేయబడుతోంది...' },
  'gu-IN': { name: 'ગુજરાતી (Gujarati)', loading: 'AI લાભાર્થીના સંદર્ભનું વિશ્લેષણ કરી રહ્યું છે...', aiTitle: 'AI ભલામણ કરેલ મેચ', wait: 'ઑડિઓ રેકોર્ડ થઈ રહ્યો છે...' }
};

const questions = {
  'en-IN': {
    1: "What kind of work or skills do you currently have, or what work do you want to do?",
    2: "What is your education level, and do you have a ration or BPL card?",
    3: "Do you want to work in your village or are you open to relocating?",
    4: "Do you want to start your own micro-enterprise or look for a job?"
  },
  'hi-IN': {
    1: "आप अभी क्या काम करते हैं या आपके पास क्या हुनर है, और आप क्या काम करना चाहते हैं?",
    2: "आपकी पढ़ाई कहाँ तक हुई है, और क्या आपके पास राशन कार्ड या BPL कार्ड है?",
    3: "क्या आप अपने गाँव में ही काम करना चाहते हैं या बाहर जा सकते हैं?",
    4: "आप अपना खुद का काम शुरू करना चाहते हैं या नौकरी करना चाहते हैं?"
  },
  'mr-IN': {
    1: "तुम्ही सध्या काय काम करता किंवा तुमच्याकडे कोणते कौशल्य आहे?",
    2: "तुमची शैक्षणिक पात्रता काय आहे आणि तुमच्याकडे रेशन किंवा बीपीएल कार्ड आहे का?",
    3: "तुम्हाला तुमच्या गावातच काम करायचे आहे की बाहेर जाण्याची तुमची तयारी आहे?",
    4: "तुम्हाला स्वतःचा व्यवसाय सुरू करायचा आहे की नोकरी शोधायची आहे?"
  },
  'ta-IN': {
    1: "நீங்கள் தற்போது என்ன வேலை செய்கிறீர்கள் அல்லது என்ன வேலை செய்ய விரும்புகிறீர்கள்?",
    2: "உங்கள் கல்வித்தகுதி என்ன, உங்களிடம் ரேஷன் அல்லது பிபிஎல் கார்டு உள்ளதா?",
    3: "உங்கள் கிராமத்திலேயே வேலை செய்ய விரும்புகிறீர்களா அல்லது வெளியூர் செல்ல தயாரா?",
    4: "நீங்கள் சொந்தமாக தொழில் தொடங்க விரும்புகிறீர்களா அல்லது வேலை தேடுகிறீர்களா?"
  },
  'bn-IN': {
    1: "আপনি বর্তমানে কী কাজ করেন বা আপনার কী দক্ষতা আছে?",
    2: "আপনার শিক্ষাগত যোগ্যতা কী, এবং আপনার কি রেশন বা বিপিএল কার্ড আছে?",
    3: "আপনি কি আপনার গ্রামেই কাজ করতে চান নাকি বাইরে যেতে প্রস্তুত?",
    4: "আপনি কি নিজের ব্যবসা শুরু করতে চান নাকি চাকরি খুঁজছেন?"
  },
  'te-IN': {
    1: "మీరు ప్రస్తుతం ఎలాంటి పని చేస్తున్నారు లేదా ఎలాంటి నైపుణ్యాలు కలిగి ఉన్నారు?",
    2: "మీ విద్యాభ్యాసం ఎంతవరకు జరిగింది, మీకు రేషన్ లేదా BPL కార్డు ఉందా?",
    3: "మీరు మీ గ్రామంలోనే పని చేయాలనుకుంటున్నారా లేదా బయటకు వెళ్లడానికి సిద్ధంగా ఉన్నారా?",
    4: "మీరు సొంతంగా వ్యాపారం ప్రారంభించాలనుకుంటున్నారా లేదా ఉద్యోగం కోసం చూస్తున్నారా?"
  },
  'gu-IN': {
    1: "તમે હાલમાં શું કામ કરો છો અથવા તમારી પાસે શું કૌશલ્ય છે?",
    2: "તમારું શિક્ષણ સ્તર શું છે, અને શું તમારી પાસે રેશન અથવા બીપીએલ કાર્ડ છે?",
    3: "શું તમે તમારા ગામમાં જ કામ કરવા માંગો છો કે બહાર જવા માટે તૈયાર છો?",
    4: "શું તમે પોતાનો વ્યવસાય શરૂ કરવા માંગો છો કે નોકરી શોધવા માંગો છો?"
  }
};

const uiDict = {
  'en-IN': {
    budgetTitle: "PM-AJAY GIA ENTERPRISE BUDGET",
    totalCost: "TOTAL SETUP COST",
    subsidy: "GOVT SUBSIDY",
    loan: "BANK LOAN / SELF",
    applyBtn: "Apply for PM-AJAY GIA",
    listenBtn: "Listen in Regional Voice",
    sectorLabel: "Sector"
  },
  'hi-IN': {
    budgetTitle: "पीएम-अजय जीआईए उद्यम बजट",
    totalCost: "कुल लागत",
    subsidy: "सरकारी सब्सिडी",
    loan: "बैंक लोन / स्वयं",
    applyBtn: "पीएम-अजय के लिए आवेदन करें",
    listenBtn: "क्षेत्रीय भाषा में सुनें",
    sectorLabel: "क्षेत्र"
  },
  'mr-IN': {
    budgetTitle: "पीएम-अजय जीआयए उद्योग बजेट",
    totalCost: "एकूण खर्च",
    subsidy: "सरकारी अनुदान",
    loan: "बँक कर्ज / स्वतः",
    applyBtn: "पीएम-अजय साठी अर्ज करा",
    listenBtn: "प्रादेशिक भाषेत ऐका",
    sectorLabel: "क्षेत्र"
  },
  'ta-IN': {
    budgetTitle: "PM-AJAY GIA நிறுவன பட்ஜெட்",
    totalCost: "மொத்த அமைப்பு செலவு",
    subsidy: "அரசு மானியம்",
    loan: "வங்கி கடன் / சுய",
    applyBtn: "PM-AJAY க்கு விண்ணப்பிக்கவும்",
    listenBtn: "பிராந்திய மொழியில் கேளுங்கள்",
    sectorLabel: "துறை"
  },
  'bn-IN': {
    budgetTitle: "পিএম-অজয় জিআইএ এন্টারপ্রাইজ বাজেট",
    totalCost: "মোট খরচ",
    subsidy: "সরকারি ভর্তুকি",
    loan: "ব্যাংক ঋণ / নিজস্ব",
    applyBtn: "পিএম-অজয়ের জন্য আবেদন করুন",
    listenBtn: "আঞ্চলিক ভাষায় শুনুন",
    sectorLabel: "খাত"
  },
  'te-IN': {
    budgetTitle: "PM-AJAY GIA ఎంటర్‌ప్రైజ్ బడ్జెట్",
    totalCost: "మొత్తం ఖర్చు",
    subsidy: "ప్రభుత్వ సబ్సిడీ",
    loan: "బ్యాంకు రుణం / సొంతం",
    applyBtn: "PM-AJAY కోసం దరఖాస్తు చేయండి",
    listenBtn: "ప్రాంతీయ భాషలో వినండి",
    sectorLabel: "రంగం"
  },
  'gu-IN': {
    budgetTitle: "પીએમ-અજય જીઆઈએ એન્ટરપ્રાઇઝ બજેટ",
    totalCost: "કુલ ખર્ચ",
    subsidy: "સરકારી સબસિડી",
    loan: "બેંક લોન / સ્વયં",
    applyBtn: "પીએમ-અજય માટે અરજી કરો",
    listenBtn: "પ્રાદેશિક ભાષામાં સાંભળો",
    sectorLabel: "ક્ષેત્ર"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [currentLanguage, setCurrentLanguage] = useState('hi-IN');

  // --- Voice Assistant State ---
  const [hasStarted, setHasStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '', 4: '' });
  const [interpretation, setInterpretation] = useState('');
  
  // --- AI Matches State ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedTradeIds, setMatchedTradeIds] = useState(nsqfData.map(d => d.id));
  const [lastAnalyzedTranscript, setLastAnalyzedTranscript] = useState('');
  
  // --- WhatsApp Mode State ---
  const [whatsappMessages, setWhatsappMessages] = useState([
    { id: 1, sender: 'ai', type: 'audio', duration: '0:05', textSnippet: 'नमस्ते! मैं PM-AJAY वॉयस बॉट हूँ। अपना नाम और काम बताएँ।' }
  ]);
  const [isWhatsappRecording, setIsWhatsappRecording] = useState(false);

  const [expandedCard, setExpandedCard] = useState(null);

  const recognitionRef = useRef(null);

  const t = translations[currentLanguage] || translations['en-IN'];

  const tabs = [
    { id: 'voice', label: t.tabVoice },
    { id: 'matches', label: t.tabGrants },
    { id: 'whatsapp', label: t.tabWhatsapp },
    { id: 'admin', label: t.tabAdmin },
  ];

  // Auto-trigger TTS when navigating to a step (only when started)
  useEffect(() => {
    if (activeTab === 'voice' && hasStarted && currentStep <= 4) {
      const textToSpeak = questions[currentLanguage]?.[currentStep] || questions['en-IN'][currentStep];
      
      // Stop mic if running
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      
      setIsSpeaking(true);
      setTranscript('');
      setInterpretation('');
      
      speakWithVoice(textToSpeak, currentLanguage, () => {
        // TTS Finished. We DO NOT start the microphone automatically anymore.
        setIsSpeaking(false);
      });
    }
  }, [currentStep, hasStarted, currentLanguage, activeTab]);

  const toggleRecording = () => {
    if (isRecording) {
      advanceStep();
    } else {
      startRecognition();
    }
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }
    
    setTranscript('');
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      
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

  const startIntro = () => {
    setHasStarted(true);
  };

  const advanceStep = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    
    setAnswers(prev => ({ ...prev, [currentStep]: transcript || '(Audio Captured)' }));
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(5);
      setInterpretation('Interview Complete! Processing matches...');
    }
  };

  const handlePlayAudio = (trade) => {
    let template = audioTemplates[currentLanguage] || audioTemplates['en-IN'];
    const jobName = trade.localTitle?.[currentLanguage] || trade.title;
    template = template.replace('[JOB]', jobName)
                       .replace('[TOTAL]', trade.totalSetupCost)
                       .replace('[SUBSIDY]', trade.subsidyAmount)
                       .replace('[SELF]', trade.selfContribution);
    
    // Optional: could add an isSpeaking state, but speakWithVoice handles it
    speakWithVoice(template, currentLanguage);
  };

  const fullTranscript = useMemo(() => {
    return `Step 1 (Work): ${answers[1]}\nStep 2 (Edu/BPL): ${answers[2]}\nStep 3 (Mobility): ${answers[3]}\nStep 4 (Goal): ${answers[4]}`.trim();
  }, [answers]);

  useEffect(() => {
    if (activeTab === 'matches') {
      const hasAnswers = answers[1] || answers[2] || answers[3] || answers[4];
      if (hasAnswers && fullTranscript !== lastAnalyzedTranscript) {
        console.log("TRACE 1: Tab 2 Received Transcript:", fullTranscript);
        console.log("TRACE 2: Loaded NSQF Data Length:", nsqfData.length);
        
        setIsAnalyzing(true);
        setLastAnalyzedTranscript(fullTranscript);
        analyzeBeneficiarySituation(fullTranscript, nsqfData).then((matchedIds) => {
          setMatchedTradeIds(matchedIds);
          setIsAnalyzing(false);
        });
      }
    }
  }, [activeTab, fullTranscript, lastAnalyzedTranscript, answers]);

  const runScenario = (scenarioId) => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    setHasStarted(false);
    
    if (scenarioId === 'A') {
      setAnswers({
        1: "मैं एक किसान हूँ, बारिश से मेरी फसलें बर्बाद हो गईं।",
        2: "8वीं पास। मेरे पास अंत्योदय राशन कार्ड है।",
        3: "मैं अपने गांव में ही रहना चाहता हूँ।",
        4: "मैं मुर्गी पालन शुरू करना चाहता हूँ।"
      });
      setTranscript("मैं मुर्गी पालन शुरू करना चाहता हूँ।");
      setInterpretation("Sector: Agriculture | Target NSQF: Small Poultry Farmer Level 3");
    } else if (scenarioId === 'B') {
      setAnswers({
        1: "मैं घर पर सिलाई का काम करती हूँ।",
        2: "10वीं पास। बीपीएल कार्ड धारक।",
        3: "स्थानीय ब्लॉक केंद्र ठीक है।",
        4: "स्वरोजगार, एक बुटीक चाहिए।"
      });
      setTranscript("स्वरोजगार, एक बुटीक चाहिए।");
      setInterpretation("Sector: Apparel | Target NSQF: Self Employed Tailor Level 3");
    } else if (scenarioId === 'C') {
      setAnswers({
        1: "मैं बुनियादी इलेक्ट्रॉनिक्स की मरम्मत करता हूँ।",
        2: "12वीं पास। राशन कार्ड नहीं।",
        3: "मैं जिला केंद्र की यात्रा कर सकता हूँ।",
        4: "मुझे सोलर टेक में वेतन वाली नौकरी चाहिए।"
      });
      setTranscript("मुझे सोलर टेक में वेतन वाली नौकरी चाहिए।");
      setInterpretation("Sector: Green Energy | Target NSQF: Solar PV Installer Level 4");
    }
    setCurrentStep(5);
  };

  const resetInterview = () => {
    window.speechSynthesis.cancel();
    setHasStarted(false);
    setIsSpeaking(false);
    setIsRecording(false);
    setAnswers({ 1: '', 2: '', 3: '', 4: '' });
    setTranscript('');
    setInterpretation('');
    setLastAnalyzedTranscript('');
    setMatchedTradeIds(nsqfData.map(d => d.id));
    setCurrentStep(1);
  };

  const handleWhatsappRecord = () => {
    if (isWhatsappRecording) return;
    setIsWhatsappRecording(true);
    
    setTimeout(() => {
      setIsWhatsappRecording(false);
      setWhatsappMessages(prev => [...prev, { id: Date.now(), sender: 'user', type: 'audio', duration: '0:06' }]);
      
      setTimeout(() => {
        setWhatsappMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'ai', 
          type: 'audio', 
          duration: '0:12', 
          textSnippet: 'आपकी जानकारी मिल गई है। आप टेलरिंग के लिए पात्र हैं। सब्सिडी: ₹10,000 (Matched: Tailor, Subsidy: ₹10,000)' 
        }]);
      }, 1500);
    }, 2000);
  };

  const getDomainIcon = (domain) => {
    if (domain.includes('Electricity')) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (domain.includes('Women')) return <Scissors className="w-5 h-5 text-pink-500" />;
    if (domain.includes('Agriculture')) return <Leaf className="w-5 h-5 text-green-500" />;
    if (domain.includes('Digital')) return <Laptop className="w-5 h-5 text-blue-500" />;
    return <Briefcase className="w-5 h-5 text-slate-500" />;
  };

  const filteredNsqfData = nsqfData.filter(trade => 
    matchedTradeIds.map(String).includes(String(trade.id))
  );

  const uiText = LANGUAGES[currentLanguage] || LANGUAGES['en-IN'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 w-full">
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-green-600 p-1 flex-shrink-0">
              <div className="text-[10px] text-slate-800 font-bold text-center leading-tight">Govt<br/>Emblem</div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                <span className="text-orange-500">PM-AJAY</span> Sahayata
              </h1>
              <p className="text-sm text-slate-300 font-medium">{t.appSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-600 focus-within:border-green-500 transition-colors shadow-inner">
            <Globe className="w-4 h-4 text-green-500" />
            <select 
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
                if (hasStarted && currentStep <= 4) {
                  // If they change language mid-interview, repeat the question in the new language
                  const textToSpeak = questions[e.target.value]?.[currentStep] || questions['en-IN'][currentStep];
                  setIsSpeaking(true);
                  speakWithVoice(textToSpeak, e.target.value, () => setIsSpeaking(false));
                }
              }}
              className="bg-transparent text-white outline-none font-medium text-sm cursor-pointer appearance-none min-w-[120px]"
            >
              {Object.entries(LANGUAGES).map(([code, config]) => (
                <option key={code} value={code} className="bg-slate-800 text-white">
                  {config.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const activeClasses = "border-b-4 border-blue-600 text-blue-700 font-bold";
            const inactiveClasses = "text-gray-500 hover:text-gray-800 border-b-4 border-transparent font-medium";
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 whitespace-nowrap transition-colors flex items-center gap-2 ${isActive ? activeClasses : inactiveClasses}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 w-full pb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 min-h-[500px]">
          
          {activeTab === 'voice' && (
            <div className="flex flex-col h-full max-w-4xl mx-auto">
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-3 mb-8 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 flex-shrink-0">
                  <span className="text-lg">🛠️</span> {t.demoPanelTitle}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full">
                  <button onClick={() => runScenario('A')} className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 px-2 py-1 rounded-full transition-colors">
                    {t.demoFarmer}
                  </button>
                  <button onClick={() => runScenario('B')} className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-300 px-2 py-1 rounded-full transition-colors">
                    {t.demoTailor}
                  </button>
                  <button onClick={() => runScenario('C')} className="text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 px-2 py-1 rounded-full transition-colors">
                    {t.demoTech}
                  </button>
                  {(hasStarted || currentStep === 5) && (
                    <button onClick={resetInterview} className="text-[10px] font-bold uppercase bg-slate-700 text-white hover:bg-slate-900 px-2 py-1 rounded-full transition-colors ml-auto">
                      {t.demoReset}
                    </button>
                  )}
                </div>
              </div>

              {!hasStarted && currentStep === 1 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95">
                  <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                    <Mic className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.voiceEntryTitle}</h2>
                  <p className="text-slate-600 mb-8 max-w-lg">
                    {t.voiceEntrySub}
                  </p>
                  <button 
                    onClick={startIntro}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 flex items-center gap-3 text-lg"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    {t.startBtn}
                  </button>
                </div>
              ) : currentStep <= 4 ? (
                <>
                  <div className="flex justify-between items-center mb-12 relative animate-in fade-in max-w-2xl mx-auto w-full">
                    <div className="absolute left-0 top-6 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
                    {[
                      { id: 1, icon: "🛠️", label: "Skills" },
                      { id: 2, icon: "🎓", label: "Edu" },
                      { id: 3, icon: "📍", label: "Location" },
                      { id: 4, icon: "🚀", label: "Goal" }
                    ].map(stepObj => {
                      const step = stepObj.id;
                      const isCompleted = step < currentStep;
                      const isCurrent = step === currentStep;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={"w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all shadow-sm " + (
                            isCompleted ? "bg-green-500 border-green-500 text-white" :
                            isCurrent ? "bg-orange-500 border-orange-500 text-white ring-4 ring-orange-200 scale-110" :
                            "bg-white border-slate-300 text-slate-400"
                          )}>
                            {isCompleted ? <Check className="w-6 h-6" /> : stepObj.icon}
                          </div>
                          <span className={"text-xs font-bold uppercase tracking-wide " + (isCurrent ? "text-orange-600" : isCompleted ? "text-green-600" : "text-slate-400")}>
                            {stepObj.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-8 animate-in fade-in">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 leading-relaxed max-w-3xl drop-shadow-sm">
                      {questions[currentLanguage]?.[currentStep] || questions['en-IN'][currentStep]}
                    </h2>
                    
                    <div className="relative mt-4 mb-2">
                      <button 
                        onClick={toggleRecording}
                        disabled={isSpeaking}
                        className={"flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white transition-all font-bold text-lg " + (
                          isSpeaking 
                            ? "bg-slate-400 cursor-not-allowed opacity-80 shadow-md" 
                            : isRecording 
                              ? "bg-red-500 ring-4 ring-red-200 shadow-[0_0_20px_rgba(239,68,68,0.6)] transform scale-105" 
                              : "bg-green-600 hover:bg-green-700 shadow-lg transform hover:scale-105"
                        )}
                      >
                        {isSpeaking ? (
                          <>
                            <Volume2 className="w-6 h-6 animate-pulse" />
                            AI Speaking...
                          </>
                        ) : isRecording ? (
                          <>
                            <div className="relative flex items-center justify-center">
                              <span className="absolute inline-flex h-8 w-8 rounded-full bg-white opacity-50 animate-ping"></span>
                              <Mic className="w-6 h-6 relative z-10 animate-pulse" />
                            </div>
                            {t.micListening}
                          </>
                        ) : (
                          <>
                            <Mic className="w-6 h-6" />
                            {t.micTap}
                          </>
                        )}
                      </button>
                      
                      {isRecording && !isSpeaking && (
                        <div className="absolute -inset-4 border-4 border-red-500 rounded-full animate-ping opacity-30 pointer-events-none"></div>
                      )}
                    </div>

                    {(transcript || interpretation) && (
                      <div className="w-full max-w-2xl mt-8 text-left space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner min-h-[80px]">
                          <p className="text-sm text-slate-400 mb-1 font-medium flex items-center gap-1">
                            <Mic className="w-3 h-3" /> Live Transcript ({currentLanguage})
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
                </>
              ) : (
                <div className="py-12 text-center animate-in fade-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckSquare className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    Profile Completed Successfully!
                  </h2>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    Based on your interview, the AI has prepared your skill mapping. Generating NSQF matches and grant eligibility...
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-left max-w-2xl mx-auto space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Captured Interview Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 block text-xs uppercase">Step 1: Skill/Work</span><strong className="text-slate-800">{answers[1]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 2: Education & BPL</span><strong className="text-slate-800">{answers[2]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 3: Mobility</span><strong className="text-slate-800">{answers[3]}</strong></div>
                      <div><span className="text-slate-500 block text-xs uppercase">Step 4: Goal</span><strong className="text-slate-800">{answers[4]}</strong></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('matches')} 
                    className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors inline-flex items-center gap-2"
                  >
                    View Recommended Grants
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="animate-in fade-in max-w-5xl mx-auto">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin relative z-10"></div>
                    <div className="absolute inset-0 bg-orange-400 blur-xl opacity-30 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xl font-semibold text-slate-700 animate-pulse text-center max-w-md">
                    {uiText.loading}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bot className="text-orange-600 w-7 h-7" />
                        {uiText.aiTitle}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {filteredNsqfData.length === 0 ? (
                       <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                          No specific matches found. Try answering the interview again with more details.
                       </div>
                    ) : filteredNsqfData.map((trade) => (
                      <div key={trade.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-green-500 group flex flex-col md:flex-row">
                        
                        <div className="p-6 md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200 uppercase tracking-wider">
                              NSQF Level {trade.nsqfLevel}
                            </span>
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              {getDomainIcon(trade.adarshGramDomain)}
                              {trade.adarshGramDomain}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
                            {trade.localTitle?.[currentLanguage] || trade.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                            <Briefcase className="w-4 h-4" />
                            {uiDict[currentLanguage]?.sectorLabel || "Sector"}: <span className="font-medium text-slate-800">{trade.localSector?.[currentLanguage] || trade.sector}</span>
                          </div>

                          <div className="flex flex-col gap-2 mt-auto">
                            <a 
                              href="https://pmajay.dosje.gov.in/" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block"
                            >
                              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                                <CheckSquare className="w-5 h-5" />
                                {uiDict[currentLanguage]?.applyBtn || "Apply for PM-AJAY GIA"}
                              </button>
                            </a>
                            
                            <button 
                              onClick={() => handlePlayAudio(trade)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Volume2 className="w-5 h-5 text-slate-600" />
                              {uiDict[currentLanguage]?.listenBtn || "Listen in Regional Voice"}
                            </button>
                          </div>
                        </div>

                        <div className="p-6 md:w-7/12 flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                            {uiDict[currentLanguage]?.budgetTitle || "PM-AJAY GIA Enterprise Budget"}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                              <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                <Building className="w-3 h-3" /> {uiDict[currentLanguage]?.totalCost || "Total Setup Cost"}
                              </div>
                              <div className="text-xl font-bold text-slate-800 flex items-center">
                                <IndianRupee className="w-5 h-5 text-slate-400" />
                                {trade.totalSetupCost.toLocaleString('en-IN')}
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm relative overflow-hidden">
                              <div className="absolute -right-4 -top-4 opacity-10">
                                <Building className="w-20 h-20 text-green-600" />
                              </div>
                              <div className="text-green-800 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                <Wallet className="w-3 h-3" /> {uiDict[currentLanguage]?.subsidy || "Govt Subsidy"}
                              </div>
                              <div className="text-2xl font-black text-green-600 flex items-center relative z-10">
                                <IndianRupee className="w-5 h-5" />
                                {trade.subsidyAmount.toLocaleString('en-IN')}
                              </div>
                              <p className="text-[10px] text-green-700 mt-1 font-medium leading-tight relative z-10">
                                (50% or up to ₹10,000 grant)
                              </p>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <div className="text-orange-800 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                <PiggyBank className="w-3 h-3" /> {uiDict[currentLanguage]?.loan || "Bank Loan / Self"}
                              </div>
                              <div className="text-xl font-bold text-orange-600 flex items-center">
                                <IndianRupee className="w-5 h-5 text-orange-400" />
                                {trade.selfContribution.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              onClick={() => setExpandedCard(expandedCard === trade.id ? null : trade.id)}
                              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors w-full justify-center md:justify-start"
                            >
                              {translations[currentLanguage]?.viewBreakdown || "View Detailed Cost Breakdown"}
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedCard === trade.id ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedCard === trade.id && trade.costBreakdown && (
                              <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                    <tr>
                                      <th className="px-4 py-2 border-r border-slate-100">{translations[currentLanguage]?.tableItem || "Item / Requirement"}</th>
                                      <th className="px-4 py-2 text-right">{translations[currentLanguage]?.tableCost || "Cost"}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {trade.costBreakdown.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-700 border-r border-slate-100">
                                          {item.item[currentLanguage] || item.item['en-IN'] || item.item}
                                        </td>
                                        <td className="px-4 py-2 text-right font-medium text-slate-900">{item.cost}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="animate-in fade-in">
              <WhatsAppMode currentLanguage={currentLanguage} />
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="animate-in fade-in">
              <DistrictAdmin />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-100 text-slate-500 text-center py-6 mt-auto text-sm border-t border-slate-200">
        {t.footerText}
      </footer>
    </div>
  );
}

export default App;
