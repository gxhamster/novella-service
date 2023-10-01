import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  NDataTableFixedConvertToSupabaseFilters,
  NDataTableFixedFetchFunctionProps,
} from "@/components/NDataTableFixed";
import { Database, ITables } from "@/supabase/types/supabase";

const supabase = createClientComponentClient<Database>();

export async function DGetRowsByPage<TableType>(
  table: ITables,
  select: string = "*",
  {
    pageIndex,
    pageSize,
    filters,
    sorts,
  }: NDataTableFixedFetchFunctionProps<TableType>
) {
  const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);

  let query = supabase.from(table).select(select, { count: "estimated" });
  if (filters.length > 0) query = query.or(supabaseFilters);
  if (sorts)
    query = query.order(String(sorts.field), { ascending: sorts.ascending });
  query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return { data, count: count ? count : 0 };
}
