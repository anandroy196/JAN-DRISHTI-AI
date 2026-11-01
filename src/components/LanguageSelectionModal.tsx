import React from 'react';
import { Language, translations } from '../i18n';
import { Languages, Check, Volume2, X } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  const languages: Array<{
    code: Language;
    label: string;
    scriptName: string;
    description: string;
    taglinePreview: string;
  }> = [
    {
      code: 'en',
      label: 'English',
      scriptName: 'English (Pan-India Official)',
      description: 'Standard English interface with civic transparency data & analytics.',
      taglinePreview: translations.en.tagline
    },
    {
      code: 'hi',
      label: 'हिन्दी',
      scriptName: 'Hindi (राष्ट्रभाषा)',
      description: 'सरल हिन्दी इंटरफ़ेस, ग्राम सभा ऑडिट, अपशिष्ट एवं प्रदूषण रिपोर्टिंग।',
      taglinePreview: translations.hi.tagline
    },
    {
      code: 'pa',
      label: 'ਪੰਜਾਬੀ',
      scriptName: 'Punjabi (ਗੁਰਮੁਖੀ)',
      description: 'ਪੇਂਡੂ ਪੰਜਾਬ ਦੀਆਂ ਗ੍ਰਾਮ ਪੰਚਾਇਤਾਂ, ਸਕੂਲ, ਹਸਪਤਾਲ ਅਤੇ ਸਰਕਾਰੀ ਫੰਡਾਂ ਦਾ ਵੇਰਵਾ।',
      taglinePreview: translations.pa.tagline
    }
  ];

  const handleChoose = (code: Language) => {
    onSelectLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[92dvh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center text-emerald-700 mb-2">
            <Languages className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Select Language / ਭਾਸ਼ਾ ਚੁਣੋ / भाषा चुनें
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your preferred civic audit and voice assistant language
          </p>
        </div>

        <div className="space-y-3">
          {languages.map(lang => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleChoose(lang.code)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{lang.label}</span>
                    <span className="text-xs text-slate-500 font-medium">({lang.scriptName})</span>
                  </div>
                  <p className="text-xs text-slate-600">{lang.description}</p>
                  <p className="text-[11px] font-medium text-emerald-700 italic pt-1">
                    "{lang.taglinePreview}"
                  </p>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>The Multilingual AI Assistant also natively speaks and listens in English, Hindi, and Punjabi.</span>
        </div>

      </div>
    </div>
  );
};
