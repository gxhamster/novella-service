import { NDataTableFixedFetchFunction } from "@/components/NDataTableFixed";
import { IIssuedBookV2 } from "@/app/issued/lib/types";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";

export const getIssuedBooksByPage: NDataTableFixedFetchFunction<
  IIssuedBookV2
> = async ({ pageIndex, pageSize, filters, sorts }) => {
  const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
  const supabase = createClientComponentClient<Database>();

  let query = supabase
    .from("issued")
    .select("*, book_id, books (title), student_id, students (name)", {
      count: "estimated",
    })
    .eq("returned", "FALSE");
  if (filters.length > 0) query = query.or(supabaseFilters);
  if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
  query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
  const { data, count, error } = await query;
  const flatData = data?.map((v) => {
    return { ...v, title: v.books?.title, name: v.students?.name };
  });

  if (error) throw new Error(error.message);

  return { data: flatData, count: count ? count : 0 };
};
