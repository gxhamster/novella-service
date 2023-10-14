import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { ZHistoryInsert, ZTableFetchFunctionOptions } from "@/supabase/schema";
import { TRPCError } from "@trpc/server";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";

export const HistoryRouter = router({
  getHistoryById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("history")
      .select("*, book_id, books (id, title), student_id, students (id, name)")
      .eq("id", input);
    const resultIssuedBook = data ? data[0] : null;

    if (error)
      throw new Error(error.message, {
        cause: error.details,
      });

    return { data: resultIssuedBook };
  }),

  getHistoryByPage: publicProcedure
    .input(ZTableFetchFunctionOptions)
    .query(async (opts) => {
      const { filters, sorts, pageIndex, pageSize } = opts.input;
      const { supabase } = opts.ctx;
      const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);

      let query = supabase.from("history").select("*", {
        count: "estimated",
      });
      if (filters.length > 0) query = query.or(supabaseFilters);
      if (sorts)
        query = query.order(sorts.field, { ascending: sorts.ascending });
      query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
      const { data, count, error } = await query;

      if (error) throw new Error(error.message);
      return { data, count: count ? count : 0 };
    }),

  createHistory: publicProcedure
    .input(ZHistoryInsert)
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      const { error } = await supabase.from("history").insert(input).select();

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),
});
