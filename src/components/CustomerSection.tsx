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
  projectManager: string;
  facilityContact: string;
  onChange: (field: string, value: string) => void;
}

export default function CustomerSection({ customer, serviceType, frequency, workOrder, projectManager, facilityContact, onChange }: Props) {
  const inputStyle = {
    background: 'var(--cream-bg)',
    borderColor: 'var(--cream-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="p-4 pt-0 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Company / Customer Name</label>
          <input type="text" value={customer.name} onChange={e => onChange('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Acme Corp" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contact Email</label>
          <input type="email" value={customer.email} onChange={e => onChange('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="contact@acme.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contact Phone</label>
          <input type="tel" value={customer.phone} onChange={e => onChange('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="(864) 555-1234" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Facility Type</label>
          <select value={customer.propertyType} onChange={e => onChange('propertyType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>Commercial Office</option>
            <option>Medical / Healthcare</option>
            <option>Retail / Storefront</option>
            <option>Industrial / Warehouse</option>
            <option>Educational</option>
            <option>Government</option>
            <option>Religious / Non-Profit</option>
            <option>Multi-Tenant</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Facility Address</label>
        <input type="text" value={customer.address} onChange={e => onChange('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="123 Industrial Blvd" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>City</label>
          <input type="text" value={customer.city} onChange={e => onChange('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>State</label>
          <input type="text" value={customer.state} onChange={e => onChange('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Zip</label>
          <input type="text" value={customer.zip} onChange={e => onChange('zip', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Service Type</label>
          <select value={serviceType} onChange={e => onChange('serviceType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>Daily Janitorial</option>
            <option>Nightly Janitorial</option>
            <option>Floor Care</option>
            <option>Window Cleaning</option>
            <option>Deep Cleaning</option>
            <option>Post-Construction</option>
            <option>Electrostatic Disinfection</option>
            <option>Pressure Washing</option>
            <option>Porter / Day Service</option>
            <option>Full Facility Package</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Frequency</label>
          <select value={frequency} onChange={e => onChange('frequency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle}>
            <option>One-time</option>
            <option>Daily (M-F)</option>
            <option>Daily (7 days)</option>
            <option>3x per week</option>
            <option>2x per week</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Annual</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Square Footage</label>
          <input type="text" value={customer.squareFootage} onChange={e => onChange('squareFootage', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="e.g. 25,000" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Work Order #</label>
          <input type="text" value={workOrder} onChange={e => onChange('workOrder', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Optional" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Project Manager</label>
          <input type="text" value={projectManager} onChange={e => onChange('projectManager', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Facility Contact</label>
          <input type="text" value={facilityContact} onChange={e => onChange('facilityContact', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} placeholder="On-site contact" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Notes / Special Instructions</label>
        <textarea value={customer.notes} onChange={e => onChange('notes', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={inputStyle} rows={3} placeholder="Access codes, alarm info, restricted areas, special requirements..." />
      </div>
    </div>
  );
}
