"use client";
import { useState } from "react";
import NDataTableFixed, {
  NDataTableFixedFetchFunctionProps,
} from "@/components/NDataTableFixed";
import NButton from "@/components/NButton";
import { IIssuedBookV2 } from "./lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IssuedBooksTableColumnDef } from "./lib/types";
import Link from "next/link";
import IssueBookDrawer from "./components/IssueBookDrawer";
import NDeleteModal from "@/components/NDeleteModal";
import { trpc } from "@/app/_trpc/client";
import ReturnBookModal from "./components/ReturnBookModal";
import { format } from "date-fns";

export default function Issued() {
  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [isReturnBookModalOpen, setIsReturnBookModalOpen] = useState(false);
  const [returnBookID, setReturnBookID] = useState<number | null>(null);
  const issuedBooksColHelper = createColumnHelper<IIssuedBookV2>();
  const [deletedBooks, setDeletedBooks] = useState<IIssuedBookV2[]>([]);
  const [isIssueBookDeleteModalOpen, setIsIssueBookDeleteModalOpen] =
    useState(false);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    NDataTableFixedFetchFunctionProps<IIssuedBookV2>
  >({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: null,
  });

  const getIssuedBooksByPageQuery =
    trpc.issued.getIssuedBooksByPage.useQuery(fetchFunctionOpts);

  const deleteIssuedBooksQuery = trpc.issued.deleteIssuedBooksById.useMutation({
    onError: (_error) => {
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSuccess: () => {
      setIsIssueBookDeleteModalOpen(false);
      getIssuedBooksByPageQuery.refetch();
    },
  });

  const deleteIssuedBooks = async () => {
    const ids = deletedBooks?.map((rows) => rows.id);
    deleteIssuedBooksQuery.mutate(ids);
  };

  const issuedBooksTableCols: Array<IssuedBooksTableColumnDef> = [
    { id: "id", header: "ID" },
    { id: "created_at", header: "Issued Date", isDate: true },
    { id: "book_id", header: "Book ID", baseHref: "/dashboard/books" },
    { id: "title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/dashboard/students" },
    { id: "name", header: "Student Name" },
    { id: "due_date", header: "Due Date", isDate: true },
    { id: "action", header: "Recieve", isDisplayColumn: true },
  ];

  const issuedBooksTableColsTanstack = issuedBooksTableCols.map((column) => {
    if (column.isDisplayColumn)
      return issuedBooksColHelper.display({
        id: column.id,
        cell: (cell) => (
          <button
            title="Return"
            className="text-sm appearance-none  text-primary-600 hover:text-primary-700 hover:underline"
            onClick={() => {
              setReturnBookID(cell.row.getAllCells()[1].getValue() as number);
              setIsReturnBookModalOpen(true);
            }}
          >
            Return
          </button>
        ),
        header: "Return",
      });
    else if (column.baseHref)
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
      <NDataTableFixed<IIssuedBookV2>
        columns={issuedBooksTableCols}
        tanStackColumns={issuedBooksTableColsTanstack}
        onCreateRowButtonPressed={() => setIsIssueBookDrawerOpen(true)}
        onRowSelectionChanged={(state) => console.log(state)}
        isDataLoading={
          getIssuedBooksByPageQuery.isLoading ||
          getIssuedBooksByPageQuery.isRefetching
        }
        onRowDeleted={(deletedBooks) => {
          setDeletedBooks(deletedBooks);
          setIsIssueBookDeleteModalOpen(true);
        }}
        data={
          getIssuedBooksByPageQuery.data
            ? getIssuedBooksByPageQuery.data.data
            : []
        }
        dataCount={
          getIssuedBooksByPageQuery.data
            ? getIssuedBooksByPageQuery.data.count
            : 0
        }
        onRefresh={() => getIssuedBooksByPageQuery.refetch()}
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
      />
      {/* Delete Issued book Modal */}
      <NDeleteModal
        isOpen={isIssueBookDeleteModalOpen}
        closeModal={() => setIsIssueBookDeleteModalOpen(false)}
        isDeleting={deleteIssuedBooksQuery.isLoading}
        onDelete={deleteIssuedBooks}
      />
      <ReturnBookModal
        isReturnBookModalOpen={isReturnBookModalOpen}
        setIsReturnBookModalOpen={setIsReturnBookModalOpen}
        onBookReturned={() => getIssuedBooksByPageQuery.refetch()}
        returnBookID={returnBookID}
      />
      <IssueBookDrawer
        onBookIssued={() => getIssuedBooksByPageQuery.refetch()}
        isIssueBookDrawerOpen={isIssueBookDrawerOpen}
        setIsIssueBookDrawerOpen={setIsIssueBookDrawerOpen}
      />
    </>
  );
}
