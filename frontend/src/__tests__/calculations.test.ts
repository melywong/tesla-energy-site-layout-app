import { describe, it, expect } from 'vitest';
import {
  getTransformerCount,
  calculateTotalCost,
  calculateTotalEnergy,
  formatCurrency,
  formatEnergy,
} from '../utils/calculations';
import { DeviceSelection } from '../types';

describe('getTransformerCount', () => {
  it('returns 0 for no batteries', () => {
    expect(getTransformerCount([])).toBe(0);
  });

  it('returns 1 for 1 battery', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 1 }];
    expect(getTransformerCount(sel)).toBe(1);
  });

  it('returns 1 for 2 batteries', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 2 }];
    expect(getTransformerCount(sel)).toBe(1);
  });

  it('returns 2 for 3 batteries', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 3 }];
    expect(getTransformerCount(sel)).toBe(2);
  });

  it('sums across device types', () => {
    const sel: DeviceSelection[] = [
      { deviceId: 'megapack', quantity: 2 },
      { deviceId: 'powerpack', quantity: 1 },
    ];
    expect(getTransformerCount(sel)).toBe(2); // ceil(3/2)
  });
});

describe('calculateTotalCost', () => {
  it('returns 0 for empty selections', () => {
    expect(calculateTotalCost([])).toBe(0);
  });

  it('includes battery cost plus transformer cost', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 2 }];
    // 2 * $50,000 + 1 transformer * $10,000 = $110,000
    expect(calculateTotalCost(sel)).toBe(110000);
  });

  it('calculates mixed devices', () => {
    const sel: DeviceSelection[] = [
      { deviceId: 'megapack-xl', quantity: 1 },
      { deviceId: 'powerpack', quantity: 1 },
    ];
    // 1*120000 + 1*10000 + ceil(2/2)*10000 = 140000
    expect(calculateTotalCost(sel)).toBe(140000);
  });
});

describe('calculateTotalEnergy', () => {
  it('returns 0 for empty selections', () => {
    expect(calculateTotalEnergy([])).toBe(0);
  });

  it('subtracts transformer energy', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 2 }];
    // 2*2 - 1*0.5 = 3.5
    expect(calculateTotalEnergy(sel)).toBe(3.5);
  });
});

describe('formatCurrency', () => {
  it('formats with dollar sign and commas', () => {
    expect(formatCurrency(110000)).toBe('$110,000');
  });
});

describe('formatEnergy', () => {
  it('formats with one decimal and unit', () => {
    expect(formatEnergy(3.5)).toBe('3.5 MWh');
  });

  it('formats zero', () => {
    expect(formatEnergy(0)).toBe('0.0 MWh');
  });
});

describe('full scenario: all device types', () => {
  it('calculates correctly with all 4 battery types', () => {
    const sel: DeviceSelection[] = [
      { deviceId: 'megapack-xl', quantity: 1 },
      { deviceId: 'megapack-2', quantity: 1 },
      { deviceId: 'megapack', quantity: 1 },
      { deviceId: 'powerpack', quantity: 1 },
    ];
    // 4 batteries total -> ceil(4/2) = 2 transformers
    expect(getTransformerCount(sel)).toBe(2);
    // Cost: 120000 + 80000 + 50000 + 10000 + 2*10000 = 280000
    expect(calculateTotalCost(sel)).toBe(280000);
    // Energy: 4 + 3 + 2 + 1 + 2*(-0.5) = 9.0
    expect(calculateTotalEnergy(sel)).toBe(9);
  });

  it('ignores unknown device IDs', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'unknown-device', quantity: 5 }];
    expect(getTransformerCount(sel)).toBe(0);
    expect(calculateTotalCost(sel)).toBe(0);
    expect(calculateTotalEnergy(sel)).toBe(0);
  });
});
