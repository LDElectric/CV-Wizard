export function normalizeExternalUrl(value) {
  const v = (value || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (/^\/\//.test(v)) return `https:${v}`;
  if (/^[a-z]+:/i.test(v)) return v;
  return `https://${v}`;
}

export function normalizeEmail(email) {
  const v = (email || '').trim();
  return v ? `mailto:${v}` : '';
}

export function normalizePhone(phone) {
  const v = (phone || '').trim();
  if (!v) return '';
  const compact = v.replace(/[^\d+]/g, '');
  return compact ? `tel:${compact}` : '';
}
