'use client';

import { useState, useEffect } from 'react';
import { Quote, ServiceArea, CleaningTask, Discount } from '@/lib/types';
import {
  generateId, formatCurrency,
  calcMaterialsTotal, calcLaborTotal, calcOverhead, calcTotalCost,
  calcSellingPrice, calcGrossProfit, calcGPPercent, calcDiscountsTotal,
  calcServiceAreaTotal
} from '@/lib/utils';
import CustomerSection from './CustomerSection';

interface Props {
  quote: Quote;
  onSave: (q: Quote) => void;
  onBack: () => void;
  onPreview: () => void;
  onNew: () => void;
  onLoad: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const PRESET_TASKS: Record<string, { name: string; unitPrice: number; unit: string }[]> = {
  'Kitchen': [
    { name: 'Surface wiping & sanitizing', unitPrice: 25, unit: 'each' },
    { name: 'Appliance cleaning (exterior)', unitPrice: 15, unit: 'each' },
    { name: 'Appliance cleaning (interior)', unitPrice: 35, unit: 'each' },
    { name: 'Floor mopping', unitPrice: 20, unit: 'each' },
    { name: 'Cabinet wipe-down', unitPrice: 30, unit: 'each' },
    { name: 'Sink & faucet polish', unitPrice: 10, unit: 'each' },
  ],
  'Bathroom': [
    { name: 'Toilet cleaning & sanitizing', unitPrice: 15, unit: 'each' },
    { name: 'Shower/tub scrub', unitPrice: 25, unit: 'each' },
    { name: 'Mirror & glass cleaning', unitPrice: 10, unit: 'each' },
    { name: 'Floor mopping', unitPrice: 15, unit: 'each' },
    { name: 'Vanity & sink cleaning', unitPrice: 12, unit: 'each' },
    { name: 'Grout cleaning', unitPrice: 40, unit: 'each' },
  ],
  'Bedroom': [
    { name: 'Dusting surfaces', unitPrice: 15, unit: 'each' },
    { name: 'Vacuuming carpet/floor', unitPrice: 20, unit: 'each' },
    { name: 'Bed making/linen change', unitPrice: 10, unit: 'each' },
    { name: 'Window cleaning (interior)', unitPrice: 15, unit: 'each' },
  ],
  'Living Area': [
    { name: 'Dusting & surface cleaning', unitPrice: 20, unit: 'each' },
    { name: 'Vacuuming/mopping', unitPrice: 25, unit: 'each' },
    { name: 'Furniture wipe-down', unitPrice: 15, unit: 'each' },
    { name: 'Window cleaning (interior)', unitPrice: 15, unit: 'each' },
  ],
  'Office Space': [
    { name: 'Desk & surface sanitizing', unitPrice: 15, unit: 'each' },
    { name: 'Trash removal', unitPrice: 10, unit: 'each' },
    { name: 'Vacuuming/mopping', unitPrice: 25, unit: 'each' },
    { name: 'Restroom cleaning', unitPrice: 30, unit: 'each' },
    { name: 'Break room cleaning', unitPrice: 25, unit: 'each' },
    { name: 'Window cleaning (interior)', unitPrice: 20, unit: 'each' },
  ],
  'Custom Area': [],
};

export default function QuoteBuilder({ quote, onSave, onBack, onPreview, onNew, onLoad, darkMode, onToggleDark }: Props) {
  const [q, setQ] = useState<Quote>(quote);
  const [newAreaName, setNewAreaName] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState(false);
  const [expandedDiscounts, setExpandedDiscounts] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => { setQ(quote); }, [quote]);

  const update = (partial: Partial<Quote>) => {
    setQ(prev => ({ ...prev, ...partial }));
  };

  const save = () => onSave(q);

  // Service area helpers
  const addArea = () => {
    const name = newAreaName.trim() || 'Custom Area';
    const presets = PRESET_TASKS[name] || PRESET_TASKS['Custom Area'];
    const area: ServiceArea = {
      id: generateId(),
      name,
      tasks: presets.map(p => ({ id: generateId(), name: p.name, quantity: 1, unitPrice: p.unitPrice, unit: p.unit })),
    };
    update({ serviceAreas: [...q.serviceAreas, area] });
    setNewAreaName('');
  };

  const removeArea = (areaId: string) => {
    update({ serviceAreas: q.serviceAreas.filter(a => a.id !== areaId) });
  };

  const updateTask = (areaId: string, taskId: string, field: keyof CleaningTask, value: any) => {
    update({
      serviceAreas: q.serviceAreas.map(a =>
        a.id === areaId ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t) } : a
      ),
    });
  };

  const addTask = (areaId: string) => {
    const task: CleaningTask = { id: generateId(), name: '', quantity: 1, unitPrice: 0, unit: 'each' };
    update({
      serviceAreas: q.serviceAreas.map(a =>
        a.id === areaId ? { ...a, tasks: [...a.tasks, task] } : a
      ),
    });
  };

  const removeTask = (areaId: string, taskId: string) => {
    update({
      serviceAreas: q.serviceAreas.map(a =>
        a.id === areaId ? { ...a, tasks: a.tasks.filter(t => t.id !== taskId) } : a
      ),
    });
  };

  // Discount helpers
  const addDiscount = () => {
    const d: Discount = { id: generateId(), name: '', type: 'fixed', value: 0 };
    update({ discounts: [...q.discounts, d] });
  };

  const updateDiscount = (id: string, field: keyof Discount, value: any) => {
    update({ discounts: q.discounts.map(d => d.id === id ? { ...d, [field]: value } : d) });
  };

  const removeDiscount = (id: string) => {
    update({ discounts: q.discounts.filter(d => d.id !== id) });
  };

  // Share handlers
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(q, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${q.quoteNumber}.json`; a.click();
    URL.revokeObjectURL(url);
    setShareOpen(false);
  };

  const materialsTotal = calcMaterialsTotal(q);
  const laborTotal = calcLaborTotal(q);
  const overhead = calcOverhead(q);
  const totalCost = calcTotalCost(q);
  const sellingPrice = calcSellingPrice(q);
  const discountsTotal = calcDiscountsTotal(q);
  const grossProfit = calcGrossProfit(q);
  const gpPercent = calcGPPercent(q);
  const laborDays = q.laborHours > 0 ? (q.laborHours / 8).toFixed(1) : '0';

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { save(); onBack(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            ← All Quotes
          </button>
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--teal)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 6l3 1 1-3"/><path d="M6 7l-2 10a2 2 0 001.5 2.4l10 2a2 2 0 002.3-1.5L20 10"/></svg>
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Cleaning Quote Dashboard</span>
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--cream-card)', color: 'var(--text-muted)' }}>{q.quoteNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-full flex items-center justify-center border text-sm" style={{ borderColor: 'var(--cream-border)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onNew} className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            + New
          </button>
          <button onClick={save} className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            💾 Save
          </button>
          <button onClick={onLoad} className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            📂 Load
          </button>
          <button onClick={() => { save(); onPreview(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            👁 Preview
          </button>
          <div className="relative">
            <button onClick={() => setShareOpen(!shareOpen)} className="flex items-center gap-1 px-4 py-1.5 rounded-md text-white text-sm font-medium" style={{ background: 'var(--teal)' }}>
              ✈ Share ▾
            </button>
            {shareOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg py-1 z-50" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
                <button onClick={downloadJSON} className="w-full text-left px-4 py-2 text-sm hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Download JSON</button>
                <button onClick={() => { save(); onPreview(); setShareOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Print / PDF</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel - Builder */}
        <div className="flex-1 max-w-4xl p-6 space-y-6">
          {/* Customer & Job Info */}
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <button onClick={() => setExpandedCustomer(!expandedCustomer)} className="w-full flex items-center justify-between p-4">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Customer & Job Info</span>
              <span style={{ color: 'var(--text-muted)' }}>{expandedCustomer ? '▾' : '▸'}</span>
            </button>
            {expandedCustomer && (
              <CustomerSection
                customer={q.customer}
                serviceType={q.serviceType}
                frequency={q.frequency}
                workOrder={q.workOrder}
                onChange={(field, value) => {
                  if (['serviceType', 'frequency', 'workOrder'].includes(field)) {
                    update({ [field]: value });
                  } else {
                    update({ customer: { ...q.customer, [field]: value } });
                  }
                }}
              />
            )}
          </div>

          {/* Service Areas */}
          <div>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Service Areas</h2>

            {q.serviceAreas.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--teal)', background: 'transparent' }}>
                <div className="text-3xl mb-2">🏠</div>
                <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No service areas added yet</div>
                <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add an area for each zone to clean (e.g. Kitchen, Bathrooms, Bedrooms)</div>
                <div className="flex items-center justify-center gap-2">
                  <select
                    value={newAreaName}
                    onChange={e => setNewAreaName(e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select area type...</option>
                    {Object.keys(PRESET_TASKS).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="or type custom name"
                    value={newAreaName}
                    onChange={e => setNewAreaName(e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                  />
                  <button onClick={addArea} className="flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: 'var(--teal)' }}>
                    + Add Area
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {q.serviceAreas.map(area => (
                  <div key={area.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--cream-border)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {area.name.includes('Kitchen') ? '🍳' : area.name.includes('Bathroom') ? '🚿' : area.name.includes('Bedroom') ? '🛏' : area.name.includes('Living') ? '🛋' : area.name.includes('Office') ? '💼' : '🏠'}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{area.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--cream-bg)', color: 'var(--text-muted)' }}>
                          {formatCurrency(calcServiceAreaTotal(area))}
                        </span>
                      </div>
                      <button onClick={() => removeArea(area.id)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--coral)' }}>✕ Remove</button>
                    </div>
                    <div className="p-4">
                      {/* Tasks table */}
                      <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <div className="col-span-5">Task</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2">Total</div>
                        <div className="col-span-1"></div>
                      </div>
                      {area.tasks.map(task => (
                        <div key={task.id} className="grid grid-cols-12 gap-2 items-center py-1.5">
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={task.name}
                              onChange={e => updateTask(area.id, task.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 rounded border text-sm"
                              style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                              placeholder="Task name"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={task.quantity}
                              onChange={e => updateTask(area.id, task.id, 'quantity', Number(e.target.value))}
                              className="w-full px-2 py-1 rounded border text-sm text-center"
                              style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                              min="0"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center rounded border" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)' }}>
                              <span className="pl-2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                              <input
                                type="number"
                                value={task.unitPrice}
                                onChange={e => updateTask(area.id, task.id, 'unitPrice', Number(e.target.value))}
                                className="w-full px-1 py-1 rounded text-sm bg-transparent outline-none"
                                style={{ color: 'var(--text-primary)' }}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <div className="col-span-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(task.quantity * task.unitPrice)}
                          </div>
                          <div className="col-span-1 text-right">
                            <button onClick={() => removeTask(area.id, task.id)} className="text-xs" style={{ color: 'var(--coral)' }}>✕</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addTask(area.id)} className="mt-2 text-sm font-medium" style={{ color: 'var(--teal)' }}>
                        + Add Task
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new area */}
                <div className="flex items-center gap-2 pt-2">
                  <select
                    value={newAreaName}
                    onChange={e => setNewAreaName(e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select area type...</option>
                    {Object.keys(PRESET_TASKS).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="or type custom name"
                    value={newAreaName}
                    onChange={e => setNewAreaName(e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                  />
                  <button onClick={addArea} className="flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: 'var(--teal)' }}>
                    + Add Area
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Labor & Supplies */}
          <div className="rounded-xl border p-4" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Labor & Supplies</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Hourly Rate ($)</label>
                <input type="number" value={q.laborRate} onChange={e => update({ laborRate: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Estimated Hours</label>
                <input type="number" value={q.laborHours} onChange={e => update({ laborHours: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.5" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Supplies Cost ($)</label>
                <input type="number" value={q.suppliesCost} onChange={e => update({ suppliesCost: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
              </div>
            </div>
          </div>

          {/* Discounts & Add-ons */}
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <button onClick={() => setExpandedDiscounts(!expandedDiscounts)} className="w-full flex items-center justify-between p-4">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Discounts & Add-ons</span>
              <span style={{ color: 'var(--text-muted)' }}>{expandedDiscounts ? '▾' : '▸'}</span>
            </button>
            {expandedDiscounts && (
              <div className="p-4 pt-0 space-y-3">
                {q.discounts.map(d => (
                  <div key={d.id} className="flex items-center gap-2">
                    <input type="text" placeholder="Discount name" value={d.name} onChange={e => updateDiscount(d.id, 'name', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} />
                    <select value={d.type} onChange={e => updateDiscount(d.id, 'type', e.target.value)} className="px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}>
                      <option value="fixed">$ Fixed</option>
                      <option value="percentage">% Percent</option>
                    </select>
                    <input type="number" value={d.value} onChange={e => updateDiscount(d.id, 'value', Number(e.target.value))} className="w-24 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
                    <button onClick={() => removeDiscount(d.id)} style={{ color: 'var(--coral)' }}>✕</button>
                  </div>
                ))}
                <button onClick={addDiscount} className="text-sm font-medium" style={{ color: 'var(--teal)' }}>+ Add Discount</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Pricing Summary */}
        <div className="w-96 p-6 sticky top-16 self-start">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>PRICING SUMMARY</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Services</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(materialsTotal - q.suppliesCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Supplies</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(q.suppliesCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Labor ({laborDays} days)</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(laborTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Overhead ({q.overheadPercent}%)</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(overhead)}</span>
            </div>
            {discountsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--sage)' }}>Discounts</span>
                <span style={{ color: 'var(--sage)' }}>-{formatCurrency(discountsTotal)}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: 'var(--teal)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total Cost</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalCost)}</span>
            </div>
          </div>

          {/* Margin Slider */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Gross Margin</span>
              <span className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{q.marginPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={q.marginPercent}
              onChange={e => update({ marginPercent: Number(e.target.value), useCustomPrice: false })}
              className="w-full accent-teal-600"
              style={{ accentColor: 'var(--teal)' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>0%</span><span>100%</span>
            </div>
          </div>

          {/* Overhead */}
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Overhead %</label>
            <input type="number" value={q.overheadPercent} onChange={e => update({ overheadPercent: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" max="100" />
          </div>

          {/* Selling Price */}
          <div className="mt-6 rounded-xl border p-4" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Selling Price</div>
            <div className="flex items-center">
              <span className="text-xl mr-1" style={{ color: 'var(--text-muted)' }}>$</span>
              <input
                type="number"
                value={q.useCustomPrice ? q.sellingPrice : Math.round(sellingPrice * 100) / 100}
                onChange={e => update({ sellingPrice: Number(e.target.value), useCustomPrice: true })}
                className="text-3xl font-bold bg-transparent outline-none w-full"
                style={{ color: 'var(--teal)' }}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Profit Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Gross Profit</div>
              <div className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{formatCurrency(grossProfit)}</div>
            </div>
            <div className="rounded-xl border p-3" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>GP %</div>
              <div className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{gpPercent.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl border p-3" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>GP / Man Day</div>
              <div className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{formatCurrency(Number(laborDays) > 0 ? grossProfit / Number(laborDays) : 0)}</div>
            </div>
            <div className="rounded-xl border p-3" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Net Profit</div>
              <div className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{formatCurrency(grossProfit)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
