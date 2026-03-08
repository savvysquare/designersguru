// Unique session token for anonymous chat identification
export function getSessionToken(): string {
  const key = "guru_session_token";
  let token = sessionStorage.getItem(key);
  if (!token) {
    token = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(key, token);
  }
  return token;
}

export interface LineItem {
  name: string;
  description: string;
  price: number;
}

export interface CartState {
  items: LineItem[];
  discountPct: number;
  total: number;
}

export function parseCartFromMessage(text: string): Partial<CartState> | null {
  // Look for "📋 Your Custom Package:" pattern
  const packageMatch = text.match(/📋[^\n]*\n([\s\S]*?)(?:\*\*Total:\s*\$([0-9,]+)\*\*|Total:\s*\$([0-9,]+))/i);
  if (!packageMatch) return null;

  const totalStr = packageMatch[2] || packageMatch[3];
  const total = totalStr ? parseFloat(totalStr.replace(/,/g, "")) : 0;

  const itemsText = packageMatch[1];
  const items: LineItem[] = [];

  // Parse lines like "- **Service Name**: $1,200 – description"
  const itemLines = itemsText.match(/[-•]\s+\*?\*?([^:$\n]+)\*?\*?[:\s]+\$([0-9,]+)([^\n]*)/g) || [];
  for (const line of itemLines) {
    const m = line.match(/[-•]\s+\*?\*?([^:$\n]+?)\*?\*?\s*[:\-–]\s*\$([0-9,]+)(.*)?/);
    if (m) {
      items.push({
        name: m[1].trim(),
        description: m[3]?.trim().replace(/^[–\-\s]+/, "") || "",
        price: parseFloat(m[2].replace(/,/g, "")),
      });
    }
  }

  return { items, total };
}

export function checkInvoiceTrigger(text: string): boolean {
  return text.includes("<<<GENERATE_INVOICE>>>");
}

export function checkContactTrigger(text: string): boolean {
  return text.includes("<<<COLLECT_CONTACT>>>");
}

export function extractClientInfo(messages: Array<{ role: string; content: string }>): {
  name: string | null;
  email: string | null;
  phone: string | null;
} {
  let name: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;

  const fullText = messages.map((m) => m.content).join(" ");

  // Email pattern
  const emailMatch = fullText.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/);
  if (emailMatch) email = emailMatch[0];

  // Phone pattern (international formats)
  const phoneMatch = fullText.match(/(?:\+?[\d\s\-().]{7,20})/);
  if (phoneMatch) phone = phoneMatch[0].trim();

  // Name patterns
  const namePatterns = [
    /(?:great|perfect|wonderful|nice to meet you)[,!]?\s+([A-Z][a-z]+)/,
    /(?:my name is|i'm|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:hello|hi)[,!]?\s+([A-Z][a-z]+)/,
  ];
  for (const p of namePatterns) {
    const m = fullText.match(p);
    if (m) { name = m[1]; break; }
  }

  return { name, email, phone };
}
