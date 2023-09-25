"use client";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NovellaDataTableFixed from "@/components/NovellaDataTableFixed";
import { Database, IBook } from "@/types/supabase";
import { Filter } from "@/components/NovellaDataTableFixed/NovellaDataTableFixedFilterMenu";
import { Sort } from "@/components/NovellaDataTableFixed/NovellaDataTableFixedSortMenu";
import BooksCreateDrawer from "./BooksCreateDrawer";
import { useState } from "react";

export type TableFetchFunction<TableType> = {
  pageIndex: number;
  pageSize: number;
  filters: Filter[];
  sorts: Sort<TableType> | null;
};

// Take a filter array and return POSTGRES syntax filter
function createSupabaseFilters(filters: Filter[]): string {
  const filterStrArr = filters.map((filter, idx) => {
    return `${filter.prop}.${filter.operator}.${filter.value}`;
  });

  return `and(${filterStrArr.join(",")})`;
}

export default function BooksTable() {
  const columnHelper = createColumnHelper<IBook>();
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const getBooksByPage = async ({
    pageIndex,
    pageSize,
    filters,
    sorts,
  }: TableFetchFunction<IBook>) => {
    const supabaseFilters = createSupabaseFilters(filters);
    const supabase = createClientComponentClient<Database>();

    let query = supabase.from("books").select("*", { count: "estimated" });
    if (filters.length > 0) query = query.or(supabaseFilters);
    if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
    query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count, error } = await query;

    if (error) throw new Error(error.message);

    let books = data
      ? data.map((v) => {
          return {
            ...v,
            id: (
              <Link
                href={`/books/${v.id}`}
                className="hover:underline hover:text-primary-700"
              >
                {v.id}
              </Link>
            ),
          };
        })
      : null;

    // console.log("=== Sorts ===", data, count);
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

  const addBookToSupabase = async (formData: IBook) => {
    console.log("=== Adding book to supabase", formData);

    setSaveButtonLoading(true);
    const { _, error } = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then((res) => res.json());

    if (error) {
      throw new Error(error.message);
    }
    setSaveButtonLoading(false);
  };

  return (
    <>
      <BooksCreateDrawer
        title="Add new book to library"
        saveButtonLoadingState={saveButtonLoading}
        isOpen={isAddBookDrawerOpen}
        onBookFormSubmit={addBookToSupabase}
        closeModal={() => setIsAddBookDrawerOpen(false)}
      />
      <NovellaDataTableFixed<IBook>
        columns={columnsObj}
        tanStackColumns={tanstackColumns}
        onCreateRowButtonPressed={() => setIsAddBookDrawerOpen(true)}
        fetchData={getBooksByPage}
      />
    </>
  );
}
