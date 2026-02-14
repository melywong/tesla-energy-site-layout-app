import { Session, SiteConfig, DeviceSelection } from '../types';

const API_BASE = 'http://localhost:8001/api';
const LOCAL_STORAGE_KEY = 'tesla-energy-sessions';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Backend API (local dev)
export async function saveSession(name: string, config: SiteConfig): Promise<Session> {
  return apiFetch<Session>(`${API_BASE}/sessions`, {
    method: 'POST',
    body: JSON.stringify({ name, config }),
  });
}

export async function listSessions(): Promise<Session[]> {
  return apiFetch<Session[]>(`${API_BASE}/sessions`);
}

export async function getSession(id: number): Promise<Session> {
  return apiFetch<Session>(`${API_BASE}/sessions/${id}`);
}

export async function deleteSession(id: number): Promise<void> {
  await apiFetch<void>(`${API_BASE}/sessions/${id}`, { method: 'DELETE' });
}

// localStorage persistence (fallback when no backend)
function getLocalSessions(): Session[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalSessions(sessions: Session[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
}

export function saveLocalSession(name: string, config: SiteConfig): Session {
  const sessions = getLocalSessions();
  const nextId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id ?? 0)) + 1 : 1;
  const session: Session = {
    id: nextId,
    name,
    config,
    createdAt: new Date().toISOString(),
  };
  setLocalSessions([session, ...sessions]);
  return session;
}

export function listLocalSessions(): Session[] {
  return getLocalSessions();
}

export function deleteLocalSession(id: number): void {
  const sessions = getLocalSessions().filter((s) => s.id !== id);
  setLocalSessions(sessions);
}

// URL-based persistence (GitHub Pages / no backend)
export function encodeConfigToUrl(selections: DeviceSelection[]): string {
  const data = JSON.stringify(selections);
  const encoded = btoa(data);
  const url = new URL(window.location.href);
  url.hash = encoded;
  return url.toString();
}

export function decodeConfigFromUrl(): DeviceSelection[] | null {
  const hash = window.location.hash.slice(1); // remove #
  if (!hash) return null;
  try {
    const data = atob(hash);
    return JSON.parse(data) as DeviceSelection[];
  } catch {
    return null;
  }
}

export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/sessions`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}
