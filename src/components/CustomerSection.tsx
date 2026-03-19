'use client';

interface Props {
  customer: {
    name: string; email: string; phone: string;
    address: string; city: string; state: string; zip: string;
    propertyType: string; squareFootage: string; notes: string;
  };
  serviceType: string;
  frequency: string;
  workOrder: string;
  onChange: (field: string, value: string) => void;
}

export default function CustomerSection({ customer, serviceType, frequency, workOrder, onChange }: Props) {
  const inputStyle = {
    background: 'var(--cream-bg)',
    borderColor: 'var(--cream-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="p-4 pt-0 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Customer Name</label>
          <input type="text" value={customer.name} onChange={e => onChange('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
          <input type="email" value={customer.email} onChange={e => onChange('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Phone</label>
          <input type="tel" value={customer.phone} onChange={e => onChange('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="(555) 555-5555" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Property Type</label>
          <select value={customer.propertyType} onChange={e => onChange('propertyType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
            <option>Vacation Rental</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Property Address</label>
        <input type="text" value={customer.address} onChange={e => onChange('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Street address" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>City</label>
          <input type="text" value={customer.city} onChange={e => onChange('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>State</label>
          <input type="text" value={customer.state} onChange={e => onChange('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Zip</label>
          <input type="text" value={customer.zip} onChange={e => onChange('zip', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Service Type</label>
          <select value={serviceType} onChange={e => onChange('serviceType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>Standard Cleaning</option>
            <option>Deep Cleaning</option>
            <option>Move-in/Move-out</option>
            <option>Post-Construction</option>
            <option>Commercial Maintenance</option>
            <option>Window Cleaning</option>
            <option>Carpet Cleaning</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Frequency</label>
          <select value={frequency} onChange={e => onChange('frequency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>One-time</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Square Footage</label>
          <input type="text" value={customer.squareFootage} onChange={e => onChange('squareFootage', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="e.g. 2,500" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Work Order #</label>
        <input type="text" value={workOrder} onChange={e => onChange('workOrder', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Optional" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Notes</label>
        <textarea value={customer.notes} onChange={e => onChange('notes', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} rows={3} placeholder="Special instructions, access codes, pet info, etc." />
      </div>
    </div>
  );
}
