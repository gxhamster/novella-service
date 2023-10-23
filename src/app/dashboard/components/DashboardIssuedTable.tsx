"use client";
import NovellaDataTable from "@/components/NovellaDataTable";
import { IIssuedBook } from "@/supabase/types/supabase";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "../../_trpc/client";
import { format } from "date-fns";

type TableCols = {
  id: any;
  header: string;
  isDate?: boolean;
};

const tableColumnsObj: TableCols[] = [
  {
    id: "id",
    header: "ID",
  },
  {
    id: "name",
    header: "Name",
  },
  {
    id: "title",
    header: "Title",
  },
  {
    id: "created_at",
    header: "Issued Date",
    isDate: true,
  },
  {
    id: "due_date",
    header: "Due Date",
    isDate: true,
  },
];

export default function DashboardIssuedTable({ issuedBooks }: any) {
  const columnHelper = createColumnHelper<IIssuedBook>();
  const tanstackCols = tableColumnsObj.map((col) => {
    return columnHelper.accessor(col.id as keyof IIssuedBook, {
      cell: (cell) =>
        col.isDate
          ? format(new Date(cell.getValue() as string), "dd/MM/yyyy hh:mm")
          : cell.getValue(),
      header: col.header,
    });
  });

  const getIssuedBookQuery = trpc.issued.getIssuedBooksByPage.useQuery({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: { field: "id", ascending: true },
  });

  return (
    <NovellaDataTable<IIssuedBook>
      columns={tanstackCols}
      isDataLoading={getIssuedBookQuery.isLoading}
      isDataRefetching={getIssuedBookQuery.isRefetching}
      data={getIssuedBookQuery.data?.data}
    />
  );
}
