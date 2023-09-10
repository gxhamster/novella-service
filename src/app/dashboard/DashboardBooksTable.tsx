"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { BooksResult } from "@/supabase/db";
import { PaginationState } from "@tanstack/react-table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardBooksTable() {
  const columnHelper = createColumnHelper<BooksResult>();

  const getBooksByPage = async ({ pageIndex, pageSize }: PaginationState) => {
    const supabase = createClientComponentClient();
    const { data: books, error } = await supabase
      .from("books")
      .select("id, title, author, isbn")
      .range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count } = await supabase
      .from("books")
      .select("*", { head: true, count: "exact" });

    return { data: books, count };
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
