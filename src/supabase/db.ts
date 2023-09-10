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
// export const getIssuedBooks = async () => {
//   const supabaseServer = createServerComponentClient<Database>({ cookies });
//   let { data: issued, error } = await supabaseServer
//     .from("issued")
//     .select("id, created_at, due_date, students(name), books(title)");

//   const issuedBooks = issued?.map((books) => {
//     const newObj = {
//       id: books.id,
//       student_name: books?.students?.name,
//       title: books?.books?.title,
//       issue_date: books.created_at,
//       due_date: books.due_date,
//     } as IssuedBooksResult;

//     return newObj;
//   });

//   return { issuedBooks, issuedBooksError: error };
// };

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
