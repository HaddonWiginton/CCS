'use client';

import { useState, useMemo } from 'react';
import { ISSA_TIMES, ISSA_CATEGORIES, ISSATask, calcISSATime, minutesToHours } from '@/lib/issa-times';

interface WorkloadItem {
  taskId: string;
  quantity: number;
}

interface Props {
  onApplyHours: (hours: number) => void;
}

export default function ISSACalculator({ onApplyHours }: Props) {
  const [items, setItems] = useState<WorkloadItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ISSA_CATEGORIES[0]);
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    return ISSA_TIMES.filter(t => {
      const matchCat = t.category === selectedCategory;
      const matchSearch = !search || t.task.toLowerCase().includes(search.toLowerCase()) || t.tool.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const totalMinutes = useMemo(() => {
    return items.reduce((sum, item) => {
      const task = ISSA_TIMES.find(t => t.id === item.taskId);
      if (!task || !item.quantity) return sum;
      return sum + calcISSATime(task, item.quantity);
    }, 0);
  }, [items]);

  const totalHours = minutesToHours(totalMinutes);

  const addItem = (task: ISSATask) => {
    if (items.find(i => i.taskId === task.id)) return;
    setItems(prev => [...prev, { taskId: task.id, quantity: 0 }]);
  };

  const updateQty = (taskId: string, qty: number) => {
    setItems(prev => prev.map(i => i.taskId === taskId ? { ...i, quantity: qty } : i));
  };

  const removeItem = (taskId: string) => {
    setItems(prev => prev.filter(i => i.taskId !== taskId));
  };

  const unitLabel = (task: ISSATask) => {
    if (task.unit === 'sqft') return 'sq ft';
    if (task.unit === 'fixture') return 'fixtures';
    if (task.unit === 'flight') return 'flights';
    if (task.unit === 'pane') return 'panes';
    return 'units';
  };

  return (
    <div>
      {/* Selected workload items */}
      {items.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>
            Workload Items
          </div>
          {items.map(item => {
            const task = ISSA_TIMES.find(t => t.id === item.taskId);
            if (!task) return null;
            const mins = calcISSATime(task, item.quantity);
            return (
              <div key={item.taskId} className="flex items-center gap-2 py-2 text-sm" style={{ borderBottom: '1px solid var(--cream-border)' }}>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{task.task}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{task.tool}</div>
                </div>
                <input
                  type="number"
                  value={item.quantity || ''}
                  onChange={e => updateQty(item.taskId, Number(e.target.value))}
                  placeholder={unitLabel(task)}
                  className="w-24 px-2 py-1 rounded-lg border text-sm text-center"
                  style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
                  min="0"
                />
                <span className="text-xs w-12 text-right" style={{ color: 'var(--text-muted)' }}>{unitLabel(task)}</span>
                <span className="text-xs w-16 text-right font-medium" style={{ color: 'var(--teal)' }}>
                  {mins > 0 ? `${mins.toFixed(1)}m` : '—'}
                </span>
                <button onClick={() => removeItem(item.taskId)} className="text-xs px-1" style={{ color: 'var(--coral)' }}>✕</button>
              </div>
            );
          })}

          {/* Totals */}
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '2px solid var(--teal)' }}>
            <div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Total: </span>
              <span className="font-bold" style={{ color: 'var(--teal)' }}>{totalMinutes.toFixed(1)} min</span>
              <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>({totalHours} hrs)</span>
            </div>
            <button
              onClick={() => onApplyHours(totalHours)}
              className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold"
              style={{ background: 'var(--teal)' }}
            >
              Apply {totalHours} hrs to Labor
            </button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ISSA_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setSearch(''); }}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
            style={{
              background: selectedCategory === cat ? 'var(--teal)' : 'var(--cream-bg)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--teal)' : 'var(--cream-border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
        style={{ background: 'var(--cream-bg)', borderColor: 'var(--cream-border)', color: 'var(--text-primary)' }}
      />

      {/* Task list */}
      <div className="max-h-64 overflow-y-auto">
        {filteredTasks.map(task => {
          const added = items.some(i => i.taskId === task.id);
          return (
            <div
              key={task.id}
              onClick={() => !added && addItem(task)}
              className="flex items-center gap-3 p-2.5 rounded-lg mb-1 transition-colors"
              style={{
                background: added ? 'var(--green-bg)' : 'transparent',
                cursor: added ? 'default' : 'pointer',
                opacity: added ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!added) e.currentTarget.style.background = 'var(--cream-bg)'; }}
              onMouseLeave={e => { if (!added) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{task.task}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{task.tool}</div>
              </div>
              <div className="text-right text-xs">
                {task.unit === 'sqft' ? (
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--teal)' }}>{task.sqFtPerHour.toLocaleString()} sqft/hr</div>
                    <div style={{ color: 'var(--text-muted)' }}>{task.minPer1000SqFt} min/1000sqft</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--teal)' }}>{task.perUnit} min/{task.unit}</div>
                  </div>
                )}
              </div>
              {!added && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: 'var(--teal)', background: 'var(--green-bg)' }}>+ Add</span>
              )}
              {added && (
                <span className="text-xs" style={{ color: 'var(--teal)' }}>✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
