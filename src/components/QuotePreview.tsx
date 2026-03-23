'use client';

import { useState, useRef } from 'react';
import { Quote } from '@/lib/types';
import {
  formatCurrency, formatDateLong, calcServiceAreaTotal,
  calcMaterialsTotal, calcLaborTotal, calcOverhead,
  calcTotalCost, calcSellingPrice, calcDiscountsTotal,
  calcServicesTotal, calcApprovedChangeOrders,
  ADDON_OPTIONS,
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
  const changeOrderTotal = calcApprovedChangeOrders(q);
  const finalPrice = sellingPrice - discountsTotal + changeOrderTotal;

  const customerName = q.customer.name || 'Customer';
  const address = [q.customer.address, q.customer.city, q.customer.state, q.customer.zip].filter(Boolean).join(', ');

  const [sigName, setSigName] = useState('');
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: any) => {
    setDrawing(true);
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkMode ? '#e8e9ec' : '#2c2c2c';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)', color: 'var(--text-primary)' }}>
      {/* Top bar */}
      <div className="no-print flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card)' }}>
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-full flex items-center justify-center border text-sm" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handlePrint} className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: 'var(--teal)' }}>
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {/* Proposal */}
      <div className="max-w-3xl mx-auto my-8 rounded-2xl shadow-lg overflow-hidden" style={{ background: 'var(--cream-card)' }}>
        {/* Header band */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--teal), var(--navy))' }} />

        {/* Company Logo */}
        <div className="text-center pt-10 pb-6">
          <img src="/ccs-logo.png" alt="Complete Commercial Solutions" className="h-20 mx-auto mb-4" />
        </div>

        {/* Title */}
        <div className="text-center pb-6">
          <h2 className="text-3xl font-light tracking-widest" style={{ color: 'var(--teal)' }}>
            SERVICE PROPOSAL
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Prepared for <strong style={{ color: 'var(--text-primary)' }}>{customerName}</strong>
          </p>
        </div>

        {/* Meta info */}
        <div className="px-10 pb-6 flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--teal)' }}>Facility Address</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{address || '—'}</div>
            {q.customer.squareFootage && (
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{q.customer.squareFootage} sq ft · {q.customer.propertyType}</div>
            )}
          </div>
          <div className="text-right text-sm">
            <div>Prepared: <strong>{formatDateLong(q.createdAt)}</strong></div>
            <div>Valid through: <strong style={{ color: 'var(--teal)' }}>{formatDateLong(q.validUntil)}</strong></div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>#{q.quoteNumber}</div>
          </div>
        </div>

        <hr className="mx-10" style={{ borderColor: 'var(--cream-border)' }} />

        {/* Quote Details */}
        <div className="mx-10 my-6 rounded-xl p-4" style={{ background: 'var(--cream-card-alt, var(--cream-bg))' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>Quote Details</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Service Type: </span>
              <strong>{q.serviceType}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Frequency: </span>
              <strong>{q.frequency}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Work Order: </span>
              <strong>{q.workOrder || '—'}</strong>
            </div>
          </div>
          {(q.projectManager || q.facilityContact) && (
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              {q.projectManager && <div><span style={{ color: 'var(--text-secondary)' }}>Project Manager: </span><strong>{q.projectManager}</strong></div>}
              {q.facilityContact && <div><span style={{ color: 'var(--text-secondary)' }}>Facility Contact: </span><strong>{q.facilityContact}</strong></div>}
            </div>
          )}
        </div>

        {/* Service Areas */}
        {q.serviceAreas.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No service areas configured</div>
        ) : (
          <div className="mx-10 mb-6 space-y-4">
            {q.serviceAreas.map(area => (
              <div key={area.id} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cream-border)' }}>
                <div className="flex justify-between items-center px-4 py-3" style={{ background: 'var(--cream-card-alt, var(--cream-bg))' }}>
                  <div className="font-semibold text-sm">{area.name}</div>
                  <div className="font-bold text-sm" style={{ color: 'var(--teal)' }}>{formatCurrency(calcServiceAreaTotal(area))}</div>
                </div>

                {/* Tasks table */}
                {area.tasks.length > 0 && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: 'var(--text-muted)' }}>
                        <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider">Service</th>
                        <th className="text-center px-2 py-2 text-xs font-semibold uppercase tracking-wider">Qty</th>
                        <th className="text-right px-2 py-2 text-xs font-semibold uppercase tracking-wider">Rate</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {area.tasks.map(t => (
                        <tr key={t.id} className="border-t" style={{ borderColor: 'var(--cream-border)' }}>
                          <td className="px-4 py-2">{t.name}</td>
                          <td className="text-center px-2 py-2">{t.quantity}</td>
                          <td className="text-right px-2 py-2">{formatCurrency(t.unitPrice)}</td>
                          <td className="text-right px-4 py-2 font-medium">{formatCurrency(t.quantity * t.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Scope of Work */}
                {area.scopeItems && area.scopeItems.length > 0 && (
                  <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--cream-border)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>Scope of Work</div>
                    <ul className="list-none space-y-1">
                      {area.scopeItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--teal)' }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add-ons */}
                {area.selectedAddons && area.selectedAddons.length > 0 && (
                  <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--cream-border)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>Included Add-ons</div>
                    {area.selectedAddons.map(aid => {
                      const addon = ADDON_OPTIONS.find(a => a.id === aid);
                      if (!addon) return null;
                      return (
                        <div key={aid} className="flex justify-between text-sm py-0.5">
                          <span style={{ color: 'var(--text-secondary)' }}>{addon.name}</span>
                          <span style={{ color: addon.price > 0 ? 'var(--text-primary)' : 'var(--teal)' }}>
                            {addon.price > 0 ? formatCurrency(addon.price) : 'Included'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Approved Change Orders */}
        {(q.changeOrders || []).filter(co => co.status === 'Approved').length > 0 && (
          <div className="mx-10 mb-6 rounded-xl border p-4" style={{ borderColor: 'var(--cream-border)', background: 'var(--gold-bg)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold)' }}>Approved Change Orders</div>
            {q.changeOrders.filter(co => co.status === 'Approved').map(co => (
              <div key={co.id} className="flex justify-between text-sm py-1">
                <span>{co.description}</span>
                <span className="font-semibold">{formatCurrency(co.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="mx-10 mb-6 rounded-xl p-5" style={{ background: 'var(--cream-card-alt, var(--cream-bg))' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--teal)' }}>Pricing Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Services</span>
              <span>{formatCurrency(calcServicesTotal(q))}</span>
            </div>
            {q.suppliesCost > 0 && (
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Supplies</span>
                <span>{formatCurrency(q.suppliesCost)}</span>
              </div>
            )}
            {calcLaborTotal(q) > 0 && (
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Labor</span>
                <span>{formatCurrency(calcLaborTotal(q))}</span>
              </div>
            )}
            {discountsTotal > 0 && (
              <div className="flex justify-between" style={{ color: 'var(--teal)' }}>
                <span>Credits & Adjustments</span>
                <span>−{formatCurrency(discountsTotal)}</span>
              </div>
            )}
            {changeOrderTotal > 0 && (
              <div className="flex justify-between" style={{ color: 'var(--gold)' }}>
                <span>Change Orders</span>
                <span>+{formatCurrency(changeOrderTotal)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Investment Summary */}
        <div className="mx-10 mb-6 rounded-2xl p-8 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--navy), var(--teal))' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-80">Investment Summary</div>
          <div className="text-4xl font-bold">{formatCurrency(finalPrice)}</div>
          {discountsTotal > 0 && <div className="text-xs mt-2 opacity-70">After credits of {formatCurrency(discountsTotal)}</div>}
          {q.frequency !== 'One-time' && (
            <div className="text-xs mt-1 opacity-70">Billed {q.frequency.toLowerCase()}</div>
          )}
        </div>

        {/* Payment Terms */}
        <div className="mx-10 mb-6 rounded-xl border p-4" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card-alt, var(--cream-bg))' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>Payment Terms</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.paymentTerms}</p>
        </div>

        {/* Notes */}
        {q.customer.notes && (
          <div className="mx-10 mb-6 rounded-xl border p-4" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card-alt, var(--cream-bg))' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>Special Notes</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.customer.notes}</p>
          </div>
        )}

        {/* Digital Signature */}
        <div className="mx-10 mb-10 rounded-xl border p-6" style={{ borderColor: 'var(--cream-border)' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--teal)' }}>Digital Acceptance</div>
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</label>
            <input type="text" value={sigName} onChange={e => setSigName(e.target.value)} placeholder="Type your full name"
              className="w-full max-w-sm px-3 py-2 rounded-lg border text-sm"
              style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Signature</label>
            <canvas ref={canvasRef} width={400} height={120}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              className="rounded-lg border cursor-crosshair"
              style={{ display: 'block', width: '100%', maxWidth: 400, height: 120, background: 'var(--cream-bg)', borderColor: 'var(--cream-border)' }}
            />
            <div className="flex gap-3 mt-3">
              <button onClick={clearSig} className="px-3 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>Clear</button>
              <button onClick={() => setSigned(true)} disabled={!sigName}
                className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold disabled:opacity-40"
                style={{ background: 'var(--teal)' }}
              >Accept Proposal</button>
            </div>
            {signed && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--green-bg)', border: '1px solid var(--teal)' }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--teal)' }}>
                  ✓ Proposal accepted by {sigName}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs" style={{ color: 'var(--text-muted)', background: 'var(--cream-card-alt, var(--cream-bg))' }}>
          <p>Complete Commercial Solutions — Expert Care for Your Facility</p>
          <p className="mt-1">Questions? Contact us at info@completecommercialsolutions.com</p>
        </div>
      </div>
    </div>
  );
}
