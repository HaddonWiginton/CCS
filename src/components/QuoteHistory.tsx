'use client';

import { useState } from 'react';
import { Quote } from '@/lib/types';
import { formatCurrency, formatDate, calcSellingPrice } from '@/lib/utils';

interface Props {
  quotes: Quote[];
  onNew: () => void;
  onOpen: (q: Quote) => void;
  onDuplicate: (q: Quote) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function QuoteHistory({ quotes, onNew, onOpen, onDuplicate, onDelete, darkMode, onToggleDark }: Props) {
  const [search, setSearch] = useState('');

  const filtered = quotes.filter(q => {
    const s = search.toLowerCase();
    return (
      q.customer.name.toLowerCase().includes(s) ||
      q.quoteNumber.toLowerCase().includes(s) ||
      q.workOrder.toLowerCase().includes(s) ||
      q.status.toLowerCase().includes(s) ||
      (q.customer.address || '').toLowerCase().includes(s) ||
      (q.customer.name === '' && 'untitled quote'.includes(s))
    );
  });

  const getDisplayName = (q: Quote) => q.customer.name || 'Untitled Quote';

  const statusColors: Record<string, string> = {
    Draft: 'var(--text-muted)',
    Sent: 'var(--gold)',
    Accepted: 'var(--teal)',
    Expired: 'var(--coral)',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card)' }}>
        <div className="flex items-center gap-3">
          <img src={darkMode ? "/ccs-logo-dark.png" : "/ccs-logo.png"} alt="Complete Commercial Solutions" className="h-10" />
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Facility Services Quoting
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleDark} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onNew} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm" style={{ background: 'var(--teal)' }}>
            <span className="text-lg leading-none">+</span> New Quote
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by customer, quote ID, work order, or status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
            style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--cream-border)' }}>
            <div className="col-span-4">Customer</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2"></div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
              {quotes.length === 0 ? 'No quotes yet — click "+ New Quote" to get started.' : 'No quotes match your search.'}
            </div>
          ) : filtered.map(q => (
            <div
              key={q.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 items-center cursor-pointer border-b last:border-b-0 transition-colors"
              style={{ borderColor: 'var(--cream-border)' }}
              onClick={() => onOpen(q)}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream-card-alt, var(--cream-bg))')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="col-span-4">
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{getDisplayName(q)}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{q.quoteNumber}</div>
              </div>
              <div className="col-span-2 font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(calcSellingPrice(q))}
              </div>
              <div className="col-span-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    color: statusColors[q.status] || 'var(--text-muted)',
                    background: q.status === 'Accepted' ? 'var(--green-bg)' : q.status === 'Sent' ? 'var(--gold-bg)' : q.status === 'Expired' ? '#fdecea' : 'var(--cream-bg)',
                    border: `1px solid ${(statusColors[q.status] || 'var(--text-muted)') + '40'}`,
                  }}
                >
                  {q.status}
                </span>
              </div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(q.createdAt)}
              </div>
              <div className="col-span-2 flex items-center gap-2 justify-end" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onDuplicate(q)}
                  className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors"
                  style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)', background: 'var(--cream-card)' }}
                >
                  Duplicate
                </button>
                <button
                  onClick={() => { if (confirm('Delete this quote?')) onDelete(q.id); }}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--coral)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
