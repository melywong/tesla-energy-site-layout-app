export interface DeviceSpec {
  id: string;
  name: string;
  width: number;  // feet
  depth: number;  // feet
  energy: number; // MWh (negative for transformers)
  cost: number;   // dollars
}

export interface DeviceSelection {
  deviceId: string;
  quantity: number;
}

export interface SiteConfig {
  selections: DeviceSelection[];
}

export interface Session {
  id?: number;
  name: string;
  config: SiteConfig;
  createdAt?: string;
}

export interface LayoutItem {
  deviceId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  depth: number;
}

export interface LayoutResult {
  items: LayoutItem[];
  totalWidth: number;
  totalDepth: number;
}
