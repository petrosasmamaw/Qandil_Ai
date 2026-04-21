import { useState, useRef, useCallback } from 'react';

// Web Speech API hook for voice recording
export const useVoiceRecording = (language = 'eng') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef('');

  // Initialize recognition on first use
  const initializeRecognition = useCallback(() => {
    if (recognitionRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech Recognition is not supported in your browser');
      return false;
    }

    const recognition = new SpeechRecognition();
    
    // Map app language codes to Web Speech API language codes
    const languageMap = {
      'eng': 'en-US',      // English
      'ara': 'ar-SA',      // Arabic (Saudi Arabia - closest to Modern Standard Arabic)
      'arGulf': 'ar-AE',   // Gulf Arabic
      'mahraic': 'ar-AE',  // Mahraic (use Gulf Arabic as closest)
      'en': 'en-US',
      'ar': 'ar-SA',
    };

    const langCode = languageMap[language] || 'en-US';
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langCode;

    // Handle recognition results
    recognition.onresult = (event) => {
      interimTranscriptRef.current = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcript + ' ');
        } else {
          interimTranscriptRef.current += transcript;
        }
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      let errorMessage = 'An error occurred during speech recognition';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Ensure microphone is connected.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed.';
          break;
        case 'bad-grammar':
          errorMessage = 'Invalid grammar for language.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please enable microphone access.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    // Handle end of recognition
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return true;
  }, [language]);

  // Start listening
  const startListening = useCallback(() => {
    setError(null);
    interimTranscriptRef.current = '';
    
    if (!initializeRecognition()) {
      return;
    }

    try {
      // Reset transcript when starting new recording
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
      console.error('Failed to start recording:', err);
    }
  }, [initializeRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    interimTranscriptRef.current = '';
    setError(null);
  }, []);

  // Get interim transcript (text being recognized but not final)
  const getInterimTranscript = useCallback(() => {
    return interimTranscriptRef.current;
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript: getInterimTranscript(),
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    addToTranscript: (text) => setTranscript((prev) => prev + text),
  };
};
