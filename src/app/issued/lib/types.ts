import { getBooksByPageType } from "@/server/routes/books";
import { getStudentsByPageType } from "@/server/routes/student";
import { IBook } from "@/supabase/types/supabase";
import { IStudent } from "@/supabase/types/supabase";
import { IIssuedBook } from "@/supabase/types/supabase";

export type IIssuedBookV2 = Pick<IBook, "title"> &
  Pick<IStudent, "name"> &
  IIssuedBook;

export type IssuedBooksTableColumnDef = {
  id: any;
  header: string;
  baseHref?: string;
  isDate?: boolean;
  isDisplayColumn?: boolean;
};

export type BooksTableColumnDef = {
  id: keyof getBooksByPageType;
  header: string;
};

export type StudentsTableColumnDef = {
  id: keyof getStudentsByPageType;
  header: string;
};
