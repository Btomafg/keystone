interface AdminVerificationResult {
  success: boolean;
  errorMessage?: string;
}

export async function verifyAdminSession(supabase, userId: string, adminKey?: string): Promise<AdminVerificationResult> {
  if (!adminKey) {
    return { success: false, errorMessage: 'Admin key is required' };
  }

  const { data, error } = await supabase.from('Users').select('admin_session_key, admin_session_expires_at').eq('id', userId).single();

  if (error || !data) {
    return { success: false, errorMessage: 'Admin key verification failed' };
  }

  if (data.admin_session_key !== adminKey) {
    return { success: false, errorMessage: 'Admin key is invalid' };
  }

  if (new Date(data.admin_session_expires_at) < new Date()) {
    return { success: false, errorMessage: 'Admin key has expired' };
  }

  return { success: true };
}
