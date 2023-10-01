"use client";
import { useState } from "react";
import NDataTableFixed from "@/components/NDataTableFixed";
import NButton from "@/components/NButton";
import NModal from "@/components/NModal";
import { IIssuedBookV2 } from "./lib/types";
import { getIssuedBooksByPage } from "../api/issued/client";
import { createColumnHelper } from "@tanstack/react-table";
import { IssuedBooksTableColumnDef } from "./lib/types";
import Link from "next/link";
import IssueBookDrawer from "./components/IssueBookDrawer";

export default function Issued() {
  type ReturnBook = {
    id: string;
    value: any;
    header: string;
  };

  const [isIssueBookDrawerOpen, setIsIssueBookDrawerOpen] = useState(false);
  const [isReturnBookModalOpen, setIsReturnBookModalOpen] = useState(false);
  const [returnBook, setReturnBook] = useState<ReturnBook[]>([]);
  const issuedBooksColHelper = createColumnHelper<IIssuedBookV2>();
  const [deletedBooks, setDeletedBooks] = useState<IIssuedBookV2[] | null>(
    null
  );
  const [isIssueBookDeleteModalOpen, setIsIssueBookDeleteModalOpen] =
    useState(false);

  const issuedBooksTableCols: Array<IssuedBooksTableColumnDef> = [
    { id: "id", header: "ID" },
    { id: "created_at", header: "Issued Date" },
    { id: "book_id", header: "Book ID", baseHref: "/books" },
    { id: "title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/students" },
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
              setReturnBook([
                ...cell.row
                  .getAllCells()
                  .map((v) => ({
                    id: v.column.id,
                    value: v.getValue() as string,
                    header: v.column.columnDef.header as string,
                  }))
                  .filter((v) => v.value),
              ]);
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
            <NButton kind="secondary" size="sm" title="Cancel" />
            <NButton kind="primary" size="sm" title="Return" />
          </section>
        </form>
      </NModal>
      <IssueBookDrawer
        isIssueBookDrawerOpen={isIssueBookDrawerOpen}
        setIsIssueBookDrawerOpen={setIsIssueBookDrawerOpen}
      />
    </>
  );
}
