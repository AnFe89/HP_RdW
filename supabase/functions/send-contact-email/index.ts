import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TARGET_EMAIL = Deno.env.get("TARGET_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { record } = await req.json(); // Der Webhook sendet Payload im body
    // Falls direkt aufgerufen: const { name, email, message } = await req.json();

    const name = record?.name || "Unbekannt";
    const email = record?.email || "keine-email@example.com";
    const message = record?.message || "Keine Nachricht";

    console.log("Sende Email für:", name);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ritter Website <noreply@rdw-ev.de>", // Muss bei Resend verifiziert sein!
        to: [TARGET_EMAIL],
        reply_to: email, // Damit du direkt antworten kannst
        subject: `Neue Nachricht von ${name}`,
        html: `
          <h1>Neue Nachricht vom Kontaktformular</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Nachricht:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        `,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
