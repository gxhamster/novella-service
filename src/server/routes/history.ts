import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { ZHistory, ZTableFetchFunctionOptions } from "@/supabase/schema";
import { TRPCError } from "@trpc/server";
import { NDataTableFixedConvertToSupabaseFilters } from "@/components/NDataTableFixed";
import { getShape } from "postgrest-js-tools";
import { IHistory } from "@/supabase/types/supabase";
import { format } from "date-fns";

const getHistoryByDateShape = getShape<IHistory>()({
  id: true,
  created_at: true,
});

export type getHistoryByDateType = typeof getHistoryByDateShape;

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

      let query = supabase
        .from("history")
        .select("*, book_id, books(title), student_id, students(name)", {
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
    .input(ZHistory.partial())
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
  deleteHistoryById: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("history").delete().eq("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  deleteHistoryByIds: publicProcedure
    .input(z.array(z.number()))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("history").delete().in("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  getTotalHistoryCount: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const { count } = await supabase
      .from("history")
      .select("*", { count: "exact", head: true });

    return { count };
  }),

  getIssueHistoryCurrentMonth: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const dateLowerBound = new Date();
    dateLowerBound.setDate(1);

    const { data, error } = await supabase
      .from("history")
      .select("id, issued_date")
      .gt("issued_date", dateLowerBound.toISOString());

    if (error)
      throw new TRPCError({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
        cause: error.details,
      });

    if (data) {
      const filteredData = new Map();
      const result = {
        dates: new Array(),
        issues: new Array(),
      };

      for (const history of data) {
        if (!history.issued_date) {
          throw new TRPCError({
            message: "Issued date is null",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        const day = new Date(
          format(new Date(history.issued_date), "dd-MMM-yyy")
        ).toISOString();
        if (!filteredData.has(day)) {
          filteredData.set(day, 1);
        } else {
          filteredData.set(day, filteredData.get(day) + 1);
        }
      }
      result.dates = Array.from(filteredData, ([key, _]) => key);
      result.issues = Array.from(filteredData, ([_, value]) => value);

      return { data: result };
    }
  }),

  getReturnHistoryCurrentMonth: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const dateLowerBound = new Date();
    dateLowerBound.setDate(1);

    const { data, error } = await supabase
      .from("history")
      .select("id, returned_date")
      .gt("issued_date", dateLowerBound.toISOString());

    if (error)
      throw new TRPCError({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
        cause: error.details,
      });

    if (data) {
      const filteredData = new Map();
      const result = {
        dates: new Array(),
        returns: new Array(),
      };

      for (const history of data) {
        if (!history.returned_date) {
          throw new TRPCError({
            message: "Issued date is null",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        const day = new Date(
          format(new Date(history.returned_date), "dd-MMM-yyy")
        ).toISOString();
        if (!filteredData.has(day)) {
          filteredData.set(day, 1);
        } else {
          filteredData.set(day, filteredData.get(day) + 1);
        }
      }
      result.dates = Array.from(filteredData, ([key, _]) => key);
      result.returns = Array.from(filteredData, ([_, value]) => value);

      return { data: result };
    }
  }),
});
