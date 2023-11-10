"use client";
import { useState } from "react";
import NDataTableFixed from "@/components/NDataTableFixed";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import NDeleteModal from "@/components/NDeleteModal";
import { NDataTableFixedFetchFunctionProps } from "@/components/NDataTableFixed";
import { trpc } from "@/app/_trpc/client";
import { IHistory } from "@/supabase/types/supabase";
import { format } from "date-fns";
import NToast from "@/components/NToast";

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

  const deleteHistoryMutation = trpc.history.deleteHistoryByIds.useMutation({
    onError: (_error) => {
      NToast.error("Could not delete history", `${_error.message}`);
      throw new Error(_error.message);
    },
    onSuccess: () => {
      getHistoryByPageQuery.refetch();
      NToast.success("Successful", `Deleted the history`);
      setIsIssueBookDeleteModalOpen(false);
    },
  });

  type HistoryBooksTableDef = {
    id: any;
    header: string;
    baseHref?: string;
    isDate?: boolean;
  };

  const historyBooksTableCols: Array<HistoryBooksTableDef> = [
    { id: "id", header: "ID" },
    { id: "book_id", header: "Book ID", baseHref: "/books" },
    { id: "books.title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/students" },
    { id: "students.name", header: "Name" },
    { id: "issued_date", header: "Issued Date", isDate: true },
    { id: "due_date", header: "Due Date", isDate: true },
    { id: "returned_date", header: "Returned Date", isDate: true },
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
    else if (column.isDate)
      return issuedBooksColHelper.accessor(column.id, {
        header: column.header,
        cell: (cell) => format(new Date(cell.getValue()), "dd-MM-yyyy hh:mm"),
      });
    else
      return issuedBooksColHelper.accessor(column.id, {
        cell: (cell) => cell.getValue(),
        header: column.header,
      });
  });

  return (
    <>
      <NDataTableFixed<IHistory>
        columns={historyBooksTableCols}
        tanStackColumns={issuedBooksTableColsTanstack}
        showCreateButton={false}
        isDataLoading={
          getHistoryByPageQuery.isLoading || getHistoryByPageQuery.isRefetching
        }
        onRowSelectionChanged={(state) => console.log(state)}
        onRowDeleted={(deletedBooks) => {
          setDeletedBooks(deletedBooks);
          setIsIssueBookDeleteModalOpen(true);
        }}
        data={getHistoryByPageQuery.data ? getHistoryByPageQuery.data.data : []}
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
          if (ids) deleteHistoryMutation.mutate(ids);
        }}
      />
    </>
  );
}
