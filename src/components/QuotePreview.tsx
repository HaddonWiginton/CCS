'use client';

import { Quote } from '@/lib/types';
import {
  formatCurrency, formatDateLong, calcServiceAreaTotal,
  calcMaterialsTotal, calcLaborTotal, calcOverhead,
  calcTotalCost, calcSellingPrice, calcDiscountsTotal
} from '@/lib/utils';

interface Props {
  quote: Quote;
  onBack: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function QuotePreview({ quote, onBack, darkMode, onToggleDark }: Props) {
  const q = quote;
  const sellingPrice = calcSellingPrice(q);
  const discountsTotal = calcDiscountsTotal(q);
  const finalPrice = sellingPrice - discountsTotal;

  const handlePrint = () => window.print();

  const customerName = q.customer.name || 'Customer';
  const address = [q.customer.address, q.customer.city, q.customer.state, q.customer.zip].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {/* Top bar */}
      <div className="no-print flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--cream-border)' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-full flex items-center justify-center border text-sm" style={{ borderColor: 'var(--cream-border)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handlePrint} className="px-4 py-1.5 rounded-lg text-white text-sm font-medium" style={{ background: 'var(--teal)' }}>
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {/* Proposal */}
      <div className="max-w-3xl mx-auto my-8 bg-white rounded-2xl shadow-lg overflow-hidden" style={{ color: '#2d2a26' }}>
        {/* Header band */}
        <div className="h-2" style={{ background: 'linear-gradient(90deg, var(--teal), var(--coral))' }} />

        {/* Company Logo / Name */}
        <div className="text-center pt-10 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'var(--teal)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6l3 1 1-3"/>
                <path d="M6 7l-2 10a2 2 0 001.5 2.4l10 2a2 2 0 002.3-1.5L20 10"/>
                <path d="M10 14l5-5"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-wide" style={{ color: 'var(--teal)', fontFamily: 'Georgia, serif' }}>
            SPARKLE PRO
          </h1>
          <div className="text-sm tracking-widest uppercase mt-1" style={{ color: 'var(--coral)' }}>
            Professional Cleaning Services
          </div>
        </div>

        {/* Title */}
        <div className="text-center pb-6">
          <h2 className="text-2xl font-light tracking-wide" style={{ color: 'var(--teal)', fontFamily: 'Georgia, serif' }}>
            SERVICE PROPOSAL
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#6b6560' }}>
            Prepared for <strong>{customerName}</strong>
          </p>
        </div>

        {/* Meta info */}
        <div className="px-10 pb-6 flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--teal)' }}>Property Address</div>
            <div className="text-sm" style={{ color: '#6b6560' }}>{address || '—'}</div>
          </div>
          <div className="text-right text-sm">
            <div>Prepared: <strong>{formatDateLong(q.createdAt)}</strong></div>
            <div>Valid through: <strong style={{ color: 'var(--coral)' }}>{formatDateLong(q.validUntil)}</strong></div>
            <div className="text-xs mt-1" style={{ color: '#9b9590' }}>#{q.quoteNumber}</div>
          </div>
        </div>

        <hr className="mx-10" style={{ borderColor: '#e0d3be' }} />

        {/* Quote Details */}
        <div className="mx-10 my-6 rounded-xl p-4" style={{ background: '#f5f0e8' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--coral)' }}>Quote Details</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span style={{ color: '#6b6560' }}>Service Type: </span>
              <strong>{q.serviceType}</strong>
            </div>
            <div>
              <span style={{ color: '#6b6560' }}>Frequency: </span>
              <strong>{q.frequency}</strong>
            </div>
            <div>
              <span style={{ color: '#6b6560' }}>Work Order: </span>
              <strong>{q.workOrder || '—'}</strong>
            </div>
          </div>
          {q.customer.squareFootage && (
            <div className="text-sm mt-2">
              <span style={{ color: '#6b6560' }}>Property Size: </span>
              <strong>{q.customer.squareFootage} sq ft</strong>
            </div>
          )}
        </div>

        {/* Service Areas Breakdown */}
        {q.serviceAreas.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: '#9b9590' }}>No services configured</div>
        ) : (
          <div className="mx-10 mb-6 space-y-4">
            {q.serviceAreas.map(area => (
              <div key={area.id} className="rounded-xl border overflow-hidden" style={{ borderColor: '#e0d3be' }}>
                <div className="flex justify-between items-center px-4 py-3" style={{ background: '#faf8f5' }}>
                  <div className="font-semibold text-sm">{area.name}</div>
                  <div className="font-bold text-sm" style={{ color: 'var(--teal)' }}>{formatCurrency(calcServiceAreaTotal(area))}</div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#faf8f5', color: '#9b9590' }}>
                      <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider">Service</th>
                      <th className="text-center px-2 py-2 text-xs font-semibold uppercase tracking-wider">Qty</th>
                      <th className="text-right px-2 py-2 text-xs font-semibold uppercase tracking-wider">Rate</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {area.tasks.map(t => (
                      <tr key={t.id} className="border-t" style={{ borderColor: '#f0ebe5' }}>
                        <td className="px-4 py-2">{t.name}</td>
                        <td className="text-center px-2 py-2">{t.quantity}</td>
                        <td className="text-right px-2 py-2">{formatCurrency(t.unitPrice)}</td>
                        <td className="text-right px-4 py-2 font-medium">{formatCurrency(t.quantity * t.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="mx-10 mb-6 rounded-xl p-5" style={{ background: '#f5f0e8' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--coral)' }}>Pricing Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#6b6560' }}>Services</span>
              <span>{formatCurrency(calcMaterialsTotal(q) - q.suppliesCost)}</span>
            </div>
            {q.suppliesCost > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#6b6560' }}>Supplies</span>
                <span>{formatCurrency(q.suppliesCost)}</span>
              </div>
            )}
            {calcLaborTotal(q) > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#6b6560' }}>Labor</span>
                <span>{formatCurrency(calcLaborTotal(q))}</span>
              </div>
            )}
            {discountsTotal > 0 && (
              <div className="flex justify-between" style={{ color: 'var(--sage)' }}>
                <span>Discounts</span>
                <span>-{formatCurrency(discountsTotal)}</span>
              </div>
            )}
            <hr style={{ borderColor: '#e0d3be' }} />
            <div className="flex justify-between text-lg font-bold pt-1">
              <span>Total</span>
              <span style={{ color: 'var(--teal)' }}>{formatCurrency(finalPrice)}</span>
            </div>
            {q.frequency !== 'One-time' && (
              <div className="text-xs text-right" style={{ color: '#9b9590' }}>
                Billed {q.frequency.toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mx-10 mb-6 rounded-xl border p-4" style={{ borderColor: '#e0d3be', background: '#faf8f5' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--coral)' }}>Payment Terms</div>
          <p className="text-sm leading-relaxed" style={{ color: '#6b6560' }}>{q.paymentTerms}</p>
        </div>

        {/* Notes */}
        {q.customer.notes && (
          <div className="mx-10 mb-6 rounded-xl border p-4" style={{ borderColor: '#e0d3be', background: '#faf8f5' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--coral)' }}>Special Notes</div>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6560' }}>{q.customer.notes}</p>
          </div>
        )}

        {/* Signature area */}
        <div className="mx-10 mb-10 grid grid-cols-2 gap-8">
          <div>
            <div className="border-b mb-2 pb-8" style={{ borderColor: '#e0d3be' }} />
            <div className="text-xs" style={{ color: '#9b9590' }}>Customer Signature / Date</div>
          </div>
          <div>
            <div className="border-b mb-2 pb-8" style={{ borderColor: '#e0d3be' }} />
            <div className="text-xs" style={{ color: '#9b9590' }}>Company Representative / Date</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs" style={{ color: '#9b9590', background: '#faf8f5' }}>
          <p>Thank you for choosing Sparkle Pro Cleaning Services</p>
          <p className="mt-1">Questions? Contact us at info@sparklepro.com | (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
