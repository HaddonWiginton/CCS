'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quote, ViewMode } from '@/lib/types';
import { createNewQuote, loadQuotes, saveQuotes, generateId, generateQuoteNumber } from '@/lib/utils';
import QuoteHistory from '@/components/QuoteHistory';
import QuoteBuilder from '@/components/QuoteBuilder';
import QuotePreview from '@/components/QuotePreview';

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [view, setView] = useState<ViewMode>('history');
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadQuotes();
    setQuotes(saved);
    const dm = window.localStorage.getItem('ccs-dark-mode');
    if (dm === 'true') { setDarkMode(true); document.documentElement.classList.add('dark'); }
    setLoaded(true);
  }, []);

  const toggleDark = () => {
    setDarkMode(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('ccs-dark-mode', String(next));
      return next;
    });
  };

  const persistQuotes = useCallback((updated: Quote[]) => {
    setQuotes(updated);
    saveQuotes(updated);
  }, []);

  const handleNewQuote = () => {
    const q = createNewQuote();
    const updated = [q, ...quotes];
    persistQuotes(updated);
    setActiveQuote(q);
    setView('builder');
  };

  const handleOpenQuote = (q: Quote) => {
    setActiveQuote(q);
    setView('builder');
  };

  const handleDuplicate = (q: Quote) => {
    const dup = {
      ...JSON.parse(JSON.stringify(q)),
      id: generateId(),
      quoteNumber: generateQuoteNumber(),
      status: 'Draft' as const,
      createdAt: new Date().toISOString(),
    };
    const updated = [dup, ...quotes];
    persistQuotes(updated);
  };

  const handleDelete = (id: string) => {
    persistQuotes(quotes.filter(q => q.id !== id));
  };

  const handleSaveQuote = (q: Quote) => {
    const updated = quotes.map(existing => existing.id === q.id ? q : existing);
    persistQuotes(updated);
    setActiveQuote(q);
  };

  const handleLoadQuote = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const q = JSON.parse(ev.target?.result as string) as Quote;
          const exists = quotes.find(x => x.id === q.id);
          const updated = exists ? quotes.map(x => x.id === q.id ? q : x) : [q, ...quotes];
          persistQuotes(updated);
          setActiveQuote(q);
          setView('builder');
        } catch { alert('Invalid quote file'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      <div className="animate-pulse text-lg" style={{ color: 'var(--text-muted)' }}>Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {view === 'history' && (
        <QuoteHistory
          quotes={quotes}
          onNew={handleNewQuote}
          onOpen={handleOpenQuote}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />
      )}
      {view === 'builder' && activeQuote && (
        <QuoteBuilder
          quote={activeQuote}
          onSave={handleSaveQuote}
          onBack={() => setView('history')}
          onPreview={() => setView('preview')}
          onNew={handleNewQuote}
          onLoad={handleLoadQuote}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />
      )}
      {view === 'preview' && activeQuote && (
        <QuotePreview
          quote={activeQuote}
          onBack={() => setView('builder')}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />
      )}
    </div>
  );
}
