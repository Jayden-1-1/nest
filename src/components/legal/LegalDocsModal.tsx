import React, { useState, useEffect } from 'react';
import { LegalDocId, LEGAL_DOCS_RU, LEGAL_DOCS_EN } from '../../data/legalDocs';
import { useTranslation } from '../../locales';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Trash2, 
  Key, 
  Mail, 
  X, 
  ArrowLeft, 
  Globe, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface LegalDocsModalProps {
  isOpen: boolean;
  initialDocId?: LegalDocId;
  onClose: () => void;
}

export const LegalDocsModal: React.FC<LegalDocsModalProps> = ({
  isOpen,
  initialDocId = 'privacy-guarantee',
  onClose,
}) => {
  const { language, setLanguage } = useTranslation();
  const [selectedDocId, setSelectedDocId] = useState<LegalDocId>(initialDocId);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('detail');

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
      setMobileView('detail');
    }
  }, [initialDocId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const docsRecord = language === 'ru' ? LEGAL_DOCS_RU : LEGAL_DOCS_EN;
  const currentDoc = docsRecord[selectedDocId] || docsRecord['privacy-guarantee'];

  const docIcons: Record<LegalDocId, React.ReactNode> = {
    'privacy-guarantee': <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    'privacy-policy': <Lock className="w-4 h-4 text-primary" />,
    'terms-of-service': <FileText className="w-4 h-4 text-amber-500" />,
    'cookie-policy': <FileText className="w-4 h-4 text-sky-500" />,
    'data-deletion': <Trash2 className="w-4 h-4 text-rose-500" />,
    'security': <Key className="w-4 h-4 text-indigo-500" />,
    'contact': <Mail className="w-4 h-4 text-secondary" />,
  };

  const navOrder: LegalDocId[] = [
    'privacy-guarantee',
    'privacy-policy',
    'terms-of-service',
    'cookie-policy',
    'data-deletion',
    'security',
    'contact',
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full h-full sm:h-[90vh] max-w-5xl bg-surface-container-lowest sm:rounded-3xl border sm:border-surface-container-highest shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest bg-surface-container-low/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Back to List Button */}
            {mobileView === 'detail' && (
              <button
                onClick={() => setMobileView('list')}
                className="sm:hidden p-1.5 -ml-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container"
                title="Назад к списку"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest">
                {language === 'ru' ? 'ПРАВОВОЙ РЕЕСТР // ПРИВАТНОСТЬ' : 'LEGAL REGISTRY // PRIVACY'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg bg-surface-container p-0.5 border border-surface-container-highest">
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  language === 'ru' 
                    ? 'bg-surface text-on-surface shadow-xs' 
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-surface text-on-surface shadow-xs' 
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                EN
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Sidebar + Document Reader */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation Sidebar (hidden on mobile when viewing document detail) */}
          <div 
            className={`w-full sm:w-72 md:w-80 border-r border-surface-container-highest bg-surface-container-lowest/50 shrink-0 flex flex-col ${
              mobileView === 'detail' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-surface-container-highest">
              <span className="font-caption text-xs uppercase font-mono text-secondary tracking-wider">
                {language === 'ru' ? 'Официальные документы' : 'Official Documents'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {navOrder.map((docId) => {
                const doc = docsRecord[docId];
                const isSelected = docId === selectedDocId;

                return (
                  <button
                    key={docId}
                    onClick={() => {
                      setSelectedDocId(docId);
                      setMobileView('detail');
                    }}
                    className={`btn-snappy w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container text-on-surface font-semibold shadow-xs ring-1 ring-surface-container-highest'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="shrink-0">
                      {docIcons[docId]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">
                        {doc.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-surface-container-highest bg-surface-container-low/40">
              <div className="flex items-center justify-between text-[11px] font-mono text-secondary">
                <span>{language === 'ru' ? 'Ревизия: 2026.1' : 'Revision: 2026.1'}</span>
                <span className="text-emerald-500 font-semibold">{language === 'ru' ? 'Активно' : 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Document Content View */}
          <div 
            className={`flex-1 overflow-y-auto p-6 sm:p-10 md:p-12 ${
              mobileView === 'list' ? 'hidden sm:block' : 'block'
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
              
              {/* Document Header */}
              <div className="space-y-3 pb-6 border-b border-surface-container-highest">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold">
                  {docIcons[currentDoc.id]}
                  <span>{currentDoc.lastUpdated}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                  {currentDoc.title}
                </h1>
                <p className="font-body-lg text-secondary text-sm sm:text-base leading-relaxed">
                  {currentDoc.subtitle}
                </p>
              </div>

              {/* Document Sections */}
              <div className="space-y-8">
                {currentDoc.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface">
                      {section.title}
                    </h2>
                    <div className="space-y-2">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx} className="font-body-md text-sm text-secondary leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Signoff Footer */}
              <div className="pt-8 mt-12 border-t border-surface-container-highest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-secondary">
                <div>
                  © 2026 NEST. {language === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:privacy@nest.family"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <span>privacy@nest.family</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
