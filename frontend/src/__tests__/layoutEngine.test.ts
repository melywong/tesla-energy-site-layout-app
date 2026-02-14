import { describe, it, expect } from 'vitest';
import { generateLayout } from '../utils/layoutEngine';
import { DeviceSelection } from '../types';

describe('generateLayout', () => {
  it('returns empty layout for no devices', () => {
    const result = generateLayout([]);
    expect(result.items).toHaveLength(0);
    expect(result.totalWidth).toBe(0);
    expect(result.totalDepth).toBe(0);
  });

  it('places a single device at origin', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'powerpack', quantity: 1 }];
    const result = generateLayout(sel);
    // 1 powerpack + 1 transformer = 2 items
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({ x: 0, y: 0, width: 10, deviceId: 'powerpack' });
  });

  it('wraps to next row when exceeding 100ft', () => {
    // 3 MegapackXL (40ft each) = 120ft, should wrap
    const sel: DeviceSelection[] = [{ deviceId: 'megapack-xl', quantity: 3 }];
    const result = generateLayout(sel);

    const xlItems = result.items.filter((i) => i.deviceId === 'megapack-xl');
    expect(xlItems[0]).toMatchObject({ x: 0, y: 0 }); // first: row 0
    expect(xlItems[1]).toMatchObject({ x: 40, y: 0 }); // second: row 0 (80ft)
    // third wraps (after transformer is placed between 2nd and 3rd)
    expect(xlItems[2].y).toBeGreaterThan(0);
  });

  it('auto-adds correct number of transformers', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'megapack', quantity: 3 }];
    const result = generateLayout(sel);
    const transformers = result.items.filter((i) => i.deviceId === 'transformer');
    expect(transformers).toHaveLength(2); // ceil(3/2)
  });

  it('intersperses transformers among batteries', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'powerpack', quantity: 4 }];
    const result = generateLayout(sel);
    // 4 batteries + 2 transformers = 6 items
    // Order should be: PP, PP, TX, PP, PP, TX
    expect(result.items[0].deviceId).toBe('powerpack');
    expect(result.items[1].deviceId).toBe('powerpack');
    expect(result.items[2].deviceId).toBe('transformer');
    expect(result.items[3].deviceId).toBe('powerpack');
    expect(result.items[4].deviceId).toBe('powerpack');
    expect(result.items[5].deviceId).toBe('transformer');
  });

  it('places remaining transformers at end for odd battery count', () => {
    const sel: DeviceSelection[] = [{ deviceId: 'powerpack', quantity: 1 }];
    const result = generateLayout(sel);
    // 1 battery + ceil(1/2) = 1 transformer
    expect(result.items).toHaveLength(2);
    expect(result.items[0].deviceId).toBe('powerpack');
    expect(result.items[1].deviceId).toBe('transformer');
  });

  it('reports correct total dimensions', () => {
    // 10 PowerPacks (10ft each) = 100ft exactly in one row
    // Transformers interspersed: PP PP TX PP PP TX PP PP TX PP PP TX PP (wait, 10 PPs)
    // Actually: PP PP TX PP PP TX PP PP TX PP PP TX PP (but only 5 transformers for 10 PPs)
    // Items: PP PP TX PP PP TX PP PP TX PP PP TX PP PP TX = 10 PPs + 5 TXs = 15 items
    const sel: DeviceSelection[] = [{ deviceId: 'powerpack', quantity: 10 }];
    const result = generateLayout(sel);
    expect(result.totalWidth).toBe(100);
    // Row 0: 10 items * 10ft = 100ft (full row)
    // Row 1: remaining 5 items * 10ft = 50ft
    expect(result.totalDepth).toBe(20);
  });

  it('never exceeds 100ft width', () => {
    // Stress test with many large devices
    const sel: DeviceSelection[] = [{ deviceId: 'megapack-xl', quantity: 20 }];
    const result = generateLayout(sel);
    // Every item should be within 0..100ft x-range
    for (const item of result.items) {
      expect(item.x + item.width).toBeLessThanOrEqual(100);
    }
    expect(result.totalWidth).toBeLessThanOrEqual(100);
  });

  it('handles mixed device types in layout', () => {
    const sel: DeviceSelection[] = [
      { deviceId: 'megapack-xl', quantity: 1 }, // 40ft
      { deviceId: 'megapack-2', quantity: 1 },  // 30ft
      { deviceId: 'powerpack', quantity: 1 },   // 10ft
    ];
    const result = generateLayout(sel);
    // 3 batteries + ceil(3/2) = 2 transformers = 5 items
    expect(result.items).toHaveLength(5);
    // First two batteries placed, then transformer after 2nd
    expect(result.items[0].deviceId).toBe('megapack-xl');
    expect(result.items[1].deviceId).toBe('megapack-2');
    expect(result.items[2].deviceId).toBe('transformer');
  });
});
