import { DeviceSelection } from '../types';
import { DEVICES, TRANSFORMER, getDeviceById } from '../data/devices';

export function getTransformerCount(selections: DeviceSelection[]): number {
  const totalBatteries = selections.reduce((sum, sel) => {
    const device = DEVICES.find((d) => d.id === sel.deviceId);
    if (device) return sum + sel.quantity;
    return sum;
  }, 0);
  return Math.ceil(totalBatteries / 2);
}

export function calculateTotalCost(selections: DeviceSelection[]): number {
  let cost = 0;
  for (const sel of selections) {
    const device = getDeviceById(sel.deviceId);
    if (device) cost += device.cost * sel.quantity;
  }
  cost += TRANSFORMER.cost * getTransformerCount(selections);
  return cost;
}

export function calculateTotalEnergy(selections: DeviceSelection[]): number {
  let energy = 0;
  for (const sel of selections) {
    const device = getDeviceById(sel.deviceId);
    if (device) energy += device.energy * sel.quantity;
  }
  energy += TRANSFORMER.energy * getTransformerCount(selections);
  return energy;
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString();
}

export function formatEnergy(mwh: number): string {
  return mwh.toFixed(1) + ' MWh';
}
