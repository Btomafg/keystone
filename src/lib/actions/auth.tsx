"use server";;
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

/**
 * Sign Up Action
 */
export const signUpAction = async ({ email, password }: { email: string; password: string }) => {
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { success: false, message: "Email and password are required", type: "error" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    console.error(`Signup Error: ${error.code} - ${error.message}`);
    return { success: false, message: error.message, type: "error" };
  }

  return {
    success: true,
    message: "Thanks for signing up! Please check your email for a verification link.",
    type: "success",
  };
};

/**
 * Sign In Action
 */
export const signInAction = async ({ email, password }: { email: string; password: string }) => {
  const supabase = await createClient();

  if (!email || !password) {
    return { function: 'signin', success: false, message: "Email and password are required", type: "error" };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(`Sign In Error: ${error.message}`);
      return { function: 'signin', success: false, message: error.message, type: "error" };
    }

    return { function: 'signin', success: true, message: "You're successfully signed in.", type: "success" };
  } catch (error) {
    console.error("Unexpected Sign In Error:", error);
    return { function: 'signin', success: false, message: "Something went wrong. Try again.", type: "error" };
  }
};

/**
 * Forgot Password Action
 */
export const forgotPasswordAction = async ({ email }: { email: string }) => {
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email) {
    return { function: 'forgotpassword', success: false, message: "Email is required", type: "error" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(`Password Reset Error: ${error.message}`);
    return { function: 'forgotpassword', success: false, message: "Could not reset password", type: "error" };
  }

  return { function: 'forgotpassword', success: true, message: "We've sent a password reset link.", type: "success" };
};

/**
 * Reset Password Action
 */
export const resetPasswordAction = async ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  const supabase = await createClient();

  if (!password || !confirmPassword) {
    return { function: 'resetpassword', success: false, message: "Password and confirm password are required", type: "error" };
  }

  if (password !== confirmPassword) {
    return { function: 'resetpassword', success: false, message: "Passwords do not match", type: "error" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error(`Password Update Error: ${error.message}`);
    return { function: 'resetpassword', success: false, message: "Password update failed", type: "error" };
  }

  return { function: 'resetpassword', success: true, message: "Your password has been updated.", type: "success" };
};

/**
 * Sign Out Action
 */
export const signOutAction = async () => {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    return { function: 'signout', success: true, message: "You've been signed out.", type: "success" };
  } catch (error) {
    console.error("Sign Out Error:", error);
    return { function: 'signout', success: false, message: "Failed to sign out.", type: "error" };
  }
};
