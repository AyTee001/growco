/** Нормалізує до вигляду +380XXXXXXXXX або повертає порожній рядок. */
export function normalizeUaPhone(raw: string): string {
  const s = raw.replace(/[\s\u00A0\-().]/g, '');
  if (!s) return '';
  if (/^\+380\d{9}$/.test(s)) return s;
  if (/^380\d{9}$/.test(s)) return `+${s}`;
  if (/^0\d{9}$/.test(s)) return `+38${s}`;
  return s;
}

/** Порожнє значення дозволене; інакше очікується український мобільний у форматі +380XXXXXXXXX (після нормалізації). */
export function isValidUaPhone(raw: string): boolean {
  const n = normalizeUaPhone(raw);
  if (!n) return true;
  return /^\+380\d{9}$/.test(n);
}

/** Порожній email дозволений; непорожній — базова перевірка формату. */
export function isValidEmailOptional(raw: string): boolean {
  const e = raw.trim();
  if (!e) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

export function parseBirthDateYmd(s: string): Date | null {
  const t = s?.trim();
  if (!t) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2] - 1;
  const d = +m[3];
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;
  return dt;
}

export function formatBirthDateYmd(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}
