"use client";
import { useState } from "react";
import NDataTableFixed, {
  NDataTableFixedFetchFunctionProps,
} from "@/components/NDataTableFixed";
import { IIssuedBookV2 } from "./lib/types";
import { Table, createColumnHelper } from "@tanstack/react-table";
import IssueBookDrawer from "./components/IssueBookDrawer";
import NDeleteModal from "@/components/NDeleteModal";
import { trpc } from "@/app/_trpc/client";
import ReturnBookModal from "./components/ReturnBookModal";
import { format } from "date-fns";
import { Anchor, Badge, Button } from "@mantine/core";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import { Toast } from "@/components/Toast";

type DuedateStatusBadgeProps = {
  days: number;
};
function DuedateStatusBadge({ days }: DuedateStatusBadgeProps) {
  const absDays = Math.abs(days);
  if (days < 0)
    return <Badge variant="light" color="red">{`Overdue (${absDays})`}</Badge>;
  else if (days < 1)
    return (
      <Badge variant="light" color="yellow">{`To be due (${absDays})`}</Badge>
    );
  else if (days > 1)
    return (
      <Badge variant="light" color="green">{`Not due (${absDays})`}</Badge>
    );
}

export default function Issued() {
  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [isReturnBookModalOpen, setIsReturnBookModalOpen] = useState(false);
  const [returnBookIDs, setReturnBookIDs] = useState<Array<number>>([]);
  const [selectedRows, setSelectedRows] = useState<IIssuedBookV2[]>();
  const issuedBooksColHelper = createColumnHelper<IIssuedBookV2>();
  const [deletedBooks, setDeletedBooks] = useState<IIssuedBookV2[]>([]);
  const [tanstackTableRef, setTanstackTableRef] =
    useState<Table<IIssuedBookV2> | null>(null);
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

  type issueBooksTableDef = {
    id: any;
    header: string;
    type: "string" | "date" | "link" | "return" | "status";
    href?: string;
  };

  const issuedBooksTableCols: issueBooksTableDef[] = [
    { id: "id", header: "ID", type: "string" },
    { id: "created_at", header: "Issued Date", type: "date" },
    { id: "book_id", header: "Book ID", type: "link", href: "/books" },
    { id: "title", header: "Title", type: "string" },
    { id: "student_id", header: "Student ID", type: "link", href: "/students" },
    { id: "name", header: "Student Name", type: "string" },
    { id: "due_date", header: "Due Date", type: "date" },
    { id: "action", header: "Return", type: "return" },
    { id: "due_status", header: "Status", type: "status" },
  ];

  const issuedBooksTableColsTanstack = issuedBooksTableCols.map((column) => {
    switch (column.type) {
      case "string":
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => cell.getValue(),
          header: column.header,
        });
      case "date":
        return issuedBooksColHelper.accessor(column.id, {
          header: column.header,
          cell: (cell) => format(new Date(cell.getValue()), "dd-MM-yyyy hh:mm"),
        });
      case "link":
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => (
            <Anchor
              size="sm"
              underline="always"
              c="blue.1"
              href={`${column.href}/${cell.getValue()}`}
            >
              {cell.getValue()}
            </Anchor>
          ),
          header: column.header,
        });
      case "return":
        return issuedBooksColHelper.display({
          id: column.id,
          cell: (cell) => (
            <Anchor
              c="blue"
              size="sm"
              onClick={() => {
                setReturnBookIDs([
                  cell.row.getAllCells()[1].getValue() as number,
                ]);
                setIsReturnBookModalOpen(true);
              }}
            >
              Return
            </Anchor>
          ),
          header: column.header,
        });
      case "status":
        return issuedBooksColHelper.display({
          id: column.id,
          header: "Status",
          cell: (cell) => {
            const dueDate = cell.row.original.due_date;
            if (dueDate) {
              const diffDate =
                new Date(dueDate).getTime() - new Date().getTime();
              const inDays = Math.floor(diffDate / (1000 * 60 * 60 * 24));
              return <DuedateStatusBadge days={inDays} />;
            }
          },
        });
      default:
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => cell.getValue(),
          header: column.header,
        });
    }
  });

  return (
    <>
      <NDataTableFixed<IIssuedBookV2>
        primaryButtonTitle="Issue Book"
        columns={issuedBooksTableCols}
        tanStackColumns={issuedBooksTableColsTanstack}
        onCreateRowButtonPressed={() => setIsIssueBookDrawerOpen(true)}
        onRowSelectionChanged={(selectedRows, table) => {
          setSelectedRows(selectedRows);
          setTanstackTableRef(table);
        }}
        selectedToobarActions={
          <Button
            variant="light"
            onClick={() => {
              if (selectedRows) {
                const booksToReturn = selectedRows?.map((row) => row.id);
                setReturnBookIDs(booksToReturn);
                setIsReturnBookModalOpen(true);
                tanstackTableRef?.resetRowSelection();
              } else {
                Toast.Error({
                  title: "Coudld not return",
                  message:
                    "Make sure atleast one row is selected to be able to return",
                });
              }
            }}
            rightSection={<UnreturnedBookIcon size={16} />}
          >
            Return
          </Button>
        }
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
        onBookReturned={() => {
          getIssuedBooksByPageQuery.refetch();
        }}
        returnBookIDs={returnBookIDs}
      />
      <IssueBookDrawer
        onBookIssued={() => getIssuedBooksByPageQuery.refetch()}
        isIssueBookDrawerOpen={isIssueBookDrawerOpen}
        setIsIssueBookDrawerOpen={setIsIssueBookDrawerOpen}
      />
    </>
  );
}
