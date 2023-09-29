"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { BooksResult } from "@/supabase/db";
import { PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IBook } from "@/types/supabase";

export default function DashboardBooksTable() {
  const columnHelper = createColumnHelper<IBook>();

  const getBooksByPage = async ({ pageIndex, pageSize }: PaginationState) => {
    const supabase = createClientComponentClient();
    let { data: books, error } = await supabase
      .from("books")
      .select("*")
      .range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count } = await supabase
      .from("books")
      .select("*", { head: true, count: "exact" });

    books = books
      ? books.map((v) => {
          const n_id = (
            <Link
              href={`/books/${v.id}`}
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

  const columnsObj: Array<{
    id: keyof IBook;
    header: string;
  }> = [
    { id: "id", header: "ID" },
    { id: "title", header: "Tilte" },
    { id: "author", header: "Author" },
    { id: "isbn", header: "ISBN" },
    { id: "genre", header: "Genre" },
    { id: "publisher", header: "Publisher" },
    { id: "edition", header: "Edition" },
    { id: "ddc", header: "DDC" },
    { id: "language", header: "Language" },
    { id: "year", header: "Year" },
    { id: "pages", header: "Pages" },
  ];

  const tanstackColumns = columnsObj.map((column) =>
    columnHelper.accessor(column.id, {
      cell: (info) => info.getValue(),
      header: column.header,
    })
  );
  return (
    <NovellaDataTable<IBook>
      columns={tanstackColumns}
      fetchData={getBooksByPage}
    />
  );
}
