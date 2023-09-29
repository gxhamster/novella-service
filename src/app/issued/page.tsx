"use client";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import NDataTableFixed, {
  NDataTableFixedFetchFunction,
  NDataTableFixedConvertToSupabaseFilters,
} from "@/components/NDataTableFixed";
import { Database, IBook, IIssuedBook, IStudent } from "@/types/supabase";
import NDrawer from "@/components/NDrawer";
import Link from "next/link";
import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import ButtonSecondary from "@/components/ButtonSecondary";

export default function Issued() {
  type IIssuedBookV2 = Pick<IBook, "title"> &
    Pick<IStudent, "name"> &
    IIssuedBook;
  const columnHelper = createColumnHelper<IIssuedBookV2>();
  const columnHelperBooks = createColumnHelper<IBook>();
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);

  const getBooksByPage: NDataTableFixedFetchFunction<IBook> = async ({
    pageIndex,
    pageSize,
    filters,
    sorts,
  }) => {
    const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
    const supabase = createClientComponentClient<Database>();

    let query = supabase.from("books").select("*", { count: "estimated" });
    if (filters.length > 0) query = query.or(supabaseFilters);
    if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
    query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count, error } = await query;

    if (error) throw new Error(error.message);

    return { data, count: count ? count : 0 };
  };

  const getIssuedBooksByPage: NDataTableFixedFetchFunction<
    IIssuedBookV2
  > = async ({ pageIndex, pageSize, filters, sorts }) => {
    const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
    const supabase = createClientComponentClient<Database>();

    let query = supabase
      .from("issued")
      .select("*, book_id, books (title), student_id, students (name)", {
        count: "estimated",
      });
    if (filters.length > 0) query = query.or(supabaseFilters);
    if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
    query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count, error } = await query;
    const flatData = data?.map((v) => {
      return { ...v, title: v.books?.title, name: v.students?.name };
    });

    if (error) throw new Error(error.message);

    return { data: flatData, count: count ? count : 0 };
  };

  const columnsObj: Array<{
    id: keyof IIssuedBookV2;
    header: string;
    baseHref?: string;
  }> = [
    { id: "id", header: "ID" },
    { id: "created_at", header: "Issued Date" },
    { id: "book_id", header: "Book ID", baseHref: "/books" },
    { id: "title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/students" },
    { id: "name", header: "Student Name" },
    { id: "due_date", header: "Due Date" },
  ];

  const tanstackColumns = columnsObj.map((column) =>
    columnHelper.accessor(column.id, {
      cell: (info) =>
        column.baseHref ? (
          <Link
            className="hover:text-primary-700 hover:underline"
            href={`${column.baseHref}/${info.getValue()}`}
          >
            {info.getValue()}
          </Link>
        ) : (
          info.getValue()
        ),
      header: column.header,
    })
  );

  const columnsObjBooks: Array<{
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

  const tanstackColumnsBooks = columnsObjBooks.map((column) =>
    columnHelperBooks.accessor(column.id, {
      cell: (info) => info.getValue(),
      header: column.header,
    })
  );

  return (
    <>
      <NDrawer
        title="Issue book to student"
        isOpen={isIssueBookDrawerOpen}
        closeDrawer={() =>
          !isAddBookDrawerOpen && setIsIssueBookDrawerOpen(false)
        }
      >
        <div className="h-full flex flex-col items-center">
          <section className="relative overflow-hidden flex-grow p-6">
            <ButtonSecondary
              title="Get Book"
              onClick={() => setIsAddBookDrawerOpen(true)}
            />
            <pre>{JSON.stringify(selectedBook, null, 2)}</pre>
          </section>
        </div>
      </NDrawer>

      <NDrawer
        title="Select a book to issue"
        isOpen={isAddBookDrawerOpen}
        closeDrawer={() => setIsAddBookDrawerOpen(false)}
      >
        <NDataTableFixedSmall<IBook>
          columns={columnsObjBooks}
          tanStackColumns={tanstackColumnsBooks}
          onRowSelectionChanged={(state) => {
            state && setIsAddBookDrawerOpen(false);
            setSelectedBook(state);
          }}
          fetchData={getBooksByPage}
        />
      </NDrawer>
      <NDataTableFixed<IIssuedBookV2>
        columns={columnsObj}
        tanStackColumns={tanstackColumns}
        onCreateRowButtonPressed={() => setIsIssueBookDrawerOpen(true)}
        onRowSelectionChanged={(state) => console.log(state)}
        fetchData={getIssuedBooksByPage}
      />
    </>
  );
}
