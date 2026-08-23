import React, { useState, useEffect, useRef } from 'react';
import { speakWithVoice } from '../lib/ttsService';

export default function WhatsAppMode({ currentLanguage = 'hi-IN' }) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Initial AI greeting
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: currentLanguage.includes('hi') 
        ? "नमस्ते! मैं पीएम-अजय योजना का आधिकारिक एआई गाइड हूँ। मैं आपको सरकारी अनुदान प्राप्त करने में मदद कर सकता हूँ। आप किस प्रकार का काम करते हैं?" 
        : "Hello! I am the official PM-AJAY AI guide. I can help you secure government grants. What kind of work do you do or want to start?"
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState(null);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const playVoiceNote = (id, text) => {
    setActiveAudioId(id);
    speakWithVoice(text, currentLanguage, () => setActiveAudioId(null));
  };

  // The Persona & Instructions for Gemini
  const grantData = `
  AVAILABLE GRANTS & COST BREAKDOWNS (Maximum Government Subsidy: ₹10,000):
  
  1. Poultry Farm (Agriculture):
     - Total Setup Cost: ~₹20,000
     - Subsidy: ₹10,000
     - Details: Covers purchase of chicks, initial feed, and basic coops.
     
  2. Dairy Farming (Agriculture):
     - Total Setup Cost: ~₹25,000
     - Subsidy: ₹10,000
     - Details: Covers partial cattle purchase, initial feed, and basic shed setup.
     
  3. Custom Tailoring (Textiles):
     - Total Setup Cost: ~₹15,000
     - Subsidy: ₹10,000
     - Details: Covers sewing machine, threads, scissors, and basic fabrics.
     
  4. Solar Panel Technician (Tech/Electrical):
     - Total Setup Cost: ~₹18,000
     - Subsidy: ₹10,000
     - Details: Covers professional toolkit, safety gear, and multimeter.

  5. Beauty Parlor / Salon (Services):
     - Total Setup Cost: ~₹15,000
     - Subsidy: ₹10,000
     - Details: Covers basic cosmetic inventory, styling chairs, and mirrors.

  6. Mobile Repair Shop (Electronics):
     - Total Setup Cost: ~₹12,000
     - Subsidy: ₹10,000
     - Details: Covers soldering iron, multimeter, screen separators, and basic toolkits.

  7. E-Rickshaw Operation (Transport):
     - Total Setup Cost: ~₹1,20,000 (Financed via bank)
     - Subsidy: ₹10,000
     - Details: Covers down payment or partial battery replacement for a new e-rickshaw.

  8. Grocery / Kirana Store (Retail):
     - Total Setup Cost: ~₹20,000
     - Subsidy: ₹10,000
     - Details: Covers initial wholesale inventory, shelving, and a weighing scale.

  9. Carpentry / Furniture Work (Crafts):
     - Total Setup Cost: ~₹14,000
     - Subsidy: ₹10,000
     - Details: Covers power drills, saws, measuring tools, and initial wood supply.

  10. Plumbing Services (Trades):
      - Total Setup Cost: ~₹11,000
      - Subsidy: ₹10,000
      - Details: Covers pipe wrenches, threaders, cutters, and safety gear.

  11. Two-Wheeler Mechanic (Auto Repair):
      - Total Setup Cost: ~₹16,000
      - Subsidy: ₹10,000
      - Details: Covers spanner sets, air compressor, jacks, and basic spare parts.

  12. Common Service Center / CSC (IT/Tech):
      - Total Setup Cost: ~₹30,000
      - Subsidy: ₹10,000
      - Details: Covers a basic desktop/laptop, printer, and internet setup equipment.
  `;

  const systemPrompt = `You are a helpful, professional government guide for the PM-AJAY scheme in India. 
  Your goal is to help citizens figure out what business grants they qualify for based on their skills.
  
  Here is the official scheme data you MUST use:
  ${grantData}
  
  Rules:
  1. NEVER promise more than ₹10,000 as a grant/subsidy under any circumstance.
  2. MATCHING: If the user mentions a skill, match them ONLY to the jobs in the official scheme data provided above.
  3. PROACTIVE OFFER: When you suggest a matching job, ALWAYS end your message by asking if they would like an explanation of the setup costs and job details. (e.g., "Would you like to know the setup costs and what equipment this covers?").
  4. EXPLAINING: If the user says "yes" or asks for details, explain the specific Total Setup Cost, the ₹10,000 Subsidy limit, and the exact Details from the data in simple terms.
  5. Keep your answers VERY short, friendly, and conversational (1-3 sentences max).
  6. Reply in the language matching this code: ${currentLanguage}.`;

  const fetchGeminiResponse = async (userMessage, history) => {
    if (!GEMINI_API_KEY) {
      return "Error: Missing VITE_GEMINI_API_KEY in .env file.";
    }

    try {
      // Clean history: Gemini requires the conversation to start with a 'user' role
      const validHistory = [];
      let foundFirstUser = false;

      for (const msg of history) {
        if (msg.sender === 'user') foundFirstUser = true;
        if (foundFirstUser) {
          validHistory.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }

      validHistory.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: validHistory
          })
        }
      );

      const data = await response.json();
      
      // SHOW EXACT ERRORS IN THE CHAT
      if (data.error) {
        console.error("Google API Error:", data.error);
        return `Google API Error: ${data.error.message}`;
      }

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "Error: Received empty response from Google AI.";
    } catch (error) {
      console.error("Fetch Error:", error);
      return "Network Error: Could not reach Google's servers. Check your internet connection.";
    }
  };

  const handleSendMessage = async (e, voiceTranscript = null) => {
    if (e) e.preventDefault();
    const textToSend = voiceTranscript || inputText;
    if (!textToSend.trim()) return;

    // 1. Add user message to UI
    const newUserMsg = { id: Date.now(), sender: 'user', type: 'text', text: textToSend };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    // 2. Fetch AI response
    const aiReplyText = await fetchGeminiResponse(textToSend, messages);
    
    // 3. Add AI response to UI
    const newBotMsg = { id: Date.now() + 1, sender: 'bot', type: 'text', text: aiReplyText };
    setMessages(prev => [...prev, newBotMsg]);
    setIsTyping(false);

    // 4. Auto-play the AI's response aloud
    playVoiceNote(newBotMsg.id, aiReplyText);
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage;
    recognition.interimResults = false;
    
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(null, transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="w-full h-[75vh] flex flex-col bg-slate-50 border border-gray-200 shadow-xl rounded-2xl overflow-hidden mt-4">
      {/* Web Chat Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-lg">PM-AJAY Sahayata AI Guide</h2>
            <p className="text-sm text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live AI connected
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 bg-[#f0f2f5] p-6 overflow-y-auto flex flex-col space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-base relative ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white text-slate-800 rounded-tl-sm border border-gray-100'
            }`}>
              <div className="flex flex-col">
                <p className="leading-relaxed">{msg.text}</p>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => playVoiceNote(msg.id, msg.text)}
                    className={`mt-3 self-start flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      activeAudioId === msg.id ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <span>{activeAudioId === msg.id ? '⏹️ Playing Audio...' : '▶ Play Aloud'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Web Chat Input Footer */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200 flex items-center space-x-4">
        <button
          type="button"
          onClick={handleMicClick}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-md ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Speak to AI"
        >
          🎙️
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to the AI Guide..."
          className="flex-1 bg-gray-100 text-slate-800 px-6 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-md transition-all"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
