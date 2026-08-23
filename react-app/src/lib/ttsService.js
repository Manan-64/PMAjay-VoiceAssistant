export const speakWithVoice = (text, langCode = 'hi-IN', onComplete = null) => {
  if (!text) {
    if (onComplete) onComplete();
    return;
  }

  // Cancel any active audio
  window.speechSynthesis.cancel();
  if (window.responsiveVoice) {
    try { window.responsiveVoice.cancel(); } catch(e) {}
  }

  const baseLang = langCode.split('-')[0].toLowerCase();

  // 1. ResponsiveVoice handles these 4 languages perfectly
  const rvMap = {
    'en-IN': 'UK English Female',
    'hi-IN': 'Hindi Female',
    'ta-IN': 'Tamil Male',
    'bn-IN': 'Bangla India Female'
  };

  const rvVoice = rvMap[langCode];

  if (rvVoice) {
    console.log(`[TTS] Using ResponsiveVoice for ${langCode}`);
    const playRV = () => {
      window.responsiveVoice.speak(text, rvVoice, {
        onend: () => { if (onComplete) onComplete(); },
        onerror: () => { if (onComplete) onComplete(); }
      });
    };

    if (!window.responsiveVoice) {
      const script = document.createElement('script');
      script.src = "https://code.responsivevoice.org/responsivevoice.js";
      script.onload = () => {
        window.responsiveVoice.init();
        playRV();
      };
      script.onerror = () => { if (onComplete) onComplete(); };
      document.head.appendChild(script);
    } else {
      playRV();
    }
  } 
  // 2. For Marathi (mr), Telugu (te), Gujarati (gu), route to Google GTX Cloud Audio
  else {
    console.log(`[TTS] Using Optimized Cloud GTX Audio for regional language: ${baseLang}`);
    
    // Keep text short to prevent server truncation
    const safeText = text.length > 150 ? text.substring(0, 147) + '...' : text;
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${baseLang}&q=${encodeURIComponent(safeText)}`;

    const audioEl = document.createElement('audio');
    audioEl.setAttribute('referrerpolicy', 'no-referrer');
    audioEl.src = url;
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);

    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        audioEl.remove();
        if (onComplete) onComplete();
      }
    };

    audioEl.onended = done;
    audioEl.onerror = (e) => {
      console.error("[TTS GTX Error] Failed to stream audio:", e);
      audioEl.remove();
      if (onComplete) onComplete();
    };

    audioEl.play().catch(err => {
      console.error("[TTS GTX] Autoplay blocked:", err);
      audioEl.remove();
      if (onComplete) onComplete();
    });

    // Safety timeout in case audio fails to trigger onended
    setTimeout(done, (text.length * 150) + 4000);
  }
};
