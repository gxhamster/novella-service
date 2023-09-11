// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { Database } from "@/types/supabase";
// import { cookies } from "next/headers";

export type IssuedBooksResult = {
  id: number;
  student_name: string;
  title: string;
  issue_date: any;
  due_date: any;
};

export type BooksResult = {
  id: number;
  title: string;
  author: string;
  isbn: number;
};
// export const getAllBooks = async () => {
//   const supabaseServer = createServerComponentClient({ cookies });
//   let { data: books, error } = await supabaseServer
//     .from("books")
//     .select("id, title, author, isbn");
//   return { books, booksError: error };
// };
