// components/auth/AuthStateSyncer.tsx (Example Path)
'use client'; // <-- Mark as a Client Component

import { createClient } from '@/lib/supabase/client';
import { setIsAuthenticated, setToken, setUser } from '@/store/slices/authSlice'; // Adjust path
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export function AuthStateSyncer() {
  const dispatch = useDispatch();
  // Initialize the Supabase client *once* using useState
  const supabase = createClient();
  console.log(supabase);
  // const supabase = createBrowserClient(
  // Ref to track if the initial session check is complete
  const initialCheckCompleted = useRef(false);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        console.log('Error fetching initial session:', error);
        if (error) {
          console.error('Error fetching initial Supabase session:', error);
          //  dispatch(clearAuthState()); // Clear state on error
        } else if (session) {
          // Initial state sync if session exists
          dispatch(setToken(session.access_token));
          dispatch(setUser(session.user)); // Dispatch the whole user object
          dispatch(setIsAuthenticated(true));
          // console.log('Initial session synced to Redux');
        } else {
          // No session found
          //dispatch(clearAuthState());
          // console.log('No initial session found.');
        }
      } catch (e) {
        console.error('Exception fetching initial session:', e);
        //dispatch(clearAuthState());
      } finally {
        initialCheckCompleted.current = true; // Mark initial check as done
      }
    };

    getInitialSession();

    // 2. Listen for subsequent auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Prevent race condition: only process listener events after initial check
      if (!initialCheckCompleted.current) {
        // console.log('Auth listener triggered before initial check completed, skipping.');
        return;
      }

      console.log(`Supabase Auth Event: ${event}`, session);
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED': // Handle user profile updates if needed
          if (session) {
            dispatch(setToken(session.access_token));
            dispatch(setUser(session.user));
            dispatch(setIsAuthenticated(true));
          } else {
            // Should not happen for these events, but clear state just in case
            //dispatch(clearAuthState());
          }
          break;
        case 'SIGNED_OUT':
          //dispatch(clearAuthState());
          break;
        // Handle other events like PASSWORD_RECOVERY if your app uses them
        default:
          break;
      }
    });

    // 3. Cleanup listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, dispatch]); // Effect dependencies

  // This component doesn't render any UI itself
  return null;
}
