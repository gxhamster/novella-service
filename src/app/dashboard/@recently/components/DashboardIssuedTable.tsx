"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "../../../_trpc/client";
import {
  DataTable,
  DataTableContent,
  DataTableControls,
} from "@/components/DataTable";
import { Tables } from "@/supabase/types/types";

type TableCols = {
  id: string;
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
    id: "issued_date",
    header: "Issued Date",
    isDate: true,
  },
  {
    id: "due_date",
    header: "Due Date",
    isDate: true,
  },
];

type issuedTableDef = Tables<"issued_table_view">;

export default function DashboardIssuedTable({ issuedBooks }: any) {
  const columnHelper = createColumnHelper<issuedTableDef>();
  const tanstackCols = tableColumnsObj.map((col) => {
    return columnHelper.accessor(col.id as keyof issuedTableDef, {
      cell: (cell) => cell.getValue(),
      header: col.header,
    });
  });

  const getIssuedBookQuery = trpc.issued.getIssuedBooksByPage.useQuery({
    pageIndex: 0,
    pageSize: 10,
    filters: {},
  });

  return (
    <DataTable<issuedTableDef>
      isDataLoading={getIssuedBookQuery.isLoading}
      totalDataCount={getIssuedBookQuery.data?.count || 0}
      isDataRefetching={getIssuedBookQuery.isRefetching}
      columns={tanstackCols}
      data={getIssuedBookQuery.data?.data || []}
    >
      <DataTableContent />
      <DataTableControls />
    </DataTable>
  );
}
