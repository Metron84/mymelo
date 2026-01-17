import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }

  try {
    const { readerEmail, readerName, contentTitle, contentType, contentUrl } = await req?.json();
    
    const RESEND_API_KEY = Deno?.env?.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [readerEmail],
        subject: `New ${contentType} published on MrMelo.com`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${readerName},</h2>
            <p>A new ${contentType} has been published on MrMelo.com that you might be interested in:</p>
            <h3>${contentTitle}</h3>
            <p>
              <a href="${contentUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
                Read Now
              </a>
            </p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #6b7280; font-size: 14px;">
              You are receiving this email because you subscribed to notifications on MrMelo.com.
              <br />
              <a href="${contentUrl}/unsubscribe" style="color: #6b7280;">Manage your notification preferences</a>
            </p>
          </div>
        `
      })
    });

    if (!emailResponse?.ok) {
      const errorData = await emailResponse?.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse?.json();

    return new Response(JSON.stringify({
      success: true,
      emailId: emailData.id,
      message: "Notification email sent successfully"
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});