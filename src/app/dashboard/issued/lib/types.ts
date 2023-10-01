import { IBook, ITables } from "@/supabase/types/supabase";
import { IStudent } from "@/supabase/types/supabase";
import { IIssuedBook } from "@/supabase/types/supabase";

export type IIssuedBookV2 = Pick<IBook, "title"> &
  Pick<IStudent, "name"> &
  IIssuedBook;

export type IssuedBooksTableColumnDef = {
  id: any;
  header: string;
  baseHref?: string;
  isDisplayColumn?: boolean;
};

export type BooksTableColumnDef = {
  id: keyof IBook;
  header: string;
};

export type StudentsTableColumnDef = {
  id: keyof IStudent;
  header: string;
};
