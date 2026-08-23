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
  AVAILABLE SCHEME BUSINESS ROLES & DETAILED COST BREAKDOWNS (Max Government Subsidy: ₹10,000):

  1. Poultry Farm (Agriculture / Livestock):
     - Total Setup Cost: ~₹20,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹10,000
     - Itemized Breakdown:
       • 50–100 Day-old chicks: ₹3,500
       • Initial poultry feed & supplements: ₹6,500
       • Basic coop construction & wire netting: ₹6,000
       • Feeders, drinkers & heating lamps: ₹4,000
     - Related Alternatives: Dairy Farming, Kirana Store

  2. Dairy Farming (Animal Husbandry):
     - Total Setup Cost: ~₹25,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹15,000
     - Itemized Breakdown:
       • Partial cattle purchase / initial down-payment: ₹12,000
       • Cattle feed, green fodder & mineral mixture: ₹5,000
       • Stainless steel milking cans & hygiene kit: ₹3,000
       • Temporary shed repair & fencing: ₹5,000
     - Related Alternatives: Poultry Farm, Kirana Store

  3. Custom Tailoring & Stitching (Textiles / Apparel):
     - Total Setup Cost: ~₹15,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹5,000
     - Itemized Breakdown:
       • Commercial sewing machine: ₹8,000
       • Tailoring cutting table, scissors & measuring kit: ₹3,000
       • Initial threads, needles, zippers & lining material: ₹4,000
     - Related Alternatives: Beauty Parlor / Salon, Kirana Store

  4. Solar Panel Technician (Renewable Energy / Electrical):
     - Total Setup Cost: ~₹18,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹8,000
     - Itemized Breakdown:
       • Professional digital multimeter & solar tester: ₹6,000
       • Heavy-duty hammer drill & bit set: ₹5,000
       • Safety harness, helmet & insulated boots: ₹4,000
       • MC4 crimping tools & wire strippers: ₹3,000
     - Related Alternatives: Mobile Repair Shop, Two-Wheeler Mechanic

  5. Beauty Parlor / Salon (Services & Grooming):
     - Total Setup Cost: ~₹15,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹5,000
     - Itemized Breakdown:
       • Styling chair & wide wall mirror: ₹6,000
       • Hair dryer, straightener & tool sterilizer: ₹4,500
       • Initial cosmetics, facial kits & grooming supplies: ₹4,500
     - Related Alternatives: Custom Tailoring, Common Service Center (CSC)

  6. Mobile Phone Repair Shop (Electronics / Tech):
     - Total Setup Cost: ~₹12,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹2,000
     - Itemized Breakdown:
       • SMD soldering rework station & heat gun: ₹4,500
       • Precision screwdriver set & opening tools: ₹2,000
       • LCD screen separator & digital multimeter: ₹4,000
       • Cleaning chemicals, solder wire & consumables: ₹1,500
     - Related Alternatives: Solar Panel Technician, Common Service Center (CSC)

  7. E-Rickshaw Operation (Green Transport):
     - Total Setup Cost: ~₹1,20,000 (Financed) | Government Subsidy: ₹10,000 | Bank Loan/Margin: ₹1,10,000
     - Itemized Breakdown:
       • Margin money / initial down payment: ₹15,000
       • Registration, permit & vehicle insurance: ₹6,000
       • Fast charger plug & safety accessories: ₹4,000
       • Remainder covered under bank loan scheme: ₹95,000
     - Related Alternatives: Two-Wheeler Mechanic, Kirana Store

  8. Grocery / Kirana Store (Retail & Commerce):
     - Total Setup Cost: ~₹20,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹10,000
     - Itemized Breakdown:
       • Initial wholesale FMCG & grocery stock: ₹11,000
       • Wooden/metal storage racks & counter: ₹5,000
       • Electronic weighing scale: ₹4,000
     - Related Alternatives: Poultry Farm, Custom Tailoring

  9. Carpentry / Furniture Work (Crafts & Construction):
     - Total Setup Cost: ~₹14,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹4,000
     - Itemized Breakdown:
       • Power circular saw & high-speed hand drill: ₹6,000
       • Hand plane, chisels, saws & measuring tape: ₹4,500
       • Initial fasteners, wood glue & sanding supplies: ₹3,500
     - Related Alternatives: Plumbing Services, Two-Wheeler Mechanic

  10. Plumbing & Pipe Fitting (Trades & Infrastructure):
      - Total Setup Cost: ~₹11,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹1,000
      - Itemized Breakdown:
        • Pipe wrench set & threading die kit: ₹4,500
        • PVC pipe cutter & PPR hot-melt machine: ₹4,000
        • Teflon tapes, sealants, spare washers & safety kit: ₹2,500
      - Related Alternatives: Carpentry, Solar Panel Technician

  11. Two-Wheeler Mechanic (Auto Repair):
      - Total Setup Cost: ~₹16,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹6,000
      - Itemized Breakdown:
        • Metric socket, spanner & ratchet set: ₹5,000
        • Portable air compressor & tyre pressure gauge: ₹5,500
        • Mechanical lifting jack & heavy stand: ₹3,000
        • Engine oil collection tray, spark plugs & consumables: ₹2,500
      - Related Alternatives: Solar Panel Technician, E-Rickshaw Operation

  12. Common Service Center / CSC Kiosk (Digital & IT Services):
      - Total Setup Cost: ~₹30,000 | Government Subsidy: ₹10,000 | Beneficiary/Bank Share: ₹20,000
      - Itemized Breakdown:
        • Desktop computer / refurbished laptop: ₹16,000
        • All-in-one multi-function printer/scanner: ₹9,000
        • Biometric fingerprint scanner & 4G Wi-Fi dongle: ₹5,000
      - Related Alternatives: Mobile Repair Shop, Beauty Parlor
  `;

  const systemPrompt = `You are a friendly, conversational government guide for the PM-AJAY scheme. 
  Your role is to guide citizens toward government-supported self-employment opportunities.

  OFFICIAL SCHEME DATA:
  ${grantData}

  CORE RULES & FLOW:
  1. BE EXTREMELY BRIEF: Your initial responses must be only 2 to 3 sentences long. Do NOT use markdown headings (like ###) or long lists.
  2. SUBSIDY CAP: Always state the subsidy is capped at exactly ₹10,000.
  3. THE MATCH: When a user mentions a skill, simply tell them the matching job role, the total setup cost, and the ₹10,000 subsidy. 
  4. THE QUESTION: Always end your short message by asking: "Would you like a detailed cost breakdown, explore other options, or proceed to register?"
  5. WITHHOLD DETAILS: DO NOT provide the itemized cost breakdown or list alternative jobs UNLESS the user explicitly asks for them.
  6. REGISTRATION: If they want to register, give them this link: https://pmajay.dosje.gov.in/
  7. Reply naturally in the language matching this code: ${currentLanguage}.`;

  const localFallbackResponse = (userMessage, language) => {
    const msg = userMessage.toLowerCase();
    
    // Quick keyword dictionary mapped to [Trade Name, Setup Cost]
    const tradeMap = [
      { keywords: ['poultry', 'chicken', 'farm', 'murgi', 'मुर्गी'], name: 'Poultry Farm', cost: '₹20,000' },
      { keywords: ['dairy', 'milk', 'cow', 'cattle', 'doodh', 'भैंस', 'गाय', 'दूध'], name: 'Dairy Farming', cost: '₹25,000' },
      { keywords: ['tailor', 'stitching', 'sewing', 'clothes', 'darzi', 'कपड़े', 'दर्जी', 'सिलाई'], name: 'Custom Tailoring', cost: '₹15,000' },
      { keywords: ['solar', 'electricity', 'panel', 'सौर'], name: 'Solar Panel Technician', cost: '₹18,000' },
      { keywords: ['beauty', 'salon', 'makeup', 'parlor', 'parlour', 'hair', 'पार्लर'], name: 'Beauty Parlor', cost: '₹15,000' },
      { keywords: ['mobile', 'phone', 'repair', 'મોબાઇલ', 'మొబైల్'], name: 'Mobile Repair Shop', cost: '₹12,000' },
      { keywords: ['rickshaw', 'auto', 'driving', 'driver', 'e-rickshaw', 'रिक्शा'], name: 'E-Rickshaw Operation', cost: '₹1,20,000' },
      { keywords: ['grocery', 'kirana', 'store', 'shop', 'dukan', 'दुकान', 'किराना'], name: 'Kirana Store', cost: '₹30,000' },
      { keywords: ['plumber', 'plumbing', 'pipe', 'water', 'प्लंबर'], name: 'Plumbing Services', cost: '₹10,000' },
      { keywords: ['mechanic', 'bike', 'scooter', 'motorcycle', 'मैकेनिक'], name: 'Two-Wheeler Mechanic', cost: '₹15,000' },
      { keywords: ['carpenter', 'wood', 'furniture', 'badhai', 'बढ़ई'], name: 'Carpentry', cost: '₹18,000' },
      { keywords: ['csc', 'computer', 'online', 'center', 'internet', 'digital', 'कंप्यूटर'], name: 'Common Service Center (CSC)', cost: '₹40,000' }
    ];

    let matchedTrade = null;
    for (const trade of tradeMap) {
      if (trade.keywords.some(kw => msg.includes(kw))) {
        matchedTrade = trade;
        break;
      }
    }

    if (matchedTrade) {
      if (language.includes('hi')) {
        return `(ऑफ़लाइन मोड) मुझे आपका काम समझ आ गया! **${matchedTrade.name}** आपके लिए सही विकल्प है। इसकी कुल लागत लगभग ${matchedTrade.cost} है, जिसमें सरकार आपको **₹10,000 की सब्सिडी** देगी।\n\nक्या आप विस्तृत लागत विवरण जानना चाहते हैं, अन्य विकल्प तलाशना चाहते हैं, या पंजीकरण के लिए आगे बढ़ना चाहते हैं?`;
      }
      return `(Offline Mode) I found a match! **${matchedTrade.name}** is a great fit for you. The total setup cost is approximately ${matchedTrade.cost}, and the government provides a strict **subsidy of ₹10,000**.\n\nWould you like a detailed cost breakdown, explore other options, or proceed to register?`;
    }

    if (language.includes('hi')) {
      return "(ऑफ़लाइन मोड) क्षमा करें, मुझे आपका काम समझ नहीं आया। क्या आप सिलाई, मुर्गी पालन, या डेयरी जैसे किसी अन्य काम का उल्लेख कर सकते हैं?";
    }
    return "(Offline Mode) I couldn't match that to our scheme data. Could you try mentioning a specific skill like tailoring, poultry, dairy, or solar?";
  };

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
        if (data.error.code === 429 || response.status === 429) {
          console.warn("Google API Rate Limit (429) hit. Falling back to local matcher.");
          return localFallbackResponse(userMessage, currentLanguage);
        }
        console.error("Google API Error:", data.error);
        return `Google API Error: ${data.error.message}`;
      }

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "Error: Received empty response from Google AI.";
    } catch (error) {
      console.error("Fetch Error:", error);
      // Fallback on network error as well just in case
      console.warn("Network error hit. Falling back to local matcher.");
      return localFallbackResponse(userMessage, currentLanguage);
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

  const formatText = (text) => {
    if (!text) return "";
    // Split the text by '**'
    const parts = text.split('**');
    // Every odd index is the text that was wrapped in **
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-bold text-gray-900">{part}</strong> : part
    );
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
                <p className="leading-relaxed">{formatText(msg.text)}</p>
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
