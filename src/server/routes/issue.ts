import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
  ZIssued,
  ZIssuedInsert,
  ZTableFetchFunctionOptions,
} from "@/supabase/schema";
import { TRPCError } from "@trpc/server";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";
import { error } from "console";
import { IHistory, IHistoryInsert } from "@/supabase/types/supabase";

export const IssueRouter = router({
  getIssuedBookById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("issued")
      .select("*, book_id, books (id, title), student_id, students (id, name)")
      .eq("id", input);

    const resultIssuedBook = data ? data[0] : null;

    if (error)
      throw new Error(error.message, {
        cause: error.details,
      });

    return { data: resultIssuedBook };
  }),

  getIssuedBooksByPage: publicProcedure
    .input(ZTableFetchFunctionOptions)
    .query(async (opts) => {
      const { filters, sorts, pageIndex, pageSize } = opts.input;
      const { supabase } = opts.ctx;
      const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);

      let query = supabase
        .from("issued")
        .select("*, book_id, books (title), student_id, students (name)", {
          count: "estimated",
        });
      if (filters.length > 0) query = query.or(supabaseFilters);
      if (sorts)
        query = query.order(sorts.field, { ascending: sorts.ascending });
      query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
      const { data, count, error } = await query;
      const flatData = data?.map((v) => {
        return {
          book_id: v.book_id,
          created_at: v.created_at,
          id: v.id,
          student_id: v.student_id,
          name: v.students?.name || "",
          title: v.books?.title || "",
          due_date: v.due_date,
          user_id: v.user_id,
        };
      });

      if (error) throw new Error(error.message);

      return { data: flatData ? flatData : [], count: count ? count : 0 };
    }),

  updateIssuedBookById: publicProcedure
    .input(ZIssued.partial())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      if (!input.id) {
        throw new TRPCError({
          message: "ID of the book is not given",
          code: "BAD_REQUEST",
        });
      }

      const { data: updatedIssuedBook, error } = await supabase
        .from("issued")
        .update(input)
        .eq("id", input.id)
        .select();

      if (!error) return updatedIssuedBook;

      throw new TRPCError({
        message: error.message,
        code: "BAD_REQUEST",
        cause: error.details,
      });
    }),

  deleteIssuedBookById: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("issued").delete().eq("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  deleteIssuedBooksById: publicProcedure
    .input(z.array(z.number()))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("issued").delete().in("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  createIssuedBook: publicProcedure
    .input(ZIssuedInsert)
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("issued").insert(input).select();

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  getTotalIssuedBooks: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const { count } = await supabase
      .from("issued")
      .select("*", { count: "exact", head: true });

    return { count };
  }),

  returnIssuedBook: publicProcedure
    .input(z.object({ id: z.number(), returned_date: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      const { data: issuedBook, error: issuedBookError } = await supabase
        .from("issued")
        .select("book_id, student_id, due_date, created_at")
        .eq("id", input.id);

      if (issuedBookError)
        throw new TRPCError({
          message: issuedBookError.message,
          cause: issuedBookError.details,
          code: "INTERNAL_SERVER_ERROR",
        });

      if (issuedBook) {
        // Remove from issue table
        const { error: deleteError } = await supabase
          .from("issued")
          .delete()
          .eq("id", input.id);

        if (deleteError)
          throw new TRPCError({
            message: deleteError.message,
            cause: deleteError.details,
            code: "INTERNAL_SERVER_ERROR",
          });

        const returnedBook: IHistoryInsert = {
          book_id: issuedBook[0].book_id,
          student_id: issuedBook[0].student_id,
          issued_date: issuedBook[0].created_at,
          due_date: issuedBook[0].due_date,
          returned_date: input.returned_date,
        };

        // Add to history table
        const { data: historyData, error: historyError } = await supabase
          .from("history")
          .insert(returnedBook);

        if (historyError) {
          throw new TRPCError({
            message: historyError.message,
            cause: historyError.details,
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return { data: historyData };
      }
    }),
});
