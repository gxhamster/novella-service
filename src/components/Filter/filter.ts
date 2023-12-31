import { z } from "zod";
type FilterOps = "eq" | "gt" | "lt";

export type FilterNumber = {
  start: number | string;
  end: number | string;
  operator: FilterOps;
};

export type FilterText = string | undefined;

export type FilterDate = {
  start: string;
  end: string;
  operator: FilterOps;
};

export type FilterSelect = string | undefined;

const FilterFieldNumberSchema = z.object({
  start: z.number().or(z.string()),
  end: z.number().or(z.string()),
  operator: z.enum(["eq", "gt", "lt"]),
});

const FilterFieldDateSchema = FilterFieldNumberSchema;

export const filterSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
  filters: z
    .object({
      id: FilterFieldNumberSchema,
      issued_date: FilterFieldDateSchema,
      book_id: FilterFieldNumberSchema,
      title: z.string(),
      student_id: FilterFieldNumberSchema,
      name: z.string(),
      due_date: FilterFieldDateSchema,
      status: z.string(),
    })
    .partial(),
});
