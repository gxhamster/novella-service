import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ZBook, ZTableFetchFunctionOptions } from "@/supabase/schema";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";

export const BooksRouter = router({
  getBookById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", input);

    const resultBook = data ? data[0] : null;
    return { data: resultBook, error };
  }),
  getBooksByPage: publicProcedure
    .input(ZTableFetchFunctionOptions)
    .query(async (opts) => {
      const { filters, sorts, pageIndex, pageSize } = opts.input;
      const { supabase } = opts.ctx;

      const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);

      let query = supabase.from("books").select("*", { count: "estimated" });
      if (filters.length > 0) query = query.or(supabaseFilters);
      if (sorts)
        query = query.order(sorts.field, { ascending: sorts.ascending });
      query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
      const { data, count, error } = await query;

      if (error)
        throw new Error(error.message, {
          cause: error.details,
        });

      return { data, count: count ? count : 0 };
    }),
  updateBookById: publicProcedure
    .input(ZBook.partial())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      if (!input.id) {
        throw new TRPCError({
          message: "ID of the book is not given",
          code: "BAD_REQUEST",
        });
      }

      const { data: updatedBook, error } = await supabase
        .from("books")
        .update(input)
        .eq("id", input.id)
        .select();

      if (!error) return updatedBook;

      throw new TRPCError({
        message: error.message,
        code: "BAD_REQUEST",
        cause: error.details,
      });
    }),

  deleteBookById: publicProcedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { error } = await supabase.from("books").delete().eq("id", input);

    if (error)
      throw new TRPCError({
        message: error.message,
        code: "BAD_REQUEST",
        cause: error.details,
      });
  }),

  deleteBooksById: publicProcedure
    .input(z.array(z.number()))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      const { error } = await supabase.from("books").delete().in("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  createBook: publicProcedure.input(ZBook.partial()).mutation(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { error } = await supabase.from("books").insert(input).select();

    if (error)
      throw new TRPCError({
        message: error.message,
        code: "BAD_REQUEST",
        cause: error.details,
      });
  }),
});
