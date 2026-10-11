// Real Family Home Invite Code Generator, Sanitizer & Multi-Channel Sync Relay Engine

const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('nest_family_sync')
    : null;

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    if (event.data && event.data.inviteCode) {
      const code = sanitizeInviteCode(event.data.inviteCode);
      if (code) {
        try {
          localStorage.setItem(`nest_invite_${code}`, JSON.stringify(event.data));
          const raw = localStorage.getItem('nest_homes_v8') || localStorage.getItem('nest_homes');
          const homes = raw ? JSON.parse(raw) : [];
          if (!homes.some((h: any) => h.id === event.data.id)) {
            const updated = [event.data, ...homes];
            localStorage.setItem('nest_homes_v8', JSON.stringify(updated));
            localStorage.setItem('nest_homes', JSON.stringify(updated));
          }
        } catch {}
      }
    }
  };
}

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
 * Broadcasts home invite metadata to local broadcast channel + free global pub/sub relay
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
    members: (home.members || []).slice(0, 15),
    permissions: home.permissions,
    updatedAt: new Date().toISOString(),
  };

  // 1. Cache in localStorage immediately
  try {
    localStorage.setItem(`nest_invite_${cleanCode}`, JSON.stringify(payload));
  } catch {}

  // 2. Broadcast to other tabs/windows on same device
  try {
    syncChannel?.postMessage(payload);
  } catch {}

  // 3. Publish to cloud relay across devices (without Content-Type: application/json to avoid ntfy corruption)
  const serialized = JSON.stringify(payload);
  const targets = [
    `https://ntfy.sh/nest_family_invite_${cleanCode.toLowerCase()}`,
    `https://ntfy.sh/nest_family_invite_${cleanCode}`,
  ];

  for (const url of targets) {
    try {
      fetch(url, {
        method: 'POST',
        headers: {
          Title: `NEST Home ${home.name}`,
        },
        body: serialized,
        mode: 'cors',
        cache: 'no-cache',
      }).catch(() => {});
    } catch {}
  }
}

/**
 * Queries the cloud relay + local caches to fetch family home metadata
 */
export async function fetchRemoteHomeInvite(rawCode: string): Promise<any | null> {
  const cleanCode = sanitizeInviteCode(rawCode);
  if (!cleanCode) return null;

  // 1. Check local dedicated invite cache
  try {
    const cached = localStorage.getItem(`nest_invite_${cleanCode}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.id && parsed.name) return parsed;
    }
  } catch {}

  // 2. Check existing stored homes in localStorage
  try {
    const rawHomes = localStorage.getItem('nest_homes_v8') || localStorage.getItem('nest_homes');
    if (rawHomes) {
      const homes: any[] = JSON.parse(rawHomes);
      const found = homes.find((h) => sanitizeInviteCode(h.inviteCode) === cleanCode);
      if (found) return found;
    }
  } catch {}

  // 3. Query remote pub/sub cloud relay with &since=all and newline NDJSON parsing
  const targets = [
    `https://ntfy.sh/nest_family_invite_${cleanCode.toLowerCase()}/json?poll=1&since=all`,
    `https://ntfy.sh/nest_family_invite_${cleanCode}/json?poll=1&since=all`,
  ];

  for (const url of targets) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim()) {
          const lines = text.trim().split('\n').filter(Boolean);
          // Parse lines in reverse order to get the latest message
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              const item = JSON.parse(lines[i]);
              if (item && item.event === 'message' && item.message) {
                const parsed = JSON.parse(item.message);
                if (parsed && parsed.id && parsed.name) {
                  try {
                    localStorage.setItem(`nest_invite_${cleanCode}`, JSON.stringify(parsed));
                  } catch {}
                  return parsed;
                }
              }
            } catch {}
          }
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return null;
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
        if (homePayload && homePayload.inviteCode) {
          const c = sanitizeInviteCode(homePayload.inviteCode);
          try {
            localStorage.setItem(`nest_invite_${c}`, JSON.stringify(homePayload));
          } catch {}
        }
      } catch {}
    }

    if (code || homePayload) {
      return { code: code || (homePayload ? homePayload.inviteCode : ''), homePayload };
    }
  } catch {}
  return null;
}
