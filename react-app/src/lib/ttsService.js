export const speakWithVoice = (text, langCode = 'hi-IN', onComplete = null) => {
  if (!text) {
    if (onComplete) onComplete();
    return;
  }

  // Exact names required by the ResponsiveVoice API
  const rvVoiceMap = {
    'en-IN': 'UK English Female',
    'hi-IN': 'Hindi Female',
    'ta-IN': 'Tamil Male',
    'bn-IN': 'Bangla India Female'
  };

  const rvVoice = rvVoiceMap[langCode];

  // Strategy A: If ResponsiveVoice supports the language, use it.
  if (rvVoice) {
    const playRV = () => {
      console.log(`[TTS] Using ResponsiveVoice: ${rvVoice}`);
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
      document.head.appendChild(script);
    } else {
      window.responsiveVoice.cancel();
      playRV();
    }
  } 
  // Strategy B: Ghost Audio DOM Hack for MR, TE, GU
  else {
    console.log(`[TTS] Using Ghost DOM Audio for: ${langCode}`);
    const shortLang = langCode.split('-')[0];
    // Google restricts URLs to ~200 characters, so we truncate safely
    const safeText = text.length > 200 ? text.substring(0, 197) + '...' : text;
    const gtxUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${shortLang}&q=${encodeURIComponent(safeText)}`;

    // Create a physical audio element in the DOM to bypass fetch CORS
    const audioEl = document.createElement('audio');
    audioEl.setAttribute('referrerpolicy', 'no-referrer'); // CRITICAL: Hides localhost origin
    audioEl.src = gtxUrl;
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);

    audioEl.onended = () => {
      audioEl.remove(); // Cleanup DOM
      if (onComplete) onComplete();
    };

    audioEl.onerror = (e) => {
      console.error("[TTS Ghost] Failed to play audio:", e);
      audioEl.remove();
      if (onComplete) onComplete();
    };

    audioEl.play().catch(err => {
      console.error("[TTS Ghost] Autoplay blocked by browser:", err);
      audioEl.remove();
      if (onComplete) onComplete();
    });
  }
};
