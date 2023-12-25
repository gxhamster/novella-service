"use client";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Table, createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import { Anchor, Badge, Button } from "@mantine/core";
import { Toast } from "@/components/Toast";
import {
  FixedTable,
  FixedTableToolbar,
  FixedTableContent,
  FixedTableEmptyContent,
  FixedTableControls,
  FixedTableFetchFunctionProps,
} from "@/components/FixedTable";
import { IssuedPageTableType } from "./lib/types";
import IssueBookDrawer from "./components/IssueBookDrawer";
import DeleteModal from "@/components/NDeleteModal";
import ReturnBookModal from "./components/ReturnBookModal";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";

type DuedateStatusBadgeProps = {
  days: number;
};
function DuedateStatusBadge({ days }: DuedateStatusBadgeProps) {
  const absDays = Math.abs(days);
  if (days < 0)
    return <Badge variant="light" color="red">{`Overdue (${absDays})`}</Badge>;
  else if (days <= 1)
    return (
      <Badge variant="light" color="yellow">{`To be due (${absDays})`}</Badge>
    );
  else if (days > 1)
    return (
      <Badge variant="light" color="green">{`Not due (${absDays})`}</Badge>
    );
}

export default function Issued() {
  const [issueDrawerOpen, issueDrawerHandlers] = useDisclosure(false);
  const [returnModalOpen, returnModalHandlers] = useDisclosure(false);
  const [issueDeleteModalOpen, issueDeleteModalHandlers] = useDisclosure(false);
  const [returnBookIDs, setReturnBookIDs] = useState<Array<number>>([]);
  const [selectedRows, setSelectedRows] = useState<IssuedPageTableType[]>();
  const issuedBooksColHelper = createColumnHelper<IssuedPageTableType>();
  const [deletedBooks, setDeletedBooks] = useState<IssuedPageTableType[]>([]);
  const [tanstackTableRef, setTanstackTableRef] =
    useState<Table<IssuedPageTableType> | null>(null);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    FixedTableFetchFunctionProps<IssuedPageTableType>
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
      issueDeleteModalHandlers.close();
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
                returnModalHandlers.open();
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

  function TableToolbarReturn() {
    return (
      <Button
        size="xs"
        variant="filled"
        onClick={() => {
          if (selectedRows) {
            const booksToReturn = selectedRows?.map((row) => row.id);
            setReturnBookIDs(booksToReturn);
            returnModalHandlers.open();
            tanstackTableRef?.resetRowSelection();
          } else {
            Toast.Error({
              title: "Could not return",
              message:
                "Make sure atleast one row is selected to be able to return",
            });
          }
        }}
        rightSection={<UnreturnedBookIcon size={16} />}
      >
        Return
      </Button>
    );
  }

  return (
    <>
      <FixedTable<IssuedPageTableType>
        data={getIssuedBooksByPageQuery.data?.data || []}
        onPaginationChanged={(options) => setFetchFunctionOpts(options)}
        dataCount={getIssuedBooksByPageQuery.data?.count || 0}
        tanStackColumns={issuedBooksTableColsTanstack}
        onRowSelectionChanged={(selectedRows, table) => {
          setSelectedRows(selectedRows);
          setTanstackTableRef(table);
        }}
      >
        <FixedTableToolbar<IssuedPageTableType>
          primaryActionTitle="Issue book"
          selectedToobarActions={<TableToolbarReturn />}
          columns={issuedBooksTableCols}
          primaryAction={issueDrawerHandlers.open}
          onRefresh={getIssuedBooksByPageQuery.refetch}
          onRowDeleted={(deletedBooks) => {
            setDeletedBooks(deletedBooks);
            issueDeleteModalHandlers.open();
          }}
          isDataLoading={
            getIssuedBooksByPageQuery.isLoading ||
            getIssuedBooksByPageQuery.isRefetching
          }
        />
        <FixedTableContent />
        <FixedTableEmptyContent />
        <FixedTableControls loading={getIssuedBooksByPageQuery.isLoading} />
      </FixedTable>

      {/* Delete Issued book Modal */}
      <DeleteModal
        isOpen={issueDeleteModalOpen}
        closeModal={issueDeleteModalHandlers.close}
        isDeleting={deleteIssuedBooksQuery.isLoading}
        onDelete={deleteIssuedBooks}
      />
      <ReturnBookModal
        isReturnBookModalOpen={returnModalOpen}
        closeReturnModal={returnModalHandlers.close}
        onBookReturned={() => getIssuedBooksByPageQuery.refetch()}
        returnBookIDs={returnBookIDs}
      />
      <IssueBookDrawer
        onBookIssued={getIssuedBooksByPageQuery.refetch}
        isIssueBookDrawerOpen={issueDrawerOpen}
        closeIssueDrawer={issueDrawerHandlers.close}
      />
    </>
  );
}
