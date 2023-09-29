"use client";
import { useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, IBook } from "@/types/supabase";
import NDataTableFixed, {
  NDataTableFixedConvertToSupabaseFilters,
  NDataTableFixedFetchFunction,
} from "@/components/NDataTableFixed";
import {
  NDrawerCreateForm,
  NDrawerCreateFormFieldsType,
} from "@/components/NDrawer";

export default function BooksTable() {
  const columnHelper = createColumnHelper<IBook>();
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
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

  const bookFieldCategories: NDrawerCreateFormFieldsType<IBook>[] = [
    {
      title: "",
      fields: [
        {
          field: "id",
          title: "ID",
          help: "ID will be automatically set by the system",
          fieldType: "number",
          disabled: true,
        },
        {
          field: "created_at",
          title: "Created At",
          fieldType: "string",
          help: `Default value will be the time as of now ${new Date().toDateString()}`,
        },
        {
          field: "title",
          fieldType: "string",
          title: "Title",
        },
      ],
    },
    {
      title: "Publisher Fields",
      description:
        "These are fields that are related to the publisher of the book",
      fields: [
        {
          fieldType: "string",
          field: "publisher",
          title: "Publisher",
        },
        {
          fieldType: "string",
          field: "edition",
          title: "Edition",
        },
        {
          fieldType: "number",
          field: "year",
          title: "Year",
        },
      ],
    },
    {
      title: "Identification Fields",
      description: "These fields are used to identify the book",
      fields: [
        {
          fieldType: "string",
          field: "ddc",
          title: "DDC",
        },
        {
          fieldType: "number",
          field: "isbn",
          title: "ISBN",
        },
      ],
    },
    {
      title: "Misc Fields",
      fields: [
        {
          fieldType: "string",
          field: "author",
          title: "Author",
        },
        {
          fieldType: "string",
          field: "genre",
          title: "Genre",
        },
        {
          fieldType: "number",
          field: "pages",
          title: "Pages",
        },
      ],
    },
  ];

  return (
    <>
      <NDrawerCreateForm<IBook>
        title="Add new book to library"
        saveButtonLoadingState={saveButtonLoading}
        isOpen={isAddBookDrawerOpen}
        onFormSubmit={addBookToSupabase}
        closeDrawer={() => setIsAddBookDrawerOpen(false)}
        formFieldsCategories={bookFieldCategories}
        defaultValues={{
          year: new Date().getFullYear(),
          isbn: 0,
          pages: 0,
          created_at: String(new Date().toISOString()),
        }}
      />
      <NDataTableFixed<IBook>
        columns={columnsObj}
        tanStackColumns={tanstackColumns}
        onCreateRowButtonPressed={() => setIsAddBookDrawerOpen(true)}
        onRowSelectionChanged={(state) => console.log(state)}
        fetchData={getBooksByPage}
      />
    </>
  );
}
