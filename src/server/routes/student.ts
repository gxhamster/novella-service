import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
  ZStudent,
  ZStudentInsert,
  ZTableFetchFunctionOptions,
} from "@/supabase/schema";
import { TRPCError } from "@trpc/server";
import { getShape } from "postgrest-js-tools";
import { IStudent } from "@/supabase/types/supabase";
import { FixedTableFilterToSupabase } from "@/components/FixedTable";

const getStudentByIdShape = getShape<IStudent>()({
  id: true,
  created_at: true,
  name: true,
  island: true,
  address: true,
  phone: true,
  grade: true,
  index: true,
  user_id: true,
});

export type getStudentByIdType = typeof getStudentByIdShape;

const getStudentsByPageShape = getShape<IStudent>()({
  id: true,
  created_at: true,
  name: true,
  island: true,
  address: true,
  phone: true,
  grade: true,
  index: true,
});

export type getStudentsByPageType = typeof getStudentsByPageShape;

const getAllStudentsShape = getShape<IStudent>()({
  id: true,
  name: true,
  grade: true,
  index: true,
});

export type getAllStudentsType = typeof getAllStudentsShape;

export const StudentRouter = router({
  getAllStudents: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("students")
      .select("id, name, index, grade");

    if (error)
      throw new Error(error.message, {
        cause: error.details,
      });

    return { data };
  }),
  getStudentById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", input);

    const resultStudent = data ? data[0] : null;

    if (error)
      throw new Error(error.message, {
        cause: error.details,
      });

    return { data: resultStudent };
  }),

  getStudentsByPage: publicProcedure
    .input(ZTableFetchFunctionOptions)
    .query(async (opts) => {
      const { filters, sorts, pageIndex, pageSize } = opts.input;
      const { supabase } = opts.ctx;
      const supabaseFilters = FixedTableFilterToSupabase(filters);

      let query = supabase.from("students").select("*", {
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

  updateStudentById: publicProcedure
    .input(ZStudent.partial())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      if (!input.id) {
        throw new TRPCError({
          message: "ID of the book is not given",
          code: "BAD_REQUEST",
        });
      }

      const { data: updatedStudent, error } = await supabase
        .from("students")
        .update(input)
        .eq("id", input.id)
        .select();

      if (!error) return updatedStudent;

      console.log(input);

      throw new TRPCError({
        message: error.message,
        code: "BAD_REQUEST",
        cause: error.details,
      });
    }),

  changeAcademic: publicProcedure
    .input(z.array(ZStudentInsert))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;

      const idMissingData = input.filter((student) => !student.id);
      if (idMissingData.length) {
        throw new TRPCError({
          message: "ID of the book is not given",
          code: "BAD_REQUEST",
        });
      }

      const nullGrades = input.filter((student) => !student.grade);
      if (nullGrades.length) {
        throw new TRPCError({
          message: "Grades cannot be changed to empty",
          code: "BAD_REQUEST",
        });
      }

      const transformedInput = input.map((student) => ({
        id: student.id,
        grade: student.grade,
        index: student.index,
      }));

      const { data: updatedStudents, error } = await supabase
        .from("students")
        .upsert(transformedInput)
        .select();

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error.details,
        });

      return updatedStudents;
    }),

  deleteStudentById: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  deleteStudentsById: publicProcedure
    .input(z.array(z.number()))
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase
        .from("students")
        .delete()
        .in("id", input);

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  createStudent: publicProcedure
    .input(ZStudentInsert)
    .mutation(async (opts) => {
      const { input } = opts;
      const { supabase } = opts.ctx;
      const { error } = await supabase.from("students").insert(input).select();

      if (error)
        throw new TRPCError({
          message: error.message,
          code: "BAD_REQUEST",
          cause: error.details,
        });
    }),

  getTotalStudents: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const { count } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    return { count };
  }),

  getStudentsByGrade: publicProcedure
    .input(z.number().optional())
    .query(async (opts) => {
      const { supabase } = opts.ctx;
      const { input } = opts;

      if (!input) return { data: [] };

      const { data, error } = await supabase
        .from("students")
        .select("id, name, index, grade")
        .eq("grade", input)
        .order("id");

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
          cause: error.details,
        });

      return { data };
    }),

  getGradeValues: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;
    const { data, error } = await supabase
      .from("get_grade_values")
      .select("grade");

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error.details,
      });

    return { data };
  }),

  getMostPopular: publicProcedure.query(async (opts) => {
    const { supabase } = opts.ctx;

    const { data, error } = await supabase
      .from("get_most_popular_student")
      .select("*")
      .order("count", { ascending: false })
      .limit(1);

    if (error)
      throw new TRPCError({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
        cause: error.details,
      });

    return { data: data[0] };
  }),
});
