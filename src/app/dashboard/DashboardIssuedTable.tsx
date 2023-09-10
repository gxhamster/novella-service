// "use client";
// import NovellaDataTable from "@/components/NovellaDataTable";
// import { createColumnHelper } from "@tanstack/react-table";
// import { IssuedBooksResult } from "@/supabase/db";
// import { useState } from "react";

// export default function DashboardIssuedTable({ issuedBooks }: any) {
//   const columnHelper = createColumnHelper<IssuedBooksResult>();
//   const columns = [
//     columnHelper.accessor("id", {
//       cell: (info) => info.getValue(),
//       header: "ID",
//     }),
//     columnHelper.accessor("student_name", {
//       cell: (info) => info.getValue(),
//       header: "Student",
//     }),
//     columnHelper.accessor("title", {
//       cell: (info) => info.getValue(),
//       header: "Title",
//     }),
//     columnHelper.accessor("issue_date", {
//       cell: (info) => info.getValue(),
//       header: "Issued Date",
//     }),
//     columnHelper.accessor("due_date", {
//       cell: (info) => info.getValue(),
//       header: "Due Date",
//     }),
//   ];
//   return <NovellaDataTable columns={columns} />;
// }
