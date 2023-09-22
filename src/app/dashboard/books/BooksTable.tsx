"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NovellaDataTableFixed from "@/components/NovellaDataTableFixed";
import { Database, IBook } from "@/types/supabase";
import { Filter } from "@/components/NovellaDataTableFixed/NovellaDataTableFixedFilterMenu";

export type TableFetchFunction = {
  pageIndex: number;
  pageSize: number;
  filters: Filter[];
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
  const getBooksByPage = async ({
    pageIndex,
    pageSize,
    filters,
  }: TableFetchFunction) => {
    const supabaseFilters = createSupabaseFilters(filters);
    let books;
    let count;
    const supabase = createClientComponentClient<Database>();
    if (filters.length > 0) {
      const { data, count: _count } = await supabase
        .from("books")
        .select(
          "id, title, author, isbn, genre, publisher, ddc, edition, language, year, pages",
          { count: "exact" }
        )
        .or(supabaseFilters)
        .range(pageIndex * pageSize, pageSize * (pageIndex + 1));
      books = data;
      count = _count;
    } else {
      const { data, count: _count } = await supabase
        .from("books")
        .select(
          "id, title, author, isbn, genre, publisher, ddc, edition, language, year, pages",
          { count: "exact" }
        )
        .range(pageIndex * pageSize, pageSize * (pageIndex + 1));
      books = data;
      count = _count;
    }

    books = books
      ? books.map((v) => {
          const n_id = (
            <Link
              href={`/dashboard/books/${v.id}`}
              className="hover:underline hover:text-primary-700"
            >
              {v.id}
            </Link>
          );
          // Fixme: id does not expect a React.Node
          v.id = n_id as any;
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
    <NovellaDataTableFixed<IBook>
      columns={columnsObj}
      tanStackColumns={tanstackColumns}
      fetchData={getBooksByPage}
    />
  );
}
