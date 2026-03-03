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
    const { reference, orderId, method } = await req.json();

    if (!reference || !orderId) {
      return new Response(JSON.stringify({ error: "Reference and orderId are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, clients(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let verificationSuccess = false;
    let gatewayResponse: Record<string, unknown> = {};

    if (method === "paystack") {
      // Verify with Paystack TEST API
      const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
      if (paystackKey) {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: { Authorization: `Bearer ${paystackKey}` },
        });
        const verifyData = await verifyRes.json();
        gatewayResponse = verifyData;
        verificationSuccess = verifyData?.data?.status === "success";
      } else {
        // TEST MODE: simulate success for references starting with "TEST_"
        verificationSuccess = reference.startsWith("TEST_") || reference.startsWith("mock_");
        gatewayResponse = { status: "test_mode", reference };
      }
    } else if (method === "paypal") {
      // TEST MODE: simulate success
      verificationSuccess = true;
      gatewayResponse = { status: "test_mode", reference, method: "paypal" };
    }

    if (verificationSuccess) {
      // Update order status to paid
      await supabase
        .from("orders")
        .update({ status: "paid", payment_method: method, payment_reference: reference })
        .eq("id", orderId);

      // Record payment
      await supabase.from("payments").insert({
        order_id: orderId,
        amount_usd: order.total_usd,
        method: method as "paystack" | "paypal",
        status: "success",
        transaction_reference: reference,
        gateway_response: gatewayResponse,
        paid_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          status: "paid",
          order: {
            id: order.id,
            invoiceNumber: order.invoice_number,
            clientName: order.clients?.name,
            clientEmail: order.clients?.email,
            total: order.total_usd,
            lineItems: order.line_items,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, status: "failed", message: "Payment verification failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("verify-payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
