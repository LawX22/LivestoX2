import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const session: Ref<Session | null> = ref(null);
  const user: Ref<User | null> = ref(null);
  
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    session.value = null;
    user.value = null;
  };

  const getSession = async (): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    user.value = data.session?.user || null;
  };

  supabase.auth.onAuthStateChange((_: string, _session: Session | null) => {
    session.value = _session;
    user.value = _session ? _session.user : null;
  });

  return {
    session,
    user,
    logout,
    getSession,
  };
});