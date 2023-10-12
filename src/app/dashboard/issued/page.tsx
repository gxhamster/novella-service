"use client";
import { useState } from "react";
import NDataTableFixed from "@/components/NDataTableFixed";
import NButton from "@/components/NButton";
import NModal from "@/components/NModal";
import { IIssuedBookV2 } from "./lib/types";
import { getIssuedBooksByPage } from "../../api/issued/client";
import { createColumnHelper } from "@tanstack/react-table";
import { IssuedBooksTableColumnDef } from "./lib/types";
import Link from "next/link";
import IssueBookDrawer from "./components/IssueBookDrawer";
import { NAlertProvider } from "@/components/NAlert";

export default function Issued() {
  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [isReturnBookModalOpen, setIsReturnBookModalOpen] = useState(false);
  const [returnBookID, setReturnBookID] = useState<number>();
  const issuedBooksColHelper = createColumnHelper<IIssuedBookV2>();
  const [deletedBooks, setDeletedBooks] = useState<IIssuedBookV2[] | null>(
    null
  );
  const [isIssueBookDeleteModalOpen, setIsIssueBookDeleteModalOpen] =
    useState(false);

  const issuedBooksTableCols: Array<IssuedBooksTableColumnDef> = [
    { id: "id", header: "ID" },
    { id: "created_at", header: "Issued Date" },
    { id: "book_id", header: "Book ID", baseHref: "/dashboard/books" },
    { id: "title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/dashboard/students" },
    { id: "name", header: "Student Name" },
    { id: "due_date", header: "Due Date" },
    { id: "action", header: "Recieve", isDisplayColumn: true },
  ];

  const issuedBooksTableColsTanstack = issuedBooksTableCols.map((column) => {
    if (column.isDisplayColumn)
      return issuedBooksColHelper.display({
        id: column.id,
        cell: (cell) => (
          <NButton
            title="Return"
            kind="ghost"
            size="xs"
            onClick={() => {
              console.log(cell.row.getAllCells());
              setReturnBookID(cell.row.getAllCells()[1].getValue() as number);
              setIsReturnBookModalOpen(true);
            }}
          />
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
    else
      return issuedBooksColHelper.accessor(column.id, {
        cell: (cell) => cell.getValue(),
        header: column.header,
      });
  });

  return (
    <>
      <NAlertProvider>
        <NDataTableFixed<IIssuedBookV2>
          columns={issuedBooksTableCols}
          tanStackColumns={issuedBooksTableColsTanstack}
          onCreateRowButtonPressed={() => setIsIssueBookDrawerOpen(true)}
          onRowSelectionChanged={(state) => console.log(state)}
          onRowDeleted={(deletedBooks) => {
            setDeletedBooks(deletedBooks);
            setIsIssueBookDeleteModalOpen(true);
          }}
          fetchData={getIssuedBooksByPage}
        />
        {/* Delete Issued book Modal */}
        <NModal
          isOpen={isIssueBookDeleteModalOpen}
          title="Confirm to delete"
          onModalClose={() => setIsIssueBookDeleteModalOpen(false)}
        >
          <section className="p-4">
            <p className="text-sm text-surface-700">
              Are you sure you want to delete the selected rows?
            </p>
            <p className="text-sm text-surface-700">
              This action cannot be undone
            </p>
          </section>
          <section className="flex gap-2 justify-end py-3 border-t-[1px] border-surface-300 px-3">
            <NButton
              kind="secondary"
              title="Cancel"
              onClick={() => setIsIssueBookDeleteModalOpen(false)}
            />
            <NButton
              kind="alert"
              title="Delete"
              onClick={async () => {
                const ids = deletedBooks?.map((rows) => rows.id);
                const { error } = await fetch("/api/issued", {
                  method: "DELETE",
                  body: JSON.stringify({ ids }),
                }).then((response) => response.json());
                if (error) throw new Error(error.message);
                setIsIssueBookDeleteModalOpen(false);
              }}
            />
          </section>
        </NModal>
        {/* Return Book Modal */}
        <NModal
          title="Return the issued book"
          isOpen={isReturnBookModalOpen}
          onModalClose={() => setIsReturnBookModalOpen(false)}
        >
          <form>
            <section className="text-surface-700 p-6">
              <p className="text-sm">
                Do you want to return the book from the student to the library ?
              </p>
            </section>
            <section className="flex gap-2 border-t-[1px] border-surface-300 p-2 justify-end">
              <NButton
                kind="secondary"
                size="sm"
                title="Cancel"
                onClick={(e) => {
                  e.preventDefault();
                  setIsReturnBookModalOpen(false);
                }}
              />
              <NButton
                kind="primary"
                size="sm"
                title="Return"
                onClick={async (e) => {
                  e.preventDefault();
                  // Retrieve Issued Book Details before deleting
                  const { data: issuedBook, error: issuedBookError } =
                    await fetch(`/api/issued?id=${returnBookID}`).then((res) =>
                      res.json()
                    );
                  // First Delete book from Issued Table
                  const { error } = await fetch(
                    `/api/issued?id=${returnBookID}`,
                    {
                      method: "DELETE",
                      body: JSON.stringify({ ids: [returnBookID] }),
                    }
                  ).then((res) => res.json());

                  // Add Issue Detail to History Table
                  const historyBookRecord = {
                    book_id: issuedBook.book_id,
                    student_id: issuedBook.student_id,
                    due_date: issuedBook.due_date,
                    issued_date: issuedBook.created_at,
                    returned_date: new Date().toISOString(),
                  };
                  const { data: historyBook, error: historyBookError } =
                    await fetch(`/api/issued/history`, {
                      method: "POST",
                      body: JSON.stringify(historyBookRecord),
                    }).then((res) => res.json());

                  if (error || issuedBookError || historyBookError)
                    throw new Error(error.message);

                  setIsReturnBookModalOpen(false);
                }}
              />
            </section>
          </form>
        </NModal>
        <IssueBookDrawer
          isIssueBookDrawerOpen={isIssueBookDrawerOpen}
          setIsIssueBookDrawerOpen={setIsIssueBookDrawerOpen}
        />
      </NAlertProvider>
    </>
  );
}
