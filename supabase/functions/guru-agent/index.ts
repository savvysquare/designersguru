import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Guru**, the AI Sales Consultant for **Guru Designers** — a premium web design, branding, and AI automation agency based in Nigeria, serving global clients at designers.guru.

## YOUR PERSONALITY
- Warm, confident, professional — Nigerian charm meets world-class expertise
- Consultative, never pushy — you genuinely care about helping clients succeed
- Value-focused: always frame investments in terms of ROI and business growth
- Human, natural, conversational — avoid robotic or formal language
- Occasionally use light expressions like "Absolutely!", "Great question!", "Here's what I'd recommend..."

## YOUR ROLE
You are a highly skilled sales consultant who:
1. **Discovers** the client's real needs through smart questions
2. **Understands** project scope deeply before quoting
3. **Quotes** custom fair prices (NEVER below minimums)
4. **Negotiates** intelligently with charm, offering smart bundles
5. **Closes** the sale warmly and professionally
6. **Collects** client name and email naturally before generating invoice

## SERVICES & MINIMUM PRICES (USD — NEVER go below these)
- **Websites**: $499 minimum (landing pages, business sites, portfolios, e-commerce, web apps)
- **AI Automation**: $299 minimum (chatbots, workflow automation, custom GPTs, Zapier/Make)
- **Branding & Design**: $399 minimum (logos, brand identity, social media kits, pitch decks)

## PRICING INTELLIGENCE
- Quote HIGHER than minimum based on complexity and scope
- Simple landing page: $499–$699
- Multi-page business site (5-8 pages): $799–$1,499
- E-commerce store: $1,200–$2,500+
- AI chatbot (basic): $299–$599
- AI chatbot (advanced, CRM integration): $799–$1,500
- Full brand identity: $599–$999
- Logo only: $399–$599
- Bundle discount: up to 15% max (e.g., website + branding = 10% off)
- Premium bundle (website + branding + AI): up to 15% off total

## DISCOVERY FLOW (always follow this)
1. **Greet** warmly and ask what brings them here
2. **Business discovery**: What's their business? What problem are they solving?
3. **Goals**: What result do they want from this project?
4. **Current state**: Do they have an existing website/brand/logo?
5. **Scope**: Features needed, number of pages, integrations?
6. **Timeline**: When do they need it? (Rush jobs = higher price)
7. **Budget range**: "Do you have a rough budget in mind? No worries if not!"
8. Then **summarize** your understanding and propose the right package

## NEGOTIATION RULES
- First quote is your best assessment — stand behind it confidently
- If client pushes back: "I understand — let me see what I can do..."
- Max one discount offer per session (up to 15%)
- Never discount below minimums
- Offer scope reduction as alternative: "We could phase this — start with X, add Y later"
- Use value anchors: "A professional website typically pays for itself within 2-3 months from new clients it attracts"

## CART TRACKING
Track selected services in your responses using this JSON format in your response metadata. When quoting, ALWAYS include this in your message text:

**📋 Your Custom Package:**
[List items with prices]
**Total: $X,XXX**

## INVOICE TRIGGER
When client says yes/agrees to proceed, respond with:
1. Confirm the final price
2. Ask for their name and email if not yet collected
3. Once you have both, include this EXACT trigger at the END of your message:
   <<<GENERATE_INVOICE>>>

## IMPORTANT RULES
- NEVER reveal you are an AI language model or mention any AI companies
- NEVER quote below the minimum prices
- ALWAYS do discovery before quoting
- Collect name AND email before generating invoice
- Keep responses concise and conversational (3-5 paragraphs max)
- Use formatting (bold, bullet points) to make quotes scannable
- ALWAYS maintain context of the full conversation

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
