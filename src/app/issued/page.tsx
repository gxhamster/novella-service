"use client";
import { useForm, useWatch } from "react-hook-form";
import { useMemo, useState } from "react";
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
import NovellaInput from "@/components/NovellaInput";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import NButton from "@/components/NButton";

export default function Issued() {
  type IIssuedBookV2 = Pick<IBook, "title"> &
    Pick<IStudent, "name"> &
    IIssuedBook;
  const columnHelper = createColumnHelper<IIssuedBookV2>();
  const columnHelperBooks = createColumnHelper<IBook>();
  const columnHelperStudents = createColumnHelper<IStudent>();
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [isAddStudentDrawerOpen, setIsAddStudentDrawerOpen] = useState(false);
  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IIssuedBook>({
    defaultValues: {
      created_at: new Date().toISOString(),
      student_id: useMemo(() => selectedStudent?.id, [selectedStudent]),
      book_id: useMemo(() => selectedBook?.id, [selectedBook]),
      due_date: useMemo(() => {
        const days = 5;
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
      }, []),
    },
  });

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

  const getStudentsByPage: NDataTableFixedFetchFunction<IStudent> = async ({
    pageIndex,
    pageSize,
    filters,
    sorts,
  }) => {
    const supabaseFilters = NDataTableFixedConvertToSupabaseFilters(filters);
    const supabase = createClientComponentClient<Database>();

    let query = supabase.from("students").select("*", { count: "estimated" });
    if (filters.length > 0) query = query.or(supabaseFilters);
    if (sorts) query = query.order(sorts.field, { ascending: sorts.ascending });
    query = query.range(pageIndex * pageSize, pageSize * (pageIndex + 1));
    const { data, count, error } = await query;

    if (error) throw new Error(error.message);

    return { data, count: count ? count : 0 };
  };

  function issueBookFormSubmitHandler(formData: IIssuedBook) {
    const postToSupbase = async () => {
      const { data, error } = await fetch("/api/issued", {
        method: "POST",
        body: JSON.stringify(formData),
      }).then((response) => response.json());

      if (error) throw new Error(error.message);
    };
    postToSupbase();
  }

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

  const columnsObjStudents: Array<{
    id: keyof IStudent;
    header: string;
  }> = [
    { id: "id", header: "ID" },
    { id: "name", header: "Name" },
    { id: "island", header: "Island" },
    { id: "address", header: "Address" },
    { id: "phone", header: "Phone" },
    { id: "grade", header: "Grade" },
    { id: "index", header: "Index" },
  ];

  const tanstackColumnsStudents = columnsObjStudents.map((column) =>
    columnHelperStudents.accessor(column.id, {
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
          !isAddBookDrawerOpen &&
          !isAddStudentDrawerOpen &&
          setIsIssueBookDrawerOpen(false)
        }
      >
        <form
          onSubmit={handleSubmit(issueBookFormSubmitHandler)}
          className="h-full flex flex-col items-center overflow-y-auto"
        >
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <NovellaInput
              title="ID"
              disabled
              helpText="Issue ID will be assigned by the system"
              labelDirection="horizontal"
              reactHookRegister={register("id")}
              reactHookErrorMessage={errors["id"]}
            />
            <NovellaInput
              title="Issued Date"
              helpText="The current time will be used if not date is given"
              labelDirection="horizontal"
              reactHookRegister={register("created_at", {
                required: "Issue date is required",
              })}
              reactHookErrorMessage={errors["created_at"]}
            />
            <NovellaInput
              title="Due Date"
              helpText="The date 5 days from now will be used by default"
              labelDirection="horizontal"
              reactHookRegister={register("due_date", {
                required: "Due date is required",
              })}
              reactHookErrorMessage={errors["due_date"]}
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <h3 className="text-md text-surface-800">Book Fields</h3>
            <NovellaInput
              title="Book ID"
              readOnly
              helpText="This will be the book that is issued. Select from the table"
              labelDirection="horizontal"
              reactHookRegister={register("book_id", {
                valueAsNumber: true,
                required: "A book needs to be selected",
              })}
              reactHookErrorMessage={errors["book_id"]}
              suffixContent={
                <NButton
                  kind="secondary"
                  size="xs"
                  title="Select book"
                  icon={<LeftArrowIcon size={10} />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddBookDrawerOpen(true);
                  }}
                />
              }
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <h3 className="text-md text-surface-800">Student Fields</h3>
            <NovellaInput
              title="Student ID"
              readOnly
              helpText="This will be the student the book is issued to. Select from the table"
              labelDirection="horizontal"
              reactHookRegister={register("student_id", {
                valueAsNumber: true,
                required: "A student needs to be selected",
              })}
              reactHookErrorMessage={errors["student_id"]}
              suffixContent={
                <NButton
                  kind="secondary"
                  size="xs"
                  title="Select student"
                  icon={<LeftArrowIcon size={10} />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddStudentDrawerOpen(true);
                  }}
                />
              }
            />
          </section>
          <section className="flex justify-end gap-3 p-3 w-full border-b-[1px] border-surface-300">
            <NButton
              title="Cancel"
              kind="secondary"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            />
            <NButton title="Issue Book" kind="primary" />
          </section>
        </form>
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
            if (state) {
              setIsAddBookDrawerOpen(false);
              setSelectedBook(state);
              setValue("book_id", state.id);
            }
          }}
          fetchData={getBooksByPage}
        />
      </NDrawer>
      <NDrawer
        title="Select a student to issue to"
        isOpen={isAddStudentDrawerOpen}
        closeDrawer={() => setIsAddStudentDrawerOpen(false)}
      >
        <NDataTableFixedSmall<IStudent>
          columns={columnsObjStudents}
          tanStackColumns={tanstackColumnsStudents}
          onRowSelectionChanged={(state) => {
            if (state) {
              setIsAddStudentDrawerOpen(false);
              setSelectedStudent(state);
              setValue("student_id", state.id);
            }
          }}
          fetchData={getStudentsByPage}
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
