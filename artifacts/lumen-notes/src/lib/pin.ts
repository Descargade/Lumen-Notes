const PIN_KEY = "lumen_pin_v1";
const PIN_ENABLED_KEY = "lumen_pin_enabled_v1";

export function getStoredPin(): string | null {
  return localStorage.getItem(PIN_KEY);
}

export function savePin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
  localStorage.setItem(PIN_ENABLED_KEY, "true");
}

export function removePin(): void {
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(PIN_ENABLED_KEY);
}

export function isPinEnabled(): boolean {
  return localStorage.getItem(PIN_ENABLED_KEY) === "true" && !!localStorage.getItem(PIN_KEY);
}

export function verifyPin(pin: string): boolean {
  return localStorage.getItem(PIN_KEY) === pin;
}
