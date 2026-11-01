import React, { useState, useEffect } from 'react';
import { queryAssistant } from '../api';
import { 
  X, Mic, MicOff, Send, MessageSquareCode, 
  Sparkles, RefreshCw, Volume2, Globe 
} from 'lucide-react';

import { useI18n } from '../i18nContext';

interface MultilingualAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultilingualAssistantModal: React.FC<MultilingualAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language: globalLang } = useI18n();
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>(globalLang || 'en');

  useEffect(() => {
    if (globalLang) {
      setLanguage(globalLang);
    }
  }, [globalLang]);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; provider?: string }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am your JanDrishti AI Civic Assistant. You can ask me in English, Hindi, or Punjabi about public funds, village project progress, delayed works, or how to register and track a grievance.',
      provider: 'JanDrishti Core System'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Welcome message in selected language
    if (language === 'hi') {
      setMessages([
        {
          sender: 'assistant',
          text: 'नमस्ते! मैं जनदृष्टि एआई सहायक हूँ। आप मुझसे स्वीकृत ग्रामीण विकास निधि, सड़क कार्यों, विलंबित परियोजनाओं या शिकायत दर्ज करने के बारे में हिंदी में पूछ सकते हैं।',
          provider: 'JanDrishti Core System'
        }
      ]);
    } else if (language === 'pa') {
      setMessages([
        {
          sender: 'assistant',
          text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਜਨਦ੍ਰਿਸ਼ਟੀ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਤੋਂ ਪਿੰਡਾਂ ਦੇ ਵਿਕਾਸ ਫੰਡਾਂ, ਲਿੰਕ ਸੜਕਾਂ, ਦੇਰੀ ਵਾਲੇ ਕੰਮਾਂ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛ ਸਕਦੇ ਹੋ।',
          provider: 'JanDrishti Core System'
        }
      ]);
    } else {
      setMessages([
        {
          sender: 'assistant',
          text: 'Hello! I am your JanDrishti AI Civic Assistant. You can ask me in English, Hindi, or Punjabi about public funds, village project progress, delayed works, or how to register and track a grievance.',
          provider: 'JanDrishti Core System'
        }
      ]);
    }
  }, [language]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await queryAssistant(text, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          provider: res.provider
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to process query at this moment. Please check connectivity or try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser. You can type your question directly.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const samplePrompts = {
    en: [
      'Which development projects are delayed?',
      'How much funding was allocated to Ludhiana?',
      'How do I register a road pothole complaint?'
    ],
    hi: [
      'कौन सी परियोजनाएं वर्तमान में विलंबित हैं?',
      'सड़क मरम्मत की शिकायत कैसे दर्ज करें?',
      'लुधियाना जिले को कुल कितना बजट स्वीकृत हुआ?'
    ],
    pa: [
      'ਕਿਹੜੇ ਪਿੰਡਾਂ ਦੇ ਪ੍ਰੋਜੈਕਟ ਦੇਰੀ ਨਾਲ ਚੱਲ ਰਹੇ ਹਨ?',
      'ਟੁੱਟੀ ਸੜਕ ਦੀ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ?',
      'ਕੁੱਲ ਕਿੰਨਾ ਵਿਕਾਸ ਫੰਡ ਮਨਜ਼ੂਰ ਹੋਇਆ ਹੈ?'
    ]
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                JanDrishti Multilingual Assistant
              </h2>
              <p className="text-[10px] text-slate-400">
                Voice &amp; Text Citizen Intelligence (English · हिंदी · ਪੰਜਾਬੀ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('pa')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'pa' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Viewport */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 shadow-2xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                {m.text}
              </div>
              {m.provider && (
                <span className="text-[10px] text-slate-400 pt-0.5 font-mono px-1">
                  Source: {m.provider}
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-slate-500 text-xs max-w-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Checking authorized records...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick:</span>
          {samplePrompts[language].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={startVoiceInput}
            title="Speak Question"
            className={`p-2 rounded-lg border transition-colors ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न यहां लिखें या माइक दबाएं...'
                : language === 'pa'
                ? 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾਓ...'
                : 'Ask about projects, funds, or grievances...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
