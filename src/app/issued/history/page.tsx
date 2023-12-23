"use client";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { IHistory } from "@/supabase/types/supabase";
import { format } from "date-fns";
import { Toast } from "@/components/Toast";
import { Tables } from "@/supabase/types/types";
import {
  FixedTable,
  FixedTableContent,
  FixedTableControls,
  FixedTableEmptyContent,
  FixedTableFetchFunctionProps,
  FixedTableToolbar,
} from "@/components/FixedTable";
import { useDisclosure } from "@mantine/hooks";
import DeleteModal from "@/components/NDeleteModal";

type historyTableDef = Tables<"history">;

export default function Issued() {
  const issuedBooksColHelper = createColumnHelper<IHistory>();
  const [deletedBooks, setDeletedBooks] = useState<IHistory[] | null>(null);
  const [issueBookDeleteModalOpen, issueBookDeleteModalHandler] =
    useDisclosure(false);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    FixedTableFetchFunctionProps<IHistory>
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
      Toast.Error({
        title: "Could not delete history",
        message: _error.message,
      });
      throw new Error(_error.message);
    },
    onSuccess: () => {
      getHistoryByPageQuery.refetch();
      Toast.Successful({
        title: "Successful",
        message: "Deleted the history",
      });
      issueBookDeleteModalHandler.close();
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
      <FixedTable<historyTableDef>
        tanStackColumns={issuedBooksTableColsTanstack}
        data={getHistoryByPageQuery.data?.data || []}
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        dataCount={getHistoryByPageQuery.data?.count || 0}
      >
        <FixedTableToolbar<historyTableDef>
          onRefresh={getHistoryByPageQuery.refetch}
          activePrimaryAction={false}
          primaryAction={() => null}
          columns={historyBooksTableCols}
          isDataLoading={
            getHistoryByPageQuery.isLoading ||
            getHistoryByPageQuery.isRefetching
          }
          onRowDeleted={(deletedRows) => {
            setDeletedBooks(deletedRows);
            issueBookDeleteModalHandler.open();
          }}
        />
        <FixedTableContent />
        <FixedTableEmptyContent />
        <FixedTableControls loading={getHistoryByPageQuery.isLoading} />
      </FixedTable>

      <DeleteModal
        isOpen={issueBookDeleteModalOpen}
        closeModal={issueBookDeleteModalHandler.close}
        isDeleting={deleteHistoryMutation.isLoading}
        onDelete={async () => {
          const ids = deletedBooks?.map((rows) => rows.id);
          if (ids) deleteHistoryMutation.mutate(ids);
        }}
      />
    </>
  );
}
