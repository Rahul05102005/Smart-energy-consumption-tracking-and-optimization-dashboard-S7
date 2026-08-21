import { useEffect, useState } from "react";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

const KEY = "energytrack:notifications";
const EVENT = "energytrack:notifications-changed";

function read(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function write(list: AppNotification[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event(EVENT));
}

/** Append a notification to the local history (most recent first). */
export function addNotification(title: string, description: string) {
  if (typeof window === "undefined") return;
  const list = read();
  const entry: AppNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  write([entry, ...list]);
}

export function clearNotifications() {
  write([]);
}

/** Reactive view of the stored notification history. */
export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return items;
}
