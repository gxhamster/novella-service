import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getIssuedBooks = async () => {
  const supabaseServer = createServerComponentClient({ cookies });
  let { data: issued, error } = await supabaseServer
    .from("issued")
    .select("id, created_at, due_date, students(name), books(title)");
  return { issued, error };
};
