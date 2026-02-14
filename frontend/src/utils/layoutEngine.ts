import { DeviceSelection, LayoutItem, LayoutResult } from '../types';
import { TRANSFORMER, getDeviceById, SITE_MAX_WIDTH } from '../data/devices';
import { getTransformerCount } from './calculations';

type PlaceableDevice = { deviceId: string; name: string; width: number; depth: number };

export function generateLayout(selections: DeviceSelection[]): LayoutResult {
  const items: LayoutItem[] = [];

  // Build flat list of batteries
  const batteries: PlaceableDevice[] = [];
  for (const sel of selections) {
    const device = getDeviceById(sel.deviceId);
    if (!device) continue;
    for (let i = 0; i < sel.quantity; i++) {
      batteries.push({
        deviceId: device.id,
        name: device.name,
        width: device.width,
        depth: device.depth,
      });
    }
  }

  // Intersperse transformers: 1 after every 2 batteries
  const transformerCount = getTransformerCount(selections);
  const devicesToPlace: PlaceableDevice[] = [];
  let transformersPlaced = 0;

  for (let i = 0; i < batteries.length; i++) {
    devicesToPlace.push(batteries[i]);
    // Place a transformer after every 2nd battery
    if ((i + 1) % 2 === 0 && transformersPlaced < transformerCount) {
      devicesToPlace.push({
        deviceId: TRANSFORMER.id,
        name: TRANSFORMER.name,
        width: TRANSFORMER.width,
        depth: TRANSFORMER.depth,
      });
      transformersPlaced++;
    }
  }

  // Place any remaining transformers at the end
  while (transformersPlaced < transformerCount) {
    devicesToPlace.push({
      deviceId: TRANSFORMER.id,
      name: TRANSFORMER.name,
      width: TRANSFORMER.width,
      depth: TRANSFORMER.depth,
    });
    transformersPlaced++;
  }

  // Row-packing: left-to-right, max SITE_MAX_WIDTH
  let cursorX = 0;
  let cursorY = 0;
  let maxWidthUsed = 0;

  for (const device of devicesToPlace) {
    if (cursorX + device.width > SITE_MAX_WIDTH && cursorX > 0) {
      cursorY += 10; // all devices are 10ft deep
      cursorX = 0;
    }

    items.push({
      deviceId: device.deviceId,
      name: device.name,
      x: cursorX,
      y: cursorY,
      width: device.width,
      depth: device.depth,
    });

    cursorX += device.width;
    if (cursorX > maxWidthUsed) maxWidthUsed = cursorX;
  }

  const totalDepth = items.length > 0 ? cursorY + 10 : 0;

  return {
    items,
    totalWidth: maxWidthUsed,
    totalDepth,
  };
}
