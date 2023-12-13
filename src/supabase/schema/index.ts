import { z } from "zod";

export const ZTableFetchFunctionOptions = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
  filters: z.array(
    z.object({
      id: z.number(),
      prop: z.string(),
      operator: z.string(),
      value: z.string().or(z.number()),
    })
  ),
  sorts: z
    .object({
      field: z.string(),
      ascending: z.boolean(),
    })
    .nullable(),
});

export const ZBook = z.object({
  id: z.number(),
  created_at: z.string().nullable(),
  ddc: z.string().nullable(),
  edition: z.string().nullable(),
  genre: z.string().nullable(),
  isbn: z.number().nullable(),
  author: z.string().nullable(),
  language: z.string().nullable(),
  pages: z.number().nullable(),
  publisher: z.string().nullable(),
  title: z.string().nullable(),
  year: z.number().nullable(),
  user_id: z.string(),
});

export const ZHistory = z.object({
  book_id: z.number().nullable(),
  created_at: z.string(),
  due_date: z.string().nullable(),
  id: z.number(),
  issued_date: z.string().nullable(),
  returned_date: z.string().nullable(),
  student_id: z.number().nullable(),
  user_id: z.string().nullable(),
});

export const ZHistoryInsert = z.object({
  book_id: z.number(),
  created_at: z.string().optional(),
  due_date: z.string().optional(),
  id: z.number(),
  issued_date: z.string().optional(),
  returned_date: z.string().optional(),
  student_id: z.number(),
  user_id: z.string(),
});

export const ZIssued = z.object({
  book_id: z.number(),
  created_at: z.string(),
  due_date: z.string(),
  id: z.number(),
  student_id: z.number(),
  user_id: z.string(),
});

export const ZIssuedInsert = z.object({
  book_id: z.number(),
  created_at: z.string().optional(),
  due_date: z.string().nullable(),
  id: z.number().optional(),
  student_id: z.number(),
  user_id: z.string().nullable().optional(),
});

export const ZIssuedV2 = z.object({
  book_id: z.number(),
  created_at: z.string(),
  due_date: z.string(),
  id: z.number(),
  student_id: z.number(),
  user_id: z.string(),
  title: z.string(),
  name: z.string(),
});

export const ZStudent = z.object({
  address: z.string().nullable(),
  created_at: z.string(),
  grade: z.number().nullable(),
  id: z.number(),
  index: z.number(),
  island: z.string().nullable(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  user_id: z.string(),
});

export const ZStudentInsert = z.object({
  address: z.string().nullable().optional(),
  created_at: z.string().optional(),
  grade: z.number().nullable().optional(),
  id: z.number().optional(),
  index: z.number(),
  island: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  user_id: z.string().optional(),
});
