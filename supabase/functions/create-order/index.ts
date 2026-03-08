import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      clientName,
      clientEmail,
      lineItems,
      discountPct = 0,
      sessionToken,
      chatSummary,
    } = await req.json();

    // Validate required fields
    if (!clientName || typeof clientName !== "string" || clientName.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Valid client name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      return new Response(JSON.stringify({ error: "Valid client email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new Response(JSON.stringify({ error: "Line items are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: { price: number }) => sum + item.price, 0);
    const discountAmount = subtotal * (Math.min(discountPct, 15) / 100);
    const total = subtotal - discountAmount;

    // Create or find client
    let clientId: string;
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", clientEmail.toLowerCase().trim())
      .single();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: clientName.trim(),
          email: clientEmail.toLowerCase().trim(),
          session_token: sessionToken,
        })
        .select("id")
        .single();
      if (clientError) throw clientError;
      clientId = newClient.id;
    }

    // Generate invoice number
    const { data: invNum } = await supabase.rpc("generate_invoice_number");
    const invoiceNumber = invNum || `GD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`;

    // Create order
    const servicesSummary = lineItems.map((i: { name: string }) => i.name).join(", ");
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        invoice_number: invoiceNumber,
        client_id: clientId,
        services_summary: servicesSummary,
        line_items: lineItems,
        subtotal_usd: subtotal,
        discount_pct: discountPct,
        discount_usd: discountAmount,
        total_usd: total,
        status: "awaiting_payment",
        chat_summary: chatSummary || "",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Store AI assistant message referencing order
    if (sessionToken) {
      await supabase.from("chat_messages").insert({
        session_token: sessionToken,
        order_id: order.id,
        role: "assistant",
        content: `Invoice generated: ${invoiceNumber}`,
        metadata: { type: "invoice_generated", order_id: order.id },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          invoiceNumber: order.invoice_number,
          clientName: clientName.trim(),
          clientEmail: clientEmail.toLowerCase().trim(),
          lineItems,
          subtotal,
          discountPct,
          discountAmount,
          total,
          status: order.status,
          createdAt: order.created_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("create-order error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create order" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
