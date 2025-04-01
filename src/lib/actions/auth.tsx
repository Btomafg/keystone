
import { APP_ROUTES } from "@/constants/routes";
import { API } from '@/lib/api/api';
import store from "@/store"; // Adjust to match your store setup
import { logout, setIsAuthenticated, setRefreshTokenInterval, setToken, setUser } from "@/store/slices/authSlice"; // Adjust to match your slice setup
import { createClient } from '@/utils/supabase/component';
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export class SupabaseAuthService {
  static async signUp(email: string, password: string) {
    "use server";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, message: error.message, type: "error" };
    }

    return {
      success: true,
      message: "Thanks for signing up! Please check your email for a verification link.",
      type: "success",
    };
  }

  static async signIn(email: string, password: string) {
    "use server";
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.code === "email_not_confirmed") {
        this.resendOtpCode(email);
        return {
          success: false,
          message: "Please verify your email before signing in.",
          type: "email_not_confirmed",
        };
      }

      return { success: false, message: error.message, type: "error" };
    }

    const session = data.session;
    const user = session?.user;

    if (session && user) {
      store.dispatch(setToken(session.access_token));
      store.dispatch(setRefreshTokenInterval(new Date().toISOString()));
      store.dispatch(setIsAuthenticated(true));
      store.dispatch(setUser(user as User));
    }

    try {
      const userExist = await API.getOne('Users', 'first_name, last_name, email', 'id', user.id);

      if (userExist?.code === 'PGRST116') {
        await API.insert('Users', {
          id: user.id,
          email: user.email,
        })
      }

    } catch (error) {
      console.error(error);
    }



    return {
      data: user,
      success: true,
      message: "You're successfully signed in.",
      type: "success",
    };
  }

  static async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${APP_ROUTES.AUTH.RESET_PASSWORD.path}`,
    });

    if (error) {
      return {

        success: false,
        message: "Could not reset password",
        type: "error",
      };
    }

    return {

      success: true,
      message: "We've sent a password reset link.",
      type: "success",
    };
  }

  static async resetPassword(password: string, confirmPassword: string) {
    if (!password || !confirmPassword) {
      return {

        success: false,
        message: "Password and confirm password are required",
        type: "error",
      };
    }

    if (password !== confirmPassword) {
      return {

        success: false,
        message: "Passwords do not match",
        type: "error",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return {

        success: false,
        message: "Password update failed",
        type: "error",
      };
    }

    return {

      success: true,
      message: "Your password has been updated.",
      type: "success",
    };
  }

  static async signOut() {
    try {
      await supabase.auth.signOut();
      store.dispatch(logout());

      return {

        success: true,
        message: "You've been signed out.",
        type: "success",
      };
    } catch (error: any) {
      return {

        success: false,
        message: "Failed to sign out.",
        type: "error",
      };
    }
  }

  static async verifyOtpCode(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return {

        success: false,
        message: "OTP verification failed",
        type: "error",
      };
    }

    const session = data.session;
    if (session) {
      store.dispatch(setToken(session.access_token));
      store.dispatch(setRefreshTokenInterval(new Date().toISOString()));
      store.dispatch(setIsAuthenticated(true));
      store.dispatch(setUser(session.user as User));
    }

    return {

      success: true,
      message: "OTP verified",
      type: "success",
    };
  }

  static async resendOtpCode(email: string) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      return {

        success: false,
        message: "OTP resend failed",
        type: "error",
      };
    }

    return {

      success: true,
      message: "OTP resent",
      type: "success",
    };
  }

  static async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      store.dispatch(logout());
      return null;
    }

    const session = data.session;
    store.dispatch(setToken(session.access_token));
    store.dispatch(setRefreshTokenInterval(new Date().toISOString()));
    store.dispatch(setIsAuthenticated(true));
    store.dispatch(setUser(session.user as User));

    return session;
  }
}
