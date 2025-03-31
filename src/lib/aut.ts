import { supabase } from "./supabaseClient";

export const signUpConfirm = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    console.log('User signed up:', data);
    return data;
  } catch (error) {
    console.error('Signup error:', (error as Error).message);
    return null;
  }
};

export const signUp = async () => {
    
}

export const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) throw error;
  
      console.log('User signed in:', data);
      return data;
    } catch (error) {
      console.error('Sign-in error:', (error as Error).message);
      return null;
    }
  };
  
