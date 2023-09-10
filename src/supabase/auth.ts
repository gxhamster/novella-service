import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseClient = createClientComponentClient();

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
}
