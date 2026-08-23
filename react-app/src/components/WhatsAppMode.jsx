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
    setTimeout(() => {
      let botReplyText = "";
      let nextStep = chatStep;

      if (chatStep === 1) {
        botReplyText = currentLanguage === 'hi-IN' 
          ? `धन्यवाद! मैंने नोट किया कि आप "${userText}" से जुड़े हैं। अब कृपया बताएं कि आप किस जिले या गांव से हैं?`
          : `Thank you! I noted your profile. Which district or village are you applying from?`;
        nextStep = 2;
      } else if (chatStep === 2) {
        botReplyText = currentLanguage === 'hi-IN'
          ? `उत्कृष्ट! आपके क्षेत्र के अनुसार, आप ₹50,000 तक के पीएम-अजय उद्यम अनुदान के पात्र हैं। क्या मैं आपके लिए आवेदन प्रक्रिया शुरू करूं?`
          : `Excellent! Based on your region, you are eligible for up to ₹50,000 in PM-AJAY enterprise grants. Shall I start your application?`;
        nextStep = 3;
      } else {
        botReplyText = currentLanguage === 'hi-IN'
          ? `आपका आवेदन दर्ज कर लिया गया है। कृपया मुख्य पोर्टल पर जाएं या 'कौशल और अनुदान मिलान' टैब देखें।`
          : `Your application request has been logged. Please check the 'Skill & Grant Matches' tab to complete verification.`;
      }

      setChatStep(nextStep);
      const newBotMsg = {
        id: Date.now(),
        sender: 'bot',
        type: 'audio',
        text: botReplyText
      };

      setMessages(prev => [...prev, newBotMsg]);
      playVoiceNote(newBotMsg.id, botReplyText);
    }, 1000);
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
