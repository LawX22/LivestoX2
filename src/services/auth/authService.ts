import { supabase } from "../../supabase";

const signUpBuyer = async (
  email: string,
  password: string,
  additionalInfo = {}
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: additionalInfo,
    },
  });

  if (error) {
    throw error;
  }
  return data;
};

const resendEmailOtp = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });
  if (error) {
    throw error;
  }
};

const verifyEmailOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    throw error;
  }
  return data;
};

const checkUsernameAvailable = async (username: string) => {
  const { data, error } = await supabase
    .rpc('is_username_exist', { username })
    .single();

  if (error) {
    throw error;
  }
  return !data;
};

const checkEmailAvailable = async (email: string) => {
  const { data, error } = await supabase
    .rpc('is_email_exist', { email })
    .single();

  if (error) {
    throw error;
  }
  return !data;
};

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  return data;
};

export const auth = {
  signUpBuyer,
  resendEmailOtp,
  verifyEmailOtp,
  checkUsernameAvailable,
  checkEmailAvailable,
  signIn
};