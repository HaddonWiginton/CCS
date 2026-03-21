'use client';

import { useState, useEffect } from 'react';
import { Quote, ServiceArea, CleaningTask, Discount, ChangeOrder } from '@/lib/types';
import {
  generateId, formatCurrency,
  calcMaterialsTotal, calcLaborTotal, calcOverhead, calcTotalCost,
  calcSellingPrice, calcGrossProfit, calcGPPercent, calcDiscountsTotal,
  calcServiceAreaTotal, calcServicesTotal, calcApprovedChangeOrders,
  PRESET_TASKS, SCOPE_SNIPPETS, ADDON_OPTIONS,
} from '@/lib/utils';
import CustomerSection from './CustomerSection';
import ISSACalculator from './ISSACalculator';

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

export default function QuoteBuilder({ quote, onSave, onBack, onPreview, onNew, onLoad, darkMode, onToggleDark }: Props) {
  const [q, setQ] = useState<Quote>(quote);
  const [newAreaName, setNewAreaName] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState(false);
  const [expandedDiscounts, setExpandedDiscounts] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setQ(quote); }, [quote]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const update = (partial: Partial<Quote>) => {
    setQ(prev => ({ ...prev, ...partial }));
  };

  const save = () => { onSave(q); showToast('Quote saved!'); };

  const toggleArea = (id: string) => {
    setExpandedAreas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Service area helpers
  const addArea = () => {
    const name = newAreaName.trim() || 'Custom Area';
    const presets = PRESET_TASKS[name] || PRESET_TASKS['Custom Area'];
    const area: ServiceArea = {
      id: generateId(),
      name,
      tasks: presets.map(p => ({ id: generateId(), name: p.name, quantity: 1, unitPrice: p.unitPrice, unit: p.unit })),
      scopeItems: [],
      selectedAddons: [],
    };
    update({ serviceAreas: [...q.serviceAreas, area] });
    setExpandedAreas(prev => ({ ...prev, [area.id]: true }));
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

  // Scope helpers
  const addScopeItem = (areaId: string, item: string) => {
    update({
      serviceAreas: q.serviceAreas.map(a =>
        a.id === areaId && !a.scopeItems.includes(item) ? { ...a, scopeItems: [...a.scopeItems, item] } : a
      ),
    });
  };

  const removeScopeItem = (areaId: string, idx: number) => {
    update({
      serviceAreas: q.serviceAreas.map(a =>
        a.id === areaId ? { ...a, scopeItems: a.scopeItems.filter((_, i) => i !== idx) } : a
      ),
    });
  };

  // Add-on helpers
  const toggleAddon = (areaId: string, addonId: string) => {
    update({
      serviceAreas: q.serviceAreas.map(a => {
        if (a.id !== areaId) return a;
        const has = a.selectedAddons.includes(addonId);
        return { ...a, selectedAddons: has ? a.selectedAddons.filter(x => x !== addonId) : [...a.selectedAddons, addonId] };
      }),
    });
  };

  // Change order helpers
  const addChangeOrder = (desc: string, reason: string, amount: number) => {
    const co: ChangeOrder = { id: generateId(), description: desc, reason, amount, status: 'Pending', createdAt: new Date().toISOString() };
    update({ changeOrders: [...(q.changeOrders || []), co] });
  };

  const updateCOStatus = (coId: string, status: ChangeOrder['status']) => {
    update({ changeOrders: (q.changeOrders || []).map(co => co.id === coId ? { ...co, status } : co) });
  };

  const removeCO = (coId: string) => {
    update({ changeOrders: (q.changeOrders || []).filter(co => co.id !== coId) });
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

  // Share
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(q, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${q.quoteNumber}.json`; a.click();
    URL.revokeObjectURL(url);
    setShareOpen(false);
  };

  const servicesTotal = calcServicesTotal(q);
  const materialsTotal = calcMaterialsTotal(q);
  const laborTotal = calcLaborTotal(q);
  const overhead = calcOverhead(q);
  const totalCost = calcTotalCost(q);
  const sellingPrice = calcSellingPrice(q);
  const discountsTotal = calcDiscountsTotal(q);
  const grossProfit = calcGrossProfit(q);
  const gpPercent = calcGPPercent(q);
  const laborDays = q.laborHours > 0 ? (q.laborHours / 8).toFixed(1) : '0';
  const changeOrderTotal = calcApprovedChangeOrders(q);

  const areaIcon = (name: string) => {
    if (name.toLowerCase().includes('office')) return '🏢';
    if (name.toLowerCase().includes('restroom') || name.toLowerCase().includes('bathroom')) return '🚻';
    if (name.toLowerCase().includes('break') || name.toLowerCase().includes('kitchen')) return '☕';
    if (name.toLowerCase().includes('lobby') || name.toLowerCase().includes('common')) return '🚪';
    if (name.toLowerCase().includes('warehouse') || name.toLowerCase().includes('industrial')) return '🏭';
    if (name.toLowerCase().includes('conference')) return '📋';
    return '🏢';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-bg)' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-white font-semibold text-sm shadow-lg" style={{ background: 'var(--teal)' }}>
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { save(); onBack(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            ← All Quotes
          </button>
          <img src="/CCSLogocopy224w.webp" alt="CCS" className="h-7" />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Service Quote Dashboard</span>
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--cream-bg)', color: 'var(--text-muted)' }}>{q.quoteNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-full flex items-center justify-center border text-sm" style={{ borderColor: 'var(--cream-border)', background: 'var(--cream-card)' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onNew} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            + New
          </button>
          <button onClick={save} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            💾 Save
          </button>
          <button onClick={onLoad} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--cream-border)', color: 'var(--text-secondary)' }}>
            📂 Load
          </button>
          <button onClick={() => { save(); onPreview(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'var(--navy)', color: '#fff' }}>
            👁 Preview
          </button>
          <div className="relative">
            <button onClick={() => setShareOpen(!shareOpen)} className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: 'var(--teal)' }}>
              ✈ Share ▾
            </button>
            {shareOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border shadow-lg py-1 z-50" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
                <button onClick={downloadJSON} className="w-full text-left px-4 py-2.5 text-sm hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Download JSON</button>
                <button onClick={() => { save(); onPreview(); setShareOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Print / PDF</button>
                <button onClick={() => { showToast('Email — coming soon'); setShareOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Email Quote</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Left Panel - Builder */}
        <div className="flex-1 p-6 space-y-4" style={{ minWidth: 0 }}>
          {/* Customer & Job Info */}
          <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <button onClick={() => setExpandedCustomer(!expandedCustomer)} className="w-full flex items-center justify-between p-4">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Customer & Job Info</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)', transform: expandedCustomer ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▸</span>
            </button>
            {expandedCustomer && (
              <div className="border-t" style={{ borderColor: 'var(--cream-border)' }}>
                <CustomerSection
                  customer={q.customer}
                  serviceType={q.serviceType}
                  frequency={q.frequency}
                  workOrder={q.workOrder}
                  projectManager={q.projectManager || ''}
                  facilityContact={q.facilityContact || ''}
                  onChange={(field, value) => {
                    if (['serviceType', 'frequency', 'workOrder', 'projectManager', 'facilityContact'].includes(field)) {
                      update({ [field]: value } as any);
                    } else {
                      update({ customer: { ...q.customer, [field]: value } });
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Service Areas */}
          <div>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Service Areas</h2>

            {q.serviceAreas.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--teal)', background: 'var(--cream-card)' }}>
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No service areas added yet</div>
                <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add an area for each zone of the facility (e.g. Office Floor 1, Restrooms, Warehouse)</div>
              </div>
            ) : (
              <div className="space-y-3">
                {q.serviceAreas.map(area => {
                  const isOpen = expandedAreas[area.id] !== false; // default open
                  return (
                    <div key={area.id} className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
                      {/* Area header */}
                      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleArea(area.id)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block', color: 'var(--text-muted)' }}>▸</span>
                          <span className="text-lg">{areaIcon(area.name)}</span>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{area.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color: 'var(--teal)', background: 'var(--green-bg)' }}>
                            {formatCurrency(calcServiceAreaTotal(area))}
                          </span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeArea(area.id); }} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--coral)' }}>✕ Remove</button>
                      </div>

                      {isOpen && (
                        <div className="border-t" style={{ borderColor: 'var(--cream-border)' }}>
                          {/* Tasks */}
                          <div className="p-4">
                            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--teal)' }}>Services / Tasks</div>
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
                                  <input type="text" value={task.name} onChange={e => updateTask(area.id, task.id, 'name', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} placeholder="Task name" />
                                </div>
                                <div className="col-span-2">
                                  <input type="number" value={task.quantity} onChange={e => updateTask(area.id, task.id, 'quantity', Number(e.target.value))} className="w-full px-2 py-1.5 rounded-lg border text-sm text-center" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" />
                                </div>
                                <div className="col-span-2">
                                  <div className="flex items-center rounded-lg border" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)' }}>
                                    <span className="pl-2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                                    <input type="number" value={task.unitPrice} onChange={e => updateTask(area.id, task.id, 'unitPrice', Number(e.target.value))} className="w-full px-1 py-1.5 rounded-lg text-sm bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} min="0" step="0.01" />
                                  </div>
                                </div>
                                <div className="col-span-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {formatCurrency(task.quantity * task.unitPrice)}
                                </div>
                                <div className="col-span-1 text-right">
                                  <button onClick={() => removeTask(area.id, task.id)} className="text-xs px-1" style={{ color: 'var(--coral)' }}>✕</button>
                                </div>
                              </div>
                            ))}
                            <button onClick={() => addTask(area.id)} className="mt-2 text-sm font-medium" style={{ color: 'var(--teal)' }}>+ Add Task</button>
                          </div>

                          {/* Scope of Work */}
                          <div className="p-4 border-t" style={{ borderColor: 'var(--cream-border)' }}>
                            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--teal)' }}>Scope of Work</div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {SCOPE_SNIPPETS.slice(0, 6).map((snip, i) => (
                                <button key={i} onClick={() => addScopeItem(area.id, snip)}
                                  className="px-2.5 py-1 rounded-md text-xs border transition-colors"
                                  style={{
                                    borderColor: 'var(--cream-border)',
                                    color: (area.scopeItems || []).includes(snip) ? 'var(--text-muted)' : 'var(--text-primary)',
                                    background: (area.scopeItems || []).includes(snip) ? 'var(--cream-bg)' : 'var(--cream-card)',
                                    opacity: (area.scopeItems || []).includes(snip) ? 0.5 : 1,
                                  }}
                                >
                                  + {snip.slice(0, 50)}{snip.length > 50 ? '…' : ''}
                                </button>
                              ))}
                            </div>
                            {(area.scopeItems || []).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 py-1.5 text-sm" style={{ borderBottom: `1px solid var(--cream-border)` }}>
                                <span style={{ color: 'var(--teal)' }}>✓</span>
                                <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{item}</span>
                                <button onClick={() => removeScopeItem(area.id, idx)} className="text-xs" style={{ color: 'var(--coral)' }}>✕</button>
                              </div>
                            ))}
                            <input
                              placeholder="Add custom scope item and press Enter..."
                              className="w-full mt-2 px-3 py-2 rounded-lg border text-sm"
                              style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                  addScopeItem(area.id, (e.target as HTMLInputElement).value.trim());
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                          </div>

                          {/* Add-ons */}
                          <div className="p-4 border-t" style={{ borderColor: 'var(--cream-border)' }}>
                            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--teal)' }}>Add-ons & Extras</div>
                            <div className="space-y-2">
                              {ADDON_OPTIONS.map(addon => {
                                const selected = (area.selectedAddons || []).includes(addon.id);
                                return (
                                  <div key={addon.id} onClick={() => toggleAddon(area.id, addon.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                                    style={{
                                      background: selected ? 'var(--green-bg)' : 'var(--cream-bg)',
                                      border: `1px solid ${selected ? 'var(--teal)' : 'var(--cream-border)'}`,
                                    }}
                                  >
                                    <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                                      style={{
                                        border: `2px solid ${selected ? 'var(--teal)' : 'var(--text-muted)'}`,
                                        background: selected ? 'var(--teal)' : 'transparent',
                                        color: selected ? '#fff' : 'transparent',
                                      }}
                                    >{selected ? '✓' : ''}</div>
                                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{addon.name}</span>
                                    <span className="text-sm font-semibold" style={{ color: addon.price > 0 ? 'var(--text-primary)' : 'var(--teal)' }}>
                                      {addon.price > 0 ? formatCurrency(addon.price) : 'Included'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add new area */}
            <div className="flex items-center gap-2 mt-3">
              <select value={newAreaName} onChange={e => setNewAreaName(e.target.value)}
                className="px-3 py-2.5 rounded-lg border text-sm"
                style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
              >
                <option value="">Select area type...</option>
                {Object.keys(PRESET_TASKS).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <input type="text" placeholder="or type custom name" value={newAreaName} onChange={e => setNewAreaName(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border text-sm"
                style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                onKeyDown={e => { if (e.key === 'Enter') addArea(); }}
              />
              <button onClick={addArea} className="flex items-center gap-1 px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background: 'var(--teal)' }}>
                + Add Area
              </button>
            </div>
          </div>

          {/* Labor & Supplies */}
          <div className="rounded-xl border p-4 shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Labor & Supplies</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hourly Rate ($)</label>
                <input type="number" value={q.laborRate} onChange={e => update({ laborRate: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estimated Hours</label>
                <input type="number" value={q.laborHours} onChange={e => update({ laborHours: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.5" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Supplies Cost ($)</label>
                <input type="number" value={q.suppliesCost} onChange={e => update({ suppliesCost: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
              </div>
            </div>
          </div>

          {/* ISSA Workloading Calculator */}
          <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>ISSA Workloading Calculator</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--green-bg)', color: 'var(--teal)' }}>540 Times</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                Select tasks and enter quantities to calculate labor hours using official ISSA cleaning production rates.
              </p>
              <ISSACalculator onApplyHours={(hrs) => update({ laborHours: hrs })} />
            </div>
          </div>

          {/* Change Orders */}
          <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <div className="p-4">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Change Orders</h3>
              {(q.changeOrders || []).map(co => (
                <div key={co.id} className="rounded-lg p-3 mb-2" style={{ background: 'var(--cream-bg)', border: `1px solid var(--cream-border)` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{co.description}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        color: co.status === 'Approved' ? 'var(--teal)' : co.status === 'Declined' ? 'var(--coral)' : 'var(--gold)',
                        background: co.status === 'Approved' ? 'var(--green-bg)' : co.status === 'Declined' ? '#fdecea' : 'var(--gold-bg)',
                      }}
                    >{co.status}</span>
                  </div>
                  {co.reason && <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{co.reason}</div>}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{ color: 'var(--teal)' }}>{formatCurrency(co.amount)}</span>
                    <div className="flex gap-1">
                      {(['Pending', 'Approved', 'Declined'] as const).map(s => (
                        <button key={s} onClick={() => updateCOStatus(co.id, s)}
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            background: co.status === s ? 'var(--teal)' : 'transparent',
                            color: co.status === s ? '#fff' : 'var(--text-muted)',
                            border: `1px solid ${co.status === s ? 'var(--teal)' : 'var(--cream-border)'}`,
                          }}
                        >{s}</button>
                      ))}
                      <button onClick={() => removeCO(co.id)} className="px-1 text-xs" style={{ color: 'var(--coral)' }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input id="co-desc" placeholder="Description" className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} />
                <input id="co-reason" placeholder="Reason" className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} />
                <input id="co-amount" placeholder="$" type="number" className="w-20 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} />
                <button onClick={() => {
                  const desc = (document.getElementById('co-desc') as HTMLInputElement);
                  const reason = (document.getElementById('co-reason') as HTMLInputElement);
                  const amt = (document.getElementById('co-amount') as HTMLInputElement);
                  if (!desc.value.trim()) return;
                  addChangeOrder(desc.value.trim(), reason.value.trim(), Number(amt.value) || 0);
                  desc.value = ''; reason.value = ''; amt.value = '';
                }} className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: 'var(--teal)' }}>Add</button>
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <button onClick={() => setExpandedDiscounts(!expandedDiscounts)} className="w-full flex items-center justify-between p-4">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Credits & Adjustments</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)', transform: expandedDiscounts ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▸</span>
            </button>
            {expandedDiscounts && (
              <div className="p-4 pt-0 space-y-3 border-t" style={{ borderColor: 'var(--cream-border)' }}>
                {q.discounts.map(d => (
                  <div key={d.id} className="flex items-center gap-2 pt-3">
                    <input type="text" placeholder="Name" value={d.name} onChange={e => updateDiscount(d.id, 'name', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} />
                    <select value={d.type} onChange={e => updateDiscount(d.id, 'type', e.target.value)} className="px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}>
                      <option value="fixed">$ Fixed</option>
                      <option value="percentage">% Percent</option>
                    </select>
                    <input type="number" value={d.value} onChange={e => updateDiscount(d.id, 'value', Number(e.target.value))} className="w-24 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" step="0.01" />
                    <button onClick={() => removeDiscount(d.id)} style={{ color: 'var(--coral)' }}>✕</button>
                  </div>
                ))}
                <button onClick={addDiscount} className="text-sm font-medium pt-2" style={{ color: 'var(--teal)' }}>+ Add Credit / Adjustment</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Pricing Summary */}
        <div className="w-96 p-6 sticky top-16 self-start">
          <div className="rounded-xl border shadow-sm p-5" style={{ background: 'var(--cream-card)', borderColor: 'var(--cream-border)' }}>
            <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Pricing Summary</h2>

            <div className="space-y-2">
              {[
                ['Services', formatCurrency(servicesTotal)],
                ['Supplies', formatCurrency(q.suppliesCost)],
                [`Labor (${laborDays} days)`, formatCurrency(laborTotal)],
                [`Overhead (${q.overheadPercent}%)`, formatCurrency(overhead)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{val}</span>
                </div>
              ))}
              {discountsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--teal)' }}>Credits</span>
                  <span style={{ color: 'var(--teal)' }}>−{formatCurrency(discountsTotal)}</span>
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
              <input type="range" min="0" max="100" value={q.marginPercent}
                onChange={e => update({ marginPercent: Number(e.target.value), useCustomPrice: false })}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>0%</span><span>100%</span>
              </div>
            </div>

            {/* Overhead */}
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Overhead %</label>
              <input type="number" value={q.overheadPercent} onChange={e => update({ overheadPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }} min="0" max="100"
              />
            </div>

            {/* Selling Price */}
            <div className="mt-6 rounded-xl border p-4" style={{ background: 'var(--cream-card-alt, var(--cream-bg))', borderColor: 'var(--cream-border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Selling Price</div>
              <div className="flex items-center">
                <span className="text-xl mr-1" style={{ color: 'var(--text-muted)' }}>$</span>
                <input type="number"
                  value={q.useCustomPrice ? q.sellingPrice : Math.round(sellingPrice * 100) / 100}
                  onChange={e => update({ sellingPrice: Number(e.target.value), useCustomPrice: true })}
                  className="text-3xl font-bold bg-transparent outline-none w-full"
                  style={{ color: 'var(--teal)' }}
                  min="0" step="0.01"
                />
              </div>
            </div>

            {/* Profit Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Gross Profit', formatCurrency(grossProfit)],
                ['GP %', gpPercent.toFixed(1) + '%'],
                ['GP / Man Day', formatCurrency(Number(laborDays) > 0 ? grossProfit / Number(laborDays) : 0)],
                ['Net Profit', formatCurrency(grossProfit + changeOrderTotal)],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl border p-3" style={{ background: 'var(--cream-card-alt, var(--cream-bg))', borderColor: 'var(--cream-border)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--teal)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
