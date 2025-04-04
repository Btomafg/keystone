import { API_ROUTES } from "@/constants/api.routes";
import store from "@/store"; // Adjust to match your store setup
import { logout } from "@/store/slices/authSlice";

export class SupabaseAuthService {
  static async signUp(email: string, password: string) {
    const res = await fetch(API_ROUTES.SIGN_UP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  }

  static async signIn(email: string, password: string) {
    const res = await fetch(API_ROUTES.SIGN_IN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  }

  static async forgotPassword(email: string) {
    const res = await fetch(API_ROUTES.FORGOT_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  }

  static async resetPassword(password: string, confirmPassword: string) {
    const res = await fetch(API_ROUTES.RESET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });
    return await res.json();
  }

  static async signOut() {
    const res = await fetch(API_ROUTES.SIGN_OUT, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      store.dispatch(logout());
    }
    return data;
  }

  static async verifyOtpCode(email: string, token: string) {
    const res = await fetch(API_ROUTES.VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    return await res.json();
  }

  static async resendOtpCode(email: string) {
    const res = await fetch(API_ROUTES.RESEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  }

  static async getSession() {
    const res = await fetch(API_ROUTES.GET_SESSION, { method: "GET" });
    return await res.json();
  }
}
