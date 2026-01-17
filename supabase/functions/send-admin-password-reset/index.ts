import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // CORS preflight
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
    const { email, resetToken, resetUrl } = await req?.json();

    if (!email || !resetToken || !resetUrl) {
      return new Response(JSON.stringify({
        error: "Missing required fields: email, resetToken, resetUrl"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Send password reset email using Resend API
    const resendApiKey = Deno?.env?.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Admin Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d97706;">Admin Password Reset</h2>
            <p>You requested to reset your admin password. Click the link below to proceed:</p>
            <a href="${resetUrl}" 
               style="display: inline-block; 
                      padding: 12px 24px; 
                      background-color: #d97706; 
                      color: white; 
                      text-decoration: none; 
                      border-radius: 6px;
                      margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you did not request this password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
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
      message: "Password reset email sent successfully",
      emailId: emailData.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error("Error sending password reset email:", error);
    return new Response(JSON.stringify({
      error: error.message || "Failed to send password reset email"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});