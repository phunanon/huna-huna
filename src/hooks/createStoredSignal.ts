import { createSignal, Signal } from 'solid-js';

export function createStoredSignal<T>(
  key: string,
  defaultValue?: T,
  storage = localStorage,
): Signal<T | undefined> {
  const item = storage.getItem(key);
  const initialValue = item ? (JSON.parse(item) as T) : undefined;

  const [value, setValue] = createSignal<T | undefined>(initialValue);

  const setValueAndStore = (arg => {
    const v = setValue(arg);
    storage.setItem(key, JSON.stringify(v));
    return v;
  }) as typeof setValue;

  return [value, setValueAndStore];
}
