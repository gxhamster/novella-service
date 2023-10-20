"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";

type IssuedBookDef = {
  id: number;
  student_name: string;
  title: string;
  issue_date: string;
  due_date: string;
};

export default function DashboardIssuedTable({ issuedBooks }: any) {
  const getIssuedBooks = async () => {
    const supabase = createClientComponentClient<Database>();
    let { data: issued } = await supabase
      .from("issued")
      .select("id, created_at, due_date, students(name), books(title)");

    if (issued) {
      const issuedBooks: IssuedBookDef[] = issued?.map((books) => {
        const newObj = {
          id: books.id,
          student_name: books.students?.name ? books.students.name : "",
          title: books?.books?.title ? books.books.title : "",
          issue_date: books.created_at,
          due_date: books.due_date ? books.due_date : "",
        };

        return newObj;
      });

      const { count } = await supabase
        .from("issued")
        .select("*", { head: true, count: "exact" });

      return { data: issuedBooks, count: count ? count : 0 };
    } else {
      return { data: [], count: 0 };
    }
  };
  const columnHelper = createColumnHelper<IssuedBookDef>();
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
    <NovellaDataTable<IssuedBookDef>
      columns={columns}
      fetchData={getIssuedBooks}
    />
  );
}
