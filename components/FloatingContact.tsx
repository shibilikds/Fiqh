
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisible(false)}></div>

        {/* Modal content */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsVisible(false)}
              aria-label="Close notice"
              className="absolute top-4 end-4 p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-4">
                {/* Trial Notice - Red */}
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-rose-400 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="text-sm font-black text-rose-300 uppercase tracking-widest">{t('home.trial_notice_title', currentLanguage)}</h3>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">{t('home.trial_notice_content', currentLanguage)}</p>
                  </div>
                </div>

                {/* Disclaimer - Orange */}
                <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                  <AlertTriangle className="text-amber-400 mt-1 shrink-0" size={24} />
                  <div>
                    <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">{t('about.disclaimer_title', currentLanguage)}</h3>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">{t('about.disclaimer_content', currentLanguage)}</p>
                  </div>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-xs font-black text-slate-300 mb-3 text-center">{t('contact.floating_title', currentLanguage)}</h4>
              <a 
                href="https://wa.me/919645015590"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-emerald-500/90 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all duration-300 scale-100 active:scale-95 text-white"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">{t('contact.whatsapp_button', currentLanguage)}</span>
              </a>
            </div>
        </div>
    </div>
  );
};

export default FloatingContact;
