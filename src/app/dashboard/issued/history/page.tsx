"use client";
import { useState } from "react";
import NDataTableFixed from "@/components/NDataTableFixed";
import NButton from "@/components/NButton";
import NModal from "@/components/NModal";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { NAlertProvider } from "@/components/NAlert";
import { IHistory } from "@/supabase/types/supabase";
import { getHistoryByPage } from "@/app/api/issued/history/client";

export default function Issued() {
  const issuedBooksColHelper = createColumnHelper<IHistory>();
  const [deletedBooks, setDeletedBooks] = useState<IHistory[] | null>(null);
  const [isIssueBookDeleteModalOpen, setIsIssueBookDeleteModalOpen] =
    useState(false);

  type HistoryBooksTableDef = {
    id: any;
    header: string;
    baseHref?: string;
  };

  const historyBooksTableCols: Array<HistoryBooksTableDef> = [
    { id: "id", header: "ID" },
    { id: "book_id", header: "Book ID", baseHref: "/dashboard/books" },
    { id: "title", header: "Title" },
    { id: "student_id", header: "Student ID", baseHref: "/dashboard/students" },
    { id: "name", header: "Student Name" },
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
          onRowSelectionChanged={(state) => console.log(state)}
          onRowDeleted={(deletedBooks) => {
            setDeletedBooks(deletedBooks);
            setIsIssueBookDeleteModalOpen(true);
          }}
          fetchData={getHistoryByPage}
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
                const { error } = await fetch("/api/issued/history", {
                  method: "DELETE",
                  body: JSON.stringify({ ids }),
                }).then((response) => response.json());
                if (error) throw new Error(error.message);
                setIsIssueBookDeleteModalOpen(false);
              }}
            />
          </section>
        </NModal>
      </NAlertProvider>
    </>
  );
}
