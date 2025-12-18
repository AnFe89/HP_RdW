# 📧 E-Mail Versand Einrichten (WICHTIG)

Du hast nun ein Kontaktformular, das Nachrichten in deine Supabase-Datenbank (`contact_messages`) speichert.
Damit diese Nachrichten tatsächlich als E-Mail an `info@rdw-ev.de` gesendet werden, musst du eine **Supabase Edge Function** einrichten oder einen **Database Webhook** nutzen.

Hier ist der sicherste und sauberste Weg mittels Edge Function und **Resend** (der Standard-Email-Provider für Supabase).

## 1. Voraussetzungen

1.  Erstelle einen Account auf [Resend.com](https://resend.com) (Kostenlos für den Anfang).
2.  Erstelle einen **API Key** in Resend.
3.  **WICHTIG (Netcup):** Um Emails von `@rdw-ev.de` zu senden, musst du DNS Records bei Netcup hinterlegen.
    - Logge dich im [Netcup CCP](https://www.customercontrolpanel.de/) ein.
    - Gehe zu Domains -> Lupe bei `rdw-ev.de` -> DNS.
    - Füge die **3 CNAME** Records hinzu, die Resend dir anzeigt.
    - Füge den **MX** und **TXT** (SPF) Record hinzu, falls noch nicht vorhanden (Resend gibt dir die Werte).
    - _Hinweis:_ Bei Netcup dauert es oft 15-60 Minuten, bis die DNS Änderungen weltweit aktiv sind.

## 2. Supabase Secrets setzen

Gehe in dein Supabase Dashboard -> Settings -> Edge Functions (oder nutze die CLI) und setze die Secrets:

```bash
RESEND_API_KEY=re_123456789...
TARGET_EMAIL=info@rdw-ev.de
```

## 3. Die Edge Function (`supabase/functions/send-contact-email/index.ts`)

Erstelle lokal den Ordner: `supabase/functions/send-contact-email/` und darin die Datei `index.ts`:

```typescript
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
```

## 4. Webhook Einrichten (Im Dashboard)

Damit die E-Mail **automatisch** geschickt wird, wenn eine neue Zeile in `contact_messages` eingefügt wird:

1.  Gehe zu **Database** -> **Webhooks**.
2.  Erstelle einen neuen Webhook:
    - **Name:** `send-email-on-contact`
    - **Table:** `public.contact_messages`
    - **Events:** `INSERT`
    - **Type:** `HTTP Request`
    - **URL:** Deine Edge Function URL (z.B. `https://<project-ref>.supabase.co/functions/v1/send-contact-email`)
    - **Method:** `POST`
    - **HTTP Headers:** `Authorization: Bearer <DEIN_SERVICE_ROLE_KEY>` (Den findest du in Settings -> API).

---

Alternativ, wenn du **keine** Edge Functions nutzen willst/kannst, brauchst du einen Drittanbieter Service wie **Make.com** oder **Zapier**, der auf die Datenbank lauscht und dann die E-Mail schickt.
