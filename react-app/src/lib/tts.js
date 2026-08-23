export function speakText(text, langCode) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis is not supported in this browser.");
      resolve();
      return;
    }

    // Ensure previous audio is cleared
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;

    // Resolve promise when speech finishes (or errors)
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    // Robust Voice Selection
    const voices = window.speechSynthesis.getVoices();
    const baseLang = langCode.split('-')[0].toLowerCase();
    
    const selectedVoice = voices.find(v => 
      v.lang.replace('_', '-').toLowerCase().startsWith(baseLang)
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  });
}
