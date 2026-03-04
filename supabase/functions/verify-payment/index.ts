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
    const { reference, orderId, method, amountPaid, trancheIndex, totalTranches, trancheLabel } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, invoice_number, total_usd, status")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingPayments } = await supabase
      .from("payments")
      .select("amount_usd, status")
      .eq("order_id", orderId)
      .eq("status", "paid");

    const previouslyPaid = (existingPayments || []).reduce(
      (sum: number, p: { amount_usd: number }) => sum + Number(p.amount_usd), 0
    );

    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .insert({
        order_id: orderId,
        amount_usd: amountPaid,
        method,
        status: "paid",
        transaction_reference: reference,
        paid_at: new Date().toISOString(),
        gateway_response: { test: true, reference, tranche_index: trancheIndex, total_tranches: totalTranches, tranche_label: trancheLabel },
      })
      .select()
      .single();

    if (payErr) throw payErr;

    const totalPaidNow = previouslyPaid + amountPaid;
    const isFullyPaid = totalPaidNow >= Number(order.total_usd);
    const newStatus = isFullyPaid ? "paid" : "partial_payment";

    await supabase.from("orders").update({ status: newStatus, payment_method: method, payment_reference: reference }).eq("id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        isFullyPaid,
        totalPaid: totalPaidNow,
        remaining: Math.max(0, Number(order.total_usd) - totalPaidNow),
        orderStatus: newStatus,
        receiptData: {
          invoiceNumber: order.invoice_number,
          amountPaid,
          totalPaid: totalPaidNow,
          remaining: Math.max(0, Number(order.total_usd) - totalPaidNow),
          isFullyPaid,
          trancheLabel,
          trancheIndex,
          totalTranches,
          method,
          reference,
          paidAt: payment.paid_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
