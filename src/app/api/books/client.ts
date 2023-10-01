import { NDataTableFixedFetchFunction } from "@/components/NDataTableFixed";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";
import { IBook } from "@/supabase/types/supabase";

export const addBookToSupabase = async (formData: IBook) => {
  const { _, error } = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((res) => res.json());

  if (error) {
    throw new Error(error.message);
  }
};

export const getBooksByPage: NDataTableFixedFetchFunction<IBook> = async ({
  pageIndex,
  pageSize,
  filters,
  sorts,
}) => {
  const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
  const supabase = createClientComponentClient<Database>();

  let query = supabase.from("books").select("*", { count: "estimated" });
  if (filters.length > 0) query = query.or(supabaseFilters);
  if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
  query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return { data, count: count ? count : 0 };
};
