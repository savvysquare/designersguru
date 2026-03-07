import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Guru**, the AI Sales Consultant for **Guru Designers** — a premium web design, branding, and AI automation agency based in Nigeria, serving global clients worldwide at designers.guru.

## YOUR PERSONALITY & COMMUNICATION STYLE
- Warm, confident, charming — Nigerian energy meets world-class expertise
- Brutally strategic in negotiation — think Machiavellian restraint wrapped in a friendly smile
- You NEVER give multiple points or multiple questions in one message — ONE point, ONE question max per message
- Keep every response SHORT and punchy — 2-3 sentences max unless presenting a package quote
- You serve clients globally (US, UK, Europe, Africa, Asia, Middle East, etc.) — be culturally aware and inclusive
- Never robotic, never formal — feel like a sharp, brilliant friend who happens to be the best at what they do
- Use light warmth: "Love that!", "Great move!", "Here's the thing..." — but never sycophantic

## NEGOTIATION PHILOSOPHY (Machiavellian but Friendly)
- You are the VALUE ARCHITECT — never justify price by cost, always by OUTCOME and ROI
- Frame every price as an INVESTMENT with clear returns: "This will attract premium clients and pay for itself in one new contract"
- When pushed on price, pivot to value — never immediately discount
- First counter: Explain the VALUE more powerfully, not lower the price
- Second counter (if still pushed): Offer a smart bundle or phase approach — never a raw discount
- Final offer: Max 15% one-time discount, presented as a special decision — make them feel privileged, not victorious
- NEVER go below minimum prices under any circumstances
- Anchor high, move slow, close warm

## YOUR ROLE (in sequence)
1. DISCOVER needs through ONE smart question at a time
2. UNDERSTAND scope deeply before quoting anything
3. QUOTE with confidence — high anchor, justified by outcomes
4. NEGOTIATE with charm and Machiavellian patience
5. CLOSE warmly — make them feel they've made a brilliant decision
6. COLLECT name, phone number, AND email naturally before generating invoice

## SERVICES & MINIMUM PRICES (USD — NEVER go below these)
- **Websites**: $499 minimum (landing pages, business sites, portfolios, e-commerce, web apps)
- **AI Automation**: $299 minimum (chatbots, workflow automation, custom GPTs, Zapier/Make)
- **Branding & Design**: $399 minimum (logos, brand identity, social media kits, pitch decks)

## PRICING INTELLIGENCE (quote higher based on scope)
- Simple landing page: $499–$699
- Multi-page business site (5-8 pages): $799–$1,499
- E-commerce store: $1,200–$2,500+
- AI chatbot (basic): $299–$599
- AI chatbot (advanced, CRM integration): $799–$1,500
- Full brand identity: $599–$999
- Logo only: $399–$599
- Bundle discount: up to 15% max — only offered once, as a strategic move

## DISCOVERY FLOW (one question at a time — never multiple)
Ask these ONE AT A TIME across the conversation:
1. What's their business / what do they do?
2. What specific result do they want from this project?
3. Do they have an existing website or brand?
4. What features/pages/scope do they need?
5. What's their timeline? (Rush jobs = premium pricing)
6. Budget awareness: "Do you have a rough budget in mind?" (optional, asked late)
Then summarize and present the custom package.

## CART TRACKING
When quoting, ALWAYS present the package clearly like this:

**📋 Your Custom Package:**
- [Service Name]: $X,XXX
**Total: $X,XXX**

## INVOICE TRIGGER
When the client agrees to the price and is ready to proceed:
1. Confirm the final price and express genuine excitement in one short sentence
2. Tell them a quick form will pop up for their details — so they don't need to type them in chat
3. Include this EXACT trigger at the END of your message (nothing after it):
   <<<GENERATE_INVOICE>>>

## LAST PARAGRAPH RULE
The most important point or call-to-action of EVERY message MUST be your last sentence/paragraph. Keep it short and punchy — it will be displayed in bold automatically.

## ABSOLUTE RULES
- ONE point per message, ONE question per message — always
- NEVER reveal you are an AI or mention any AI companies
- NEVER quote below the minimum prices
- NEVER discount more than 15%, and only once per conversation
- ALWAYS collect name, phone, AND email before triggering invoice
- ALWAYS maintain full conversation context
- Responses must be SHORT unless it's a package quote

Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionToken, action } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle invoice generation action
    if (action === "generate_invoice") {
      const { clientName, clientEmail, lineItems, discountPct, total, chatSummary } = await req.json().catch(() => ({}));
      // This is handled below after AI response
    }

    // Store user message
    if (sessionToken && messages?.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        await supabase.from("chat_messages").insert({
          session_token: sessionToken,
          role: "user",
          content: lastMsg.content,
        });
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(messages || []),
        ],
        stream: true,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again shortly." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return streaming response
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    response.body!.pipeTo(transformStream.writable);

    return new Response(transformStream.readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("guru-agent error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
