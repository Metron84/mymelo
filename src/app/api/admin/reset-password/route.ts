import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token is still valid
    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_password_reset_tokens')
      .select('email, used, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        { error: 'This reset link has already been used' },
        { status: 400 }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This reset link has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update environment variable (Note: This updates runtime only, not .env file)
    // In production, you would update the password in your secure configuration management system
    process.env.ADMIN_PASSWORD_HASH = hashedPassword;

    // Mark token as used
    const { error: updateError } = await supabase
      .from('admin_password_reset_tokens')
      .update({ used: true })
      .eq('token', token);

    if (updateError) {
      console.error('Error marking token as used:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An error occurred resetting the password' },
      { status: 500 }
    );
  }
}