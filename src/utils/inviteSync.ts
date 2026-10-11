// Real Family Home Invite Code Generator, Sanitizer & Cloud Sync Relay Engine

export function generateInviteCode(): string {
  // Unambiguous, highly distinct alphanumeric characters (no 0/O, 1/I)
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return code;
}

export function sanitizeInviteCode(raw: string | undefined | null): string {
  if (!raw) return '';
  let str = String(raw).trim();

  // If a full URL link was pasted, extract the join code parameter
  if (str.includes('join=')) {
    const match = str.match(/join=([A-Za-z0-9]+)/i);
    if (match) str = match[1];
  } else if (str.includes('/join/')) {
    const match = str.match(/\/join\/([A-Za-z0-9]+)/i);
    if (match) str = match[1];
  }

  // Strip all whitespace, hyphens, prefixes (#, @, etc.) and convert to uppercase
  return str.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export function buildInviteLink(home: {
  id: string;
  name: string;
  inviteCode: string;
  atmosphere?: string;
  ownerId?: string;
}): string {
  const code = sanitizeInviteCode(home.inviteCode) || 'NEST01';
  if (typeof window === 'undefined') {
    return `https://jayden-1-1.github.io/nest/?join=${code}`;
  }

  const origin = window.location.origin;
  const pathname = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : window.location.pathname + '/';

  try {
    const compactData = {
      id: home.id,
      name: home.name,
      inviteCode: code,
      atmosphere: home.atmosphere || 'Midnight',
      ownerId: home.ownerId || '',
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(compactData)));
    return `${origin}${pathname}?join=${code}&h=${encoded}`;
  } catch {
    return `${origin}${pathname}?join=${code}`;
  }
}

/**
 * Broadcasts home invite metadata to free global pub/sub relay (CORS-friendly, no-login)
 * Allows family members on different phones/laptops to join by code seamlessly
 */
export async function publishHomeInvite(home: any): Promise<void> {
  if (!home) return;
  const cleanCode = sanitizeInviteCode(home.inviteCode);
  if (!cleanCode) return;

  const payload = {
    id: home.id,
    name: home.name,
    description: home.description || '',
    ownerId: home.ownerId || '',
    inviteCode: cleanCode,
    atmosphere: home.atmosphere || 'Midnight',
    members: (home.members || []).slice(0, 10),
    permissions: home.permissions,
    updatedAt: new Date().toISOString(),
  };

  try {
    await fetch(`https://ntfy.sh/nest_family_invite_${cleanCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Title': `NEST Home ${home.name}`,
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      cache: 'no-cache',
    });
  } catch {
    // Non-blocking fallback if offline or unreachable
  }
}

/**
 * Queries the cloud relay to fetch family home metadata if code is not yet in local storage
 */
export async function fetchRemoteHomeInvite(rawCode: string): Promise<any | null> {
  const cleanCode = sanitizeInviteCode(rawCode);
  if (!cleanCode) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://ntfy.sh/nest_family_invite_${cleanCode}/json?poll=1`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      mode: 'cors',
      cache: 'no-cache',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.message) {
      try {
        const parsed = JSON.parse(data.message);
        if (parsed && parsed.id && parsed.name) {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Decodes ?join=CODE and &h=PAYLOAD parameters from current browser URL
 */
export function decodeInviteFromUrl(): { code: string; homePayload?: any } | null {
  if (typeof window === 'undefined') return null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));

    const rawCode = urlParams.get('join') || hashParams.get('join') || '';
    const rawHome = urlParams.get('h') || hashParams.get('h') || '';

    const code = sanitizeInviteCode(rawCode);
    let homePayload: any = null;

    if (rawHome) {
      try {
        const decodedStr = decodeURIComponent(atob(rawHome));
        homePayload = JSON.parse(decodedStr);
      } catch {}
    }

    if (code || homePayload) {
      return { code: code || (homePayload ? homePayload.inviteCode : ''), homePayload };
    }
  } catch {}
  return null;
}
