"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { IssuedBooksResult } from "@/supabase/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";

export default function DashboardIssuedTable({ issuedBooks }: any) {
  const getIssuedBooks = async () => {
    const supabase = createClientComponentClient<Database>();
    let { data: issued, error } = await supabase
      .from("issued")
      .select("id, created_at, due_date, students(name), books(title)");

    const issuedBooks = issued?.map((books) => {
      const newObj = {
        id: books.id,
        student_name: books?.students?.name,
        title: books?.books?.title,
        issue_date: books.created_at,
        due_date: books.due_date,
      } as IssuedBooksResult;

      return newObj;
    });

    const { data, count } = await supabase
      .from("issued")
      .select("*", { head: true, count: "exact" });

    return { data: issuedBooks, count };
  };
  const columnHelper = createColumnHelper<IssuedBooksResult>();
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "ID",
    }),
    columnHelper.accessor("student_name", {
      cell: (info) => info.getValue(),
      header: "Student",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Title",
    }),
    columnHelper.accessor("issue_date", {
      cell: (info) => new Date(info.getValue()).toDateString(),
      header: "Issued Date",
    }),
    columnHelper.accessor("due_date", {
      cell: (info) => new Date(info.getValue()).toDateString(),
      header: "Due Date",
    }),
  ];
  return (
    <NovellaDataTable<IssuedBooksResult>
      columns={columns}
      fetchData={getIssuedBooks}
    />
  );
}
