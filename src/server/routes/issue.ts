import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { ZIssued, ZIssuedInsert } from "@/supabase/schema";
import { TRPCError } from "@trpc/server";
import { FilterNumber, filterSchema } from "@/components/Filter/filter";
import { IssuedPageTableFilter } from "@/app/issued/page";

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
    .input(filterSchema)
    .query(async (opts) => {
      const { filters, pageIndex, pageSize } = opts.input;
      const { supabase } = opts.ctx;

      console.log(filters);
      let query = supabase.from("issued_table_view").select("*", {
        count: "estimated",
      });

      function createRangeQuery(
        columnName: keyof IssuedPageTableFilter,
        params: FilterNumber
      ) {
        if (params.end) {
          query = query.gt(columnName, params.start);
          query = query.lt(columnName, params.end);
        } else {
          switch (params.operator) {
            case "eq":
              query = query.eq(columnName, params.start);
              break;
            case "lt":
              query = query.lt(columnName, params.start);
              break;
            case "gt":
              query = query.gt(columnName, params.start);
              break;
            default:
              throw new Error("Unrecognized filter operator");
          }
        }
      }

      if (filters.id) createRangeQuery("id", filters.id);

      if (filters.book_id) createRangeQuery("book_id", filters.book_id);

      if (filters.student_id)
        createRangeQuery("student_id", filters.student_id);

      if (filters.title) query = query.eq("title", filters.title);

      if (filters.name) query = query.eq("name", filters.name);

      if (filters.issued_date)
        createRangeQuery("issued_date", filters.issued_date);

      if (filters.due_date) createRangeQuery("due_date", filters.due_date);

      if (filters.status) query = query.eq("status", filters.status);

      const { data, count } = await query.range(
        pageIndex * pageSize,
        pageSize * (pageIndex + 1)
      );

      return { data: data || [], count: count || 0 };
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
    .input(z.array(z.object({ id: z.number(), returned_date: z.string() })))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      const ids = input.map((returnObjs) => returnObjs.id);
      const { data: issuedBooks, error: issuedBookError } = await supabase
        .from("issued")
        .select("id, book_id, student_id, due_date, created_at")
        .in("id", ids);

      if (issuedBookError)
        throw new TRPCError({
          message: issuedBookError.message,
          cause: issuedBookError.details,
          code: "INTERNAL_SERVER_ERROR",
        });

      if (issuedBooks) {
        // Remove from issue table
        const { error: deleteError } = await supabase
          .from("issued")
          .delete()
          .in("id", ids);

        if (deleteError)
          throw new TRPCError({
            message: deleteError.message,
            cause: deleteError.details,
            code: "INTERNAL_SERVER_ERROR",
          });

        if (issuedBooks.length !== ids.length) {
          throw new TRPCError({
            message:
              "Input returned books length is not equal to queried issued books",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const returnedBookObjs = issuedBooks.map((issuedBook) => {
          const matching_ids = input.filter((n) => n.id === issuedBook.id);

          if (!matching_ids.length)
            throw new TRPCError({
              message:
                "Input is missing returned_date for an expected issue id",
              code: "INTERNAL_SERVER_ERROR",
            });

          if (matching_ids.length > 1) {
            throw new TRPCError({
              message: "Input contains duplicate ids",
              code: "INTERNAL_SERVER_ERROR",
            });
          }

          const returned_date = matching_ids[0].returned_date;

          const historyEntry = {
            book_id: issuedBook.book_id,
            student_id: issuedBook.student_id,
            issued_date: issuedBook.created_at,
            due_date: issuedBook.due_date,
            returned_date,
          };

          return historyEntry;
        });

        // Add to history table
        const { data: historyData, error: historyError } = await supabase
          .from("history")
          .insert(returnedBookObjs);

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
