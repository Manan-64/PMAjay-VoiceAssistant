import React, { useState, useEffect, useRef } from 'react';
import { speakWithVoice } from '../lib/ttsService';
import { translations } from '../data/translations';

export default function WhatsAppMode({ currentLanguage = 'hi-IN' }) {
  const t = translations[currentLanguage] || translations['en-IN'];

  // Initial greeting message from the bot
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'audio',
      text: t.waMockMsg || "Hello! I am the PM-AJAY Voice Bot. Please tell me your name and what work you do."
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [chatStep, setChatStep] = useState(1);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle playing voice notes
  const playVoiceNote = (id, text) => {
    setActiveAudioId(id);
    speakWithVoice(text, currentLanguage, () => {
      setActiveAudioId(null);
    });
  };

  // Process bot responses based on conversation step
  const triggerBotResponse = (userText) => {
    // Show a small delay to simulate "AI thinking / typing"
    setTimeout(() => {
      let botReplyText = "";
      let nextStep = chatStep;
      
      const textLower = userText.toLowerCase();

      if (chatStep === 1) {
        // SMART KEYWORD MATCHING (Checks English, Hindi, and regional keywords)
        const isFarming = /farm|kisan|krishi|kheti|cow|dairy|milk|agri|pashu|shet|sheti/i.test(textLower);
        const isTailor = /tailor|silai|cloth|stitch|darzi|kapda|sew|shivan/i.test(textLower);
        const isTech = /solar|tech|electric|computer|bijli|wire|light|mobile/i.test(textLower);

        if (isFarming) {
          botReplyText = currentLanguage === 'hi-IN'
            ? "बहुत बढ़िया! कृषि और डेयरी में आपके अनुभव को देखते हुए, आप 'डेयरी फार्मिंग' के लिए ₹50,000 के पीएम-अजय अनुदान के पात्र हैं। आप किस जिले से आवेदन कर रहे हैं?"
            : "Great! Given your experience in agriculture, you are eligible for the 'Dairy Farming' PM-AJAY grant of up to ₹50,000. Which district are you applying from?";
          nextStep = 2;
        } else if (isTailor) {
          botReplyText = currentLanguage === 'hi-IN'
            ? "शानदार! सिलाई में आपके कौशल के लिए, आप 'कस्टम टेलरिंग' उद्यम के तहत ₹50,000 के अनुदान के पात्र हैं। आप किस जिले या गांव से हैं?"
            : "Awesome! For your sewing skills, you are eligible for the 'Custom Tailoring' enterprise grant up to ₹50,000. Which district or village are you from?";
          nextStep = 2;
        } else if (isTech) {
          botReplyText = currentLanguage === 'hi-IN'
            ? "उत्कृष्ट! तकनीकी क्षेत्र में, आप 'सोलर पैनल तकनीशियन' अनुदान के पात्र हैं। कृपया अपने जिले का नाम बताएं।"
            : "Excellent! In the technical sector, you are eligible for the 'Solar Panel Technician' grant. Please tell me your district.";
          nextStep = 2;
        } else {
          // GIBBERISH / UNKNOWN INPUT CATCHER
          botReplyText = currentLanguage === 'hi-IN'
            ? "माफ़ करें, मैं वह ठीक से समझ नहीं पाया। क्या आप स्पष्ट कर सकते हैं कि आप किस प्रकार का काम करते हैं? (जैसे: खेती, सिलाई, या बिजली का काम)"
            : "Sorry, I didn't quite catch your specific skill. Could you clarify what kind of work you do? (e.g., farming, tailoring, or electrical work)";
          nextStep = 1; // Keep them on step 1 until they provide a valid skill
        }
      } else if (chatStep === 2) {
        botReplyText = currentLanguage === 'hi-IN'
          ? `धन्यवाद! ${userText} जिले में आपके लिए योजनाएं उपलब्ध हैं। मैंने आपका प्रोफाइल बना लिया है। कृपया आवेदन पूरा करने के लिए 'कौशल और अनुदान मिलान' टैब पर जाएं।`
          : `Thank you! Schemes are available in ${userText} district. I have built your profile. Please visit the 'Skill & Grant Matches' tab to complete your application.`;
        nextStep = 3;
      } else {
        botReplyText = currentLanguage === 'hi-IN'
          ? "आपका प्रोफाइल पहले ही बन चुका है। कृपया ऊपर दिए गए टैब से अपना अनुदान देखें।"
          : "Your profile is already built. Please check your grants from the tabs above.";
      }

      setChatStep(nextStep);
      
      const newBotMsg = {
        id: Date.now(),
        sender: 'bot',
        type: 'audio',
        text: botReplyText
      };

      setMessages(prev => [...prev, newBotMsg]);
      playVoiceNote(newBotMsg.id, botReplyText); // Speak the smart response out loud
    }, 1200);
  };

  // Handle text message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    const userInput = inputText;
    setInputText('');
    
    triggerBotResponse(userInput);
  };

  // Handle Speech-to-Text Microphone Input
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      const userMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'audio',
        text: transcript
      };

      setMessages(prev => [...prev, userMsg]);
      triggerBotResponse(transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-700 my-6">
      {/* WhatsApp Header */}
      <div className="bg-emerald-800 text-white p-3 rounded-t-3xl flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-sm">PM-AJAY Voice Bot</h2>
            <p className="text-xs text-emerald-200">{t.waOnline || "online"}</p>
          </div>
        </div>
        <div className="flex space-x-3 text-emerald-200">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="bg-[#efeae2] p-4 h-[400px] overflow-y-auto flex flex-col space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-3 rounded-xl shadow-sm text-sm relative ${
              msg.sender === 'user'
                ? 'bg-[#dcf8c6] self-end rounded-tr-none text-slate-900'
                : 'bg-white self-start rounded-tl-none text-slate-900'
            }`}
          >
            {msg.type === 'audio' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => playVoiceNote(msg.id, msg.text)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all ${
                    activeAudioId === msg.id ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  title="Play Voice Note"
                >
                  {activeAudioId === msg.id ? '⏹️' : '▶'}
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                      🎤 Voice Note
                    </span>
                  </div>
                  <p className="font-medium text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm">{msg.text}</p>
            )}
            <span className="block text-[9px] text-gray-500 text-right mt-1">10:42 AM</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* WhatsApp Input Footer */}
      <form onSubmit={handleSendMessage} className="bg-slate-800 p-3 rounded-b-3xl flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.waInput || "Type a message..."}
          className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={handleMicClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
            isListening ? 'bg-red-500 animate-ping' : 'bg-slate-700 hover:bg-slate-600'
          }`}
          title="Speak via Microphone"
        >
          🎙️
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
