"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { BooksResult } from "@/supabase/db";
import { PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardBooksTable() {
  const columnHelper = createColumnHelper<BooksResult>();

  const getBooksByPage = async ({ pageIndex, pageSize }: PaginationState) => {
    const supabase = createClientComponentClient();
    let { data: books, error } = await supabase
      .from("books")
      .select("id, title, author, isbn")
      .range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count } = await supabase
      .from("books")
      .select("*", { head: true, count: "exact" });

    books = books
      ? books.map((v) => {
          const n_id = (
            <Link
              href={`/dashboard/books/${v.id}`}
              className="hover:underline hover:text-primary-600"
            >
              {v.id}
            </Link>
          );
          v.id = n_id;
          return v;
        })
      : null;

    return { data: books, count: count ? count : 0 };
  };
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Title",
    }),
    columnHelper.accessor("author", {
      cell: (info) => info.getValue(),
      header: "Author",
    }),
    columnHelper.accessor("isbn", {
      cell: (info) => info.getValue(),
      header: "ISBN",
    }),
  ];

  return (
    <NovellaDataTable<BooksResult>
      columns={columns}
      fetchData={getBooksByPage}
    />
  );
}
