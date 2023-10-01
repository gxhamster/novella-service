import { NDataTableFixedFetchFunction } from "@/components/NDataTableFixed";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";
import { IStudent } from "@/supabase/types/supabase";

export const getStudentsByPage: NDataTableFixedFetchFunction<
  IStudent
> = async ({ pageIndex, pageSize, filters, sorts }) => {
  const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
  const supabase = createClientComponentClient<Database>();

  let query = supabase.from("students").select("*", { count: "estimated" });
  if (filters.length > 0) query = query.or(supabaseFilters);
  if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
  query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return { data, count: count ? count : 0 };
};
