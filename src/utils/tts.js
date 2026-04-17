// Frontend-only TTS utility using browser SpeechSynthesis API
// Exports: speakText(text, lang?) and stopSpeaking()

const AMHARIC_RANGE = /[\u1200-\u137F]/;
let _isSpeaking = false;
let _utterances = [];

function detectLanguage(text, preferred) {
  if (preferred) return preferred;
  if (AMHARIC_RANGE.test(text)) return 'am-ET';
  return 'en-US';
}

function splitToChunks(text, maxLen = 1500) {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    // try to cut at sentence boundary
    if (end < text.length) {
      const slice = text.slice(start, end);
      const lastPeriod = Math.max(slice.lastIndexOf('.'), slice.lastIndexOf('?'), slice.lastIndexOf('!'));
      if (lastPeriod > Math.floor(maxLen * 0.5)) {
        end = start + lastPeriod + 1;
      }
    }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    // ignore
  }
  _isSpeaking = false;
  _utterances = [];
}

export function speakText(text, preferredLang = null, { onStart, onEnd } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return { supported: false };

  stopSpeaking();

  const lang = detectLanguage(text, preferredLang);
  const chunks = splitToChunks(String(text || ''));
  if (chunks.length === 0) return { supported: true };

  _isSpeaking = true;

  let finishedCount = 0;

  chunks.forEach((chunk, idx) => {
    const utter = new SpeechSynthesisUtterance(chunk);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;

    utter.onstart = () => {
      try { if (onStart && idx === 0) onStart(); } catch (e) {}
    };

    utter.onend = () => {
      finishedCount += 1;
      if (finishedCount >= chunks.length) {
        _isSpeaking = false;
        _utterances = [];
        try { if (onEnd) onEnd(); } catch (e) {}
      }
    };

    utter.onerror = () => {
      finishedCount += 1;
      if (finishedCount >= chunks.length) {
        _isSpeaking = false;
        _utterances = [];
        try { if (onEnd) onEnd(); } catch (e) {}
      }
    };

    _utterances.push(utter);
    try {
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // ignore speak errors per-utterance
    }
  });

  return { supported: true };
}

export function isSpeaking() {
  return _isSpeaking;
}
