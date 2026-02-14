import { DeviceSpec } from '../types';

export const DEVICES: DeviceSpec[] = [
  {
    id: 'megapack-xl',
    name: 'MegapackXL',
    width: 40,
    depth: 10,
    energy: 4,
    cost: 120000,
  },
  {
    id: 'megapack-2',
    name: 'Megapack2',
    width: 30,
    depth: 10,
    energy: 3,
    cost: 80000,
  },
  {
    id: 'megapack',
    name: 'Megapack',
    width: 30,
    depth: 10,
    energy: 2,
    cost: 50000,
  },
  {
    id: 'powerpack',
    name: 'PowerPack',
    width: 10,
    depth: 10,
    energy: 1,
    cost: 10000,
  },
];

export const TRANSFORMER: DeviceSpec = {
  id: 'transformer',
  name: 'Transformer',
  width: 10,
  depth: 10,
  energy: -0.5,
  cost: 10000,
};

export const SITE_MAX_WIDTH = 100; // feet

export function getDeviceById(id: string): DeviceSpec | undefined {
  if (id === TRANSFORMER.id) return TRANSFORMER;
  return DEVICES.find((d) => d.id === id);
}
