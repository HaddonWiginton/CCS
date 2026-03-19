'use client';

import { useState } from 'react';
import { Quote } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

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
      (q.customer.name === '' && 'untitled quote'.includes(s))
    );
  });

  const getDisplayName = (q: Quote) => q.customer.name || 'Untitled Quote';
  const getAmount = (q: Quote) => {
    const tasks = q.serviceAreas.reduce((sum, a) => sum + a.tasks.reduce((s, t) => s + t.quantity * t.unitPrice, 0), 0);
    return tasks + q.suppliesCost + q.laborRate * q.laborHours;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--cream-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6l3 1 1-3"/>
              <path d="M6 7l-2 10a2 2 0 001.5 2.4l10 2a2 2 0 002.3-1.5L20 10"/>
              <path d="M10 14l5-5"/>
              <path d="M14 10l1 1"/>
              <path d="M10 14l1 1"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
            Cleaning Quote History
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleDark} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onNew} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium" style={{ background: 'var(--teal)' }}>
            <span className="text-lg">+</span> New Quote
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by customer, quote ID, or work order..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
            style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          <div className="col-span-5">Customer</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1"></div>
        </div>

        {/* Quote Rows */}
        <div className="divide-y" style={{ borderColor: 'var(--cream-border)' }}>
          {filtered.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
              {quotes.length === 0 ? 'No quotes yet. Click "+ New Quote" to get started.' : 'No quotes match your search.'}
            </div>
          )}
          {filtered.map(q => (
            <div
              key={q.id}
              className="grid grid-cols-12 gap-4 px-4 py-4 items-center cursor-pointer rounded-lg hover:shadow-sm transition-all"
              style={{ borderColor: 'var(--cream-border)' }}
              onClick={() => onOpen(q)}
            >
              <div className="col-span-5">
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{getDisplayName(q)}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{q.quoteNumber}</div>
              </div>
              <div className="col-span-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(getAmount(q))}
              </div>
              <div className="col-span-2">
                <span className={`text-sm ${q.status === 'Accepted' ? 'text-green-600' : q.status === 'Sent' ? 'text-blue-600' : q.status === 'Declined' ? 'text-red-500' : ''}`} style={q.status === 'Draft' ? { color: 'var(--text-secondary)' } : {}}>
                  {q.status}
                </span>
              </div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(q.createdAt)}
              </div>
              <div className="col-span-1 flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onDuplicate(q)}
                  className="px-3 py-1.5 text-xs rounded-md border font-medium"
                  style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}
                >
                  Duplicate
                </button>
                <button
                  onClick={() => { if (confirm('Delete this quote?')) onDelete(q.id); }}
                  className="p-1.5 rounded-md"
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
