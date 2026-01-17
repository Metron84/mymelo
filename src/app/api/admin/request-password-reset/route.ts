import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify this is the admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (email !== adminEmail) {
      // Return success message regardless to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an admin account exists with this email, you will receive a password reset link.',
      });
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate reset token using database function
    const { data: tokenData, error: tokenError } = await supabase.rpc(
      'generate_admin_reset_token',
      { admin_email: email }
    );

    if (tokenError) {
      console.error('Token generation error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to generate reset token' },
        { status: 500 }
      );
    }

    const resetToken = tokenData[0]?.token;
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Failed to generate reset token' },
        { status: 500 }
      );
    }

    // Create reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/password-reset-verification?token=${resetToken}`;

    // Call edge function to send email
    const { data: emailData, error: emailError } = await supabase.functions.invoke(
      'send-admin-password-reset',
      {
        body: {
          email,
          resetToken,
          resetUrl,
        },
      }
    );

    if (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully',
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}