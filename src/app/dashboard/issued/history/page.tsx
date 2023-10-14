"use client";
import { useState } from "react";
import NDataTableFixed from "@/components/NDataTableFixed";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { NAlertProvider } from "@/components/NAlert";
import NDeleteModal from "@/components/NDeleteModal";
import { NDataTableFixedFetchFunctionProps } from "@/components/NDataTableFixed";
import { trpc } from "@/app/_trpc/client";
import { IHistory } from "@/supabase/types/supabase";

export default function Issued() {
  const issuedBooksColHelper = createColumnHelper<IHistory>();
  const [deletedBooks, setDeletedBooks] = useState<IHistory[] | null>(null);
  const [isIssueBookDeleteModalOpen, setIsIssueBookDeleteModalOpen] =
    useState(false);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    NDataTableFixedFetchFunctionProps<IHistory>
  >({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: null,
  });
  const getHistoryByPageQuery =
    trpc.history.getHistoryByPage.useQuery(fetchFunctionOpts);

  type HistoryBooksTableDef = {
    id: any;
    header: string;
    baseHref?: string;
  };

  const historyBooksTableCols: Array<HistoryBooksTableDef> = [
    { id: "id", header: "ID" },
    { id: "book_id", header: "Book ID", baseHref: "/dashboard/books" },
    { id: "student_id", header: "Student ID", baseHref: "/dashboard/students" },
    { id: "issued_date", header: "Issued Date" },
    { id: "due_date", header: "Due Date" },
    { id: "returned_date", header: "Returned Date" },
  ];

  const issuedBooksTableColsTanstack = historyBooksTableCols.map((column) => {
    if (column.baseHref)
      return issuedBooksColHelper.accessor(column.id, {
        cell: (cell) => (
          <Link
            className="hover:text-primary-700 hover:underline"
            href={`${column.baseHref}/${cell.getValue()}`}
          >
            {cell.getValue()}
          </Link>
        ),
        header: column.header,
      });
    else
      return issuedBooksColHelper.accessor(column.id, {
        cell: (cell) => cell.getValue(),
        header: column.header,
      });
  });

  return (
    <>
      <NAlertProvider>
        <NDataTableFixed<IHistory>
          columns={historyBooksTableCols}
          tanStackColumns={issuedBooksTableColsTanstack}
          showCreateButton={false}
          isDataLoading={
            getHistoryByPageQuery.isLoading ||
            getHistoryByPageQuery.isRefetching
          }
          onRowSelectionChanged={(state) => console.log(state)}
          onRowDeleted={(deletedBooks) => {
            setDeletedBooks(deletedBooks);
            setIsIssueBookDeleteModalOpen(true);
          }}
          data={
            getHistoryByPageQuery.data ? getHistoryByPageQuery.data.data : []
          }
          dataCount={
            getHistoryByPageQuery.data ? getHistoryByPageQuery.data.count : 0
          }
          onRefresh={() => getHistoryByPageQuery.refetch()}
          onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        />
        {/* Delete Issued book Modal */}
        <NDeleteModal
          isOpen={isIssueBookDeleteModalOpen}
          closeModal={() => setIsIssueBookDeleteModalOpen(false)}
          onDelete={async () => {
            const ids = deletedBooks?.map((rows) => rows.id);
            const { error } = await fetch("/api/issued/history", {
              method: "DELETE",
              body: JSON.stringify({ ids }),
            }).then((response) => response.json());
            if (error) throw new Error(error.message);
            setIsIssueBookDeleteModalOpen(false);
          }}
        />
      </NAlertProvider>
    </>
  );
}
