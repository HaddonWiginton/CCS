// ISSA 540 Official Cleaning Times — Production Rates
// Based on "The Official ISSA Cleaning Times" (Limited Anniversary Edition)
// Times are per 1,000 sq ft unless noted. Sq Ft/Hr = production rate.

export interface ISSATask {
  id: string;
  category: string;
  task: string;
  tool: string;
  minPer1000SqFt: number;  // minutes to clean 1,000 sq ft
  sqFtPerHour: number;     // production rate
  unit: 'sqft' | 'each' | 'fixture' | 'flight' | 'pane';
  perUnit?: number;        // if unit is 'each', minutes per unit
}

export const ISSA_CATEGORIES = [
  'Sweeping',
  'Dust Mopping',
  'Damp Mopping',
  'Wet Mopping',
  'Vacuuming — Carpet',
  'Vacuuming — Backpack',
  'Carpet Extraction',
  'Floor Scrubbing',
  'Floor Stripping',
  'Floor Finishing',
  'Burnishing',
  'Dusting Surfaces',
  'Restroom Service',
  'Restroom Porter',
  'Trash Removal',
  'Glass & Windows',
  'General Cleaning',
  'Specialist Workloading',
] as const;

export const ISSA_TIMES: ISSATask[] = [
  // ═══ SWEEPING ═══
  { id: 'SW-1', category: 'Sweeping', task: 'Sweep floor', tool: '24" push broom', minPer1000SqFt: 15.40, sqFtPerHour: 3896, unit: 'sqft' },
  { id: 'SW-2', category: 'Sweeping', task: 'Sweep floor', tool: '30" push broom', minPer1000SqFt: 12.00, sqFtPerHour: 5000, unit: 'sqft' },
  { id: 'SW-3', category: 'Sweeping', task: 'Sweep floor', tool: '36" push broom', minPer1000SqFt: 10.80, sqFtPerHour: 5556, unit: 'sqft' },
  { id: 'SW-4', category: 'Sweeping', task: 'Sweep floor', tool: '26" push sweeper machine', minPer1000SqFt: 4.00, sqFtPerHour: 15000, unit: 'sqft' },
  { id: 'SW-5', category: 'Sweeping', task: 'Sweep floor', tool: '36" rider sweeper', minPer1000SqFt: 1.52, sqFtPerHour: 39474, unit: 'sqft' },

  // ═══ DUST MOPPING ═══
  { id: 'DM-1', category: 'Dust Mopping', task: 'Dust mop floor', tool: '24" mop w/ dust treatment', minPer1000SqFt: 7.20, sqFtPerHour: 8333, unit: 'sqft' },
  { id: 'DM-2', category: 'Dust Mopping', task: 'Dust mop floor', tool: '36" mop w/ dust treatment', minPer1000SqFt: 4.80, sqFtPerHour: 12500, unit: 'sqft' },
  { id: 'DM-3', category: 'Dust Mopping', task: 'Dust mop floor', tool: '48" mop w/ dust treatment', minPer1000SqFt: 2.40, sqFtPerHour: 25000, unit: 'sqft' },
  { id: 'DM-4', category: 'Dust Mopping', task: 'Dust mop floor', tool: '60" mop w/ dust treatment', minPer1000SqFt: 1.80, sqFtPerHour: 33333, unit: 'sqft' },

  // ═══ DAMP MOPPING ═══
  { id: 'MP-1', category: 'Damp Mopping', task: 'Damp mop floor', tool: '16oz mop, single bucket & wringer', minPer1000SqFt: 14.40, sqFtPerHour: 4167, unit: 'sqft' },
  { id: 'MP-2', category: 'Damp Mopping', task: 'Damp mop floor', tool: '24oz mop, double bucket & wringer', minPer1000SqFt: 10.80, sqFtPerHour: 5556, unit: 'sqft' },
  { id: 'MP-3', category: 'Damp Mopping', task: 'Damp mop floor', tool: '32oz mop, single bucket & wringer', minPer1000SqFt: 9.60, sqFtPerHour: 6250, unit: 'sqft' },
  { id: 'MP-4', category: 'Damp Mopping', task: 'Damp mop floor', tool: '18" microfiber flat mop, double bucket', minPer1000SqFt: 2.52, sqFtPerHour: 23810, unit: 'sqft' },
  { id: 'MP-5', category: 'Damp Mopping', task: 'Damp mop floor', tool: '10gal rolling bucket, microfiber mop', minPer1000SqFt: 6.50, sqFtPerHour: 9231, unit: 'sqft' },

  // ═══ WET MOPPING ═══
  { id: 'WM-1', category: 'Wet Mopping', task: 'Wet mop & rinse', tool: '24oz mop, single bucket & wringer', minPer1000SqFt: 23.40, sqFtPerHour: 2564, unit: 'sqft' },
  { id: 'WM-2', category: 'Wet Mopping', task: 'Wet mop & rinse', tool: '32oz mop, double bucket & wringer', minPer1000SqFt: 15.00, sqFtPerHour: 4000, unit: 'sqft' },

  // ═══ VACUUMING — CARPET ═══
  { id: 'VC-1', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '12" upright vacuum', minPer1000SqFt: 26.80, sqFtPerHour: 2239, unit: 'sqft' },
  { id: 'VC-2', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '14" upright vacuum', minPer1000SqFt: 21.00, sqFtPerHour: 2857, unit: 'sqft' },
  { id: 'VC-3', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '16" upright vacuum', minPer1000SqFt: 14.20, sqFtPerHour: 4225, unit: 'sqft' },
  { id: 'VC-4', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '18" twin motor upright', minPer1000SqFt: 15.00, sqFtPerHour: 4000, unit: 'sqft' },
  { id: 'VC-5', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '22" upright vacuum', minPer1000SqFt: 13.80, sqFtPerHour: 4348, unit: 'sqft' },
  { id: 'VC-6', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '28" wide-area push vacuum', minPer1000SqFt: 7.50, sqFtPerHour: 8000, unit: 'sqft' },
  { id: 'VC-7', category: 'Vacuuming — Carpet', task: 'Vacuum carpet', tool: '32" wide-area push vacuum', minPer1000SqFt: 4.00, sqFtPerHour: 15000, unit: 'sqft' },

  // ═══ VACUUMING — BACKPACK ═══
  { id: 'VB-1', category: 'Vacuuming — Backpack', task: 'Vacuum carpet', tool: 'Backpack vacuum, 14" carpet tool', minPer1000SqFt: 8.10, sqFtPerHour: 7407, unit: 'sqft' },
  { id: 'VB-2', category: 'Vacuuming — Backpack', task: 'Vacuum carpet', tool: 'Backpack vacuum, 18" carpet tool', minPer1000SqFt: 7.75, sqFtPerHour: 7742, unit: 'sqft' },
  { id: 'VB-3', category: 'Vacuuming — Backpack', task: 'Vacuum carpet', tool: 'Backpack vacuum, 22" carpet tool', minPer1000SqFt: 6.65, sqFtPerHour: 9023, unit: 'sqft' },

  // ═══ CARPET EXTRACTION ═══
  { id: 'CE-1', category: 'Carpet Extraction', task: 'Extract clean carpet', tool: 'Portable w/ 12" suction head', minPer1000SqFt: 120.00, sqFtPerHour: 500, unit: 'sqft' },
  { id: 'CE-2', category: 'Carpet Extraction', task: 'Extract clean carpet', tool: '16" self-contained, self-propelled', minPer1000SqFt: 29.00, sqFtPerHour: 2069, unit: 'sqft' },
  { id: 'CE-3', category: 'Carpet Extraction', task: 'Extract clean carpet', tool: '21" self-contained, self-propelled', minPer1000SqFt: 15.00, sqFtPerHour: 4000, unit: 'sqft' },
  { id: 'CE-4', category: 'Carpet Extraction', task: 'Extract clean carpet', tool: '28" rider extractor, battery', minPer1000SqFt: 11.60, sqFtPerHour: 5172, unit: 'sqft' },

  // ═══ FLOOR SCRUBBING ═══
  { id: 'FS-1', category: 'Floor Scrubbing', task: 'Scrub hard floor', tool: '17" walk-behind auto scrubber (practical)', minPer1000SqFt: 10.14, sqFtPerHour: 5917, unit: 'sqft' },
  { id: 'FS-2', category: 'Floor Scrubbing', task: 'Scrub hard floor', tool: '21" walk-behind auto scrubber (practical)', minPer1000SqFt: 8.21, sqFtPerHour: 7308, unit: 'sqft' },
  { id: 'FS-3', category: 'Floor Scrubbing', task: 'Scrub hard floor', tool: '24" walk-behind auto scrubber (practical)', minPer1000SqFt: 7.18, sqFtPerHour: 8357, unit: 'sqft' },
  { id: 'FS-4', category: 'Floor Scrubbing', task: 'Scrub hard floor', tool: '32" rider auto scrubber (practical)', minPer1000SqFt: 2.94, sqFtPerHour: 20408, unit: 'sqft' },
  { id: 'FS-5', category: 'Floor Scrubbing', task: 'Scrub hard floor', tool: '20" rotary 175rpm w/ wet pickup', minPer1000SqFt: 27.00, sqFtPerHour: 2222, unit: 'sqft' },

  // ═══ FLOOR STRIPPING ═══
  { id: 'ST-1', category: 'Floor Stripping', task: 'Strip floor', tool: '17" rotary 175rpm w/ wet pickup', minPer1000SqFt: 79.80, sqFtPerHour: 752, unit: 'sqft' },
  { id: 'ST-2', category: 'Floor Stripping', task: 'Strip floor', tool: '20" rotary 175rpm w/ wet pickup', minPer1000SqFt: 75.00, sqFtPerHour: 800, unit: 'sqft' },
  { id: 'ST-3', category: 'Floor Stripping', task: 'Strip floor', tool: '20" rotary 350rpm w/ wet pickup', minPer1000SqFt: 45.00, sqFtPerHour: 1333, unit: 'sqft' },

  // ═══ FLOOR FINISHING ═══
  { id: 'FF-1', category: 'Floor Finishing', task: 'Apply floor finish', tool: 'Mop application', minPer1000SqFt: 36.00, sqFtPerHour: 1667, unit: 'sqft' },
  { id: 'FF-2', category: 'Floor Finishing', task: 'Apply floor finish', tool: 'Lambswool applicator', minPer1000SqFt: 30.00, sqFtPerHour: 2000, unit: 'sqft' },
  { id: 'FF-3', category: 'Floor Finishing', task: 'Apply floor finish', tool: 'Backpack applicator w/ 24" microfiber', minPer1000SqFt: 9.50, sqFtPerHour: 6316, unit: 'sqft' },

  // ═══ BURNISHING ═══
  { id: 'BN-1', category: 'Burnishing', task: 'Burnish/buff floor', tool: '20" 2000+rpm electric', minPer1000SqFt: 6.00, sqFtPerHour: 10000, unit: 'sqft' },
  { id: 'BN-2', category: 'Burnishing', task: 'Burnish/buff floor', tool: '24" 2000+rpm battery, self-propelled', minPer1000SqFt: 3.33, sqFtPerHour: 18018, unit: 'sqft' },
  { id: 'BN-3', category: 'Burnishing', task: 'Burnish/buff floor', tool: '27" 1600+rpm battery, self-propelled', minPer1000SqFt: 1.85, sqFtPerHour: 32432, unit: 'sqft' },
  { id: 'BN-4', category: 'Burnishing', task: 'Spray buff floor', tool: '20" 1000+rpm rotary & finish restorer', minPer1000SqFt: 7.80, sqFtPerHour: 7692, unit: 'sqft' },

  // ═══ DUSTING SURFACES ═══
  { id: 'DS-1', category: 'Dusting Surfaces', task: 'Dust horizontal surfaces', tool: 'Feather/lambswool duster', minPer1000SqFt: 6.00, sqFtPerHour: 10000, unit: 'sqft' },
  { id: 'DS-2', category: 'Dusting Surfaces', task: 'Dust surfaces', tool: 'Treated cloth', minPer1000SqFt: 12.00, sqFtPerHour: 5000, unit: 'sqft' },
  { id: 'DS-3', category: 'Dusting Surfaces', task: 'Damp wipe surfaces', tool: 'Trigger sprayer & cloth', minPer1000SqFt: 19.20, sqFtPerHour: 3125, unit: 'sqft' },
  { id: 'DS-4', category: 'Dusting Surfaces', task: 'Dust surfaces', tool: 'Backpack vacuum', minPer1000SqFt: 10.80, sqFtPerHour: 5556, unit: 'sqft' },

  // ═══ RESTROOM SERVICE ═══
  { id: 'RS-1', category: 'Restroom Service', task: 'Full restroom clean (9 fixtures): trash/clean/disinfect/mop', tool: 'Sweep floor method', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 1.64 },
  { id: 'RS-2', category: 'Restroom Service', task: 'Full restroom clean (9 fixtures): trash/clean/disinfect/mop', tool: 'Wet mop floor method', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 3.00 },
  { id: 'RS-3', category: 'Restroom Service', task: 'Full restroom clean (9 fixtures): automated touchless system', tool: 'Touchless cleaning machine', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 2.32 },
  { id: 'RS-4', category: 'Restroom Service', task: 'Restroom touch-up: trash/replace supplies', tool: 'Quick service', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 0.33 },

  // ═══ RESTROOM PORTER ═══
  { id: 'RP-1', category: 'Restroom Porter', task: 'Check & replace hand towels', tool: 'Per dispenser', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.50 },
  { id: 'RP-2', category: 'Restroom Porter', task: 'Check & replace toilet tissue', tool: 'Per dispenser', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.50 },
  { id: 'RP-3', category: 'Restroom Porter', task: 'Check & replace hand soap', tool: 'Per dispenser', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.50 },
  { id: 'RP-4', category: 'Restroom Porter', task: 'Toilet disinfection', tool: 'EPA chemical & toilet brush', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.25 },
  { id: 'RP-5', category: 'Restroom Porter', task: 'Toilet mineral descale', tool: 'Acid bowl mop', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.50 },

  // ═══ TRASH REMOVAL ═══
  { id: 'TR-1', category: 'Trash Removal', task: 'Empty trash, wipe & reline', tool: 'Per receptacle', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 1.50 },
  { id: 'TR-2', category: 'Trash Removal', task: 'Empty trash & wipe clean', tool: 'Per receptacle (no reline)', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 1.00 },
  { id: 'TR-3', category: 'Trash Removal', task: 'Pick up loose debris', tool: 'Lobby pan & porter broom', minPer1000SqFt: 18.00, sqFtPerHour: 3333, unit: 'sqft' },

  // ═══ GLASS & WINDOWS ═══
  { id: 'GW-1', category: 'Glass & Windows', task: 'Clean glass door & hardware', tool: 'Trigger sprayer & cloth (both sides)', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 3.00 },
  { id: 'GW-2', category: 'Glass & Windows', task: 'Clean glass partition', tool: 'Trigger sprayer & cloth', minPer1000SqFt: 114.00, sqFtPerHour: 526, unit: 'sqft' },
  { id: 'GW-3', category: 'Glass & Windows', task: 'Wash window', tool: 'Brush, squeegee & bucket', minPer1000SqFt: 100.20, sqFtPerHour: 599, unit: 'sqft' },
  { id: 'GW-4', category: 'Glass & Windows', task: 'Wash window', tool: 'Trigger sprayer & cloth', minPer1000SqFt: 114.00, sqFtPerHour: 526, unit: 'sqft' },
  { id: 'GW-5', category: 'Glass & Windows', task: 'Clean window pane (multi-pane)', tool: 'Trigger sprayer & cloth', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'pane', perUnit: 0.07 },

  // ═══ GENERAL CLEANING ═══
  { id: 'GC-1', category: 'General Cleaning', task: 'Classroom service: trash/dust/chalkboard/vacuum', tool: 'Backpack vacuum', minPer1000SqFt: 11.00, sqFtPerHour: 5455, unit: 'sqft' },
  { id: 'GC-2', category: 'General Cleaning', task: 'Disinfect surfaces', tool: 'Damp wipe w/ disinfectant', minPer1000SqFt: 19.20, sqFtPerHour: 3125, unit: 'sqft' },
  { id: 'GC-3', category: 'General Cleaning', task: 'Elevator cab detail clean', tool: 'Full service', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 10.00 },
  { id: 'GC-4', category: 'General Cleaning', task: 'Drinking fountain service', tool: 'Spray wipe & disinfect', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.50 },
  { id: 'GC-5', category: 'General Cleaning', task: 'Sanitize desk telephone', tool: 'Trigger sprayer & cloth', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 0.67 },
  { id: 'GC-6', category: 'General Cleaning', task: 'Stairwell vacuum (per flight)', tool: 'Backpack vacuum', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'flight', perUnit: 1.60 },
  { id: 'GC-7', category: 'General Cleaning', task: 'Clean baseboards', tool: 'Manual swivel tool & handle', minPer1000SqFt: 6.60, sqFtPerHour: 9091, unit: 'sqft' },

  // ═══ SPECIALIST WORKLOADING ═══
  { id: 'SL-1', category: 'Specialist Workloading', task: 'Light duty specialist — office building', tool: 'Full service', minPer1000SqFt: 6.00, sqFtPerHour: 10000, unit: 'sqft' },
  { id: 'SL-2', category: 'Specialist Workloading', task: 'Vacuum specialist — office building', tool: 'Full service', minPer1000SqFt: 6.00, sqFtPerHour: 10000, unit: 'sqft' },
  { id: 'SL-3', category: 'Specialist Workloading', task: 'Restroom specialist — per fixture (trained)', tool: 'After training', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 1.50 },
  { id: 'SL-4', category: 'Specialist Workloading', task: 'Restroom specialist — per fixture (training)', tool: 'During training', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'fixture', perUnit: 2.00 },
  { id: 'SL-5', category: 'Specialist Workloading', task: 'Check-in and travel to area', tool: 'Beginning of shift', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 2.00 },
  { id: 'SL-6', category: 'Specialist Workloading', task: 'Equipment cleanup & restock', tool: 'End of shift', minPer1000SqFt: 0, sqFtPerHour: 0, unit: 'each', perUnit: 5.00 },
];

/**
 * Calculate time in minutes for a given task and quantity.
 * For sqft-based tasks: (sqft / 1000) * minPer1000SqFt
 * For unit-based tasks: quantity * perUnit
 */
export function calcISSATime(task: ISSATask, quantity: number): number {
  if (task.unit === 'sqft') {
    return (quantity / 1000) * task.minPer1000SqFt;
  }
  return quantity * (task.perUnit || 0);
}

/**
 * Convert minutes to hours (rounded to 2 decimal places)
 */
export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}
