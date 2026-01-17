
import React, { useState } from 'react';
import { MessageCircle, AlertTriangle, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../services/translations';

interface Props {
  currentLanguage: Language;
}

const FloatingContact: React.FC<Props> = ({ currentLanguage }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 end-4 md:bottom-6 md:end-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5">
        <button 
          onClick={() => setIsVisible(false)}
          aria-label="Close notice"
          className="absolute top-3 end-3 p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={16} />
        </button>
        
        <div className="space-y-4">
            {/* Trial Notice - Red */}
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-rose-400 mt-1 shrink-0" size={20} />
              <div>
                <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest">{t('home.trial_notice_title', currentLanguage)}</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{t('home.trial_notice_content', currentLanguage)}</p>
              </div>
            </div>

            {/* Disclaimer - Orange */}
            <div className="flex items-start gap-4 pt-4 border-t border-white/5">
              <AlertTriangle className="text-amber-400 mt-1 shrink-0" size={20} />
              <div>
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">{t('about.disclaimer_title', currentLanguage)}</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{t('about.disclaimer_content', currentLanguage)}</p>
              </div>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-xs font-black text-slate-200 mb-3">{t('contact.floating_title', currentLanguage)}</h4>
          <a 
            href="https://wa.me/919645015590"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-emerald-500/90 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all duration-300 scale-100 active:scale-95 text-white"
          >
            <MessageCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t('contact.whatsapp_button', currentLanguage)}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingContact;
