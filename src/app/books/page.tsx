"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { useDisclosure } from "@mantine/hooks";
import { IBook } from "@/supabase/types/supabase";
import { trpc } from "@/app/_trpc/client";
import { Toast } from "@/components/Toast";
import { getBooksByPageType } from "@/server/routes/books";
import {
  FixedTable,
  FixedTableContent,
  FixedTableControls,
  FixedTableEmptyContent,
  FixedTableFetchFunctionProps,
  FixedTableToolbar,
} from "@/components/FixedTable";
import DeleteModal from "@/components/NDeleteModal";
import BookAddDrawer from "./components/BookAddDrawer";
import Link from "next/link";

export default function Books() {
  const columnHelper = createColumnHelper<getBooksByPageType>();
  const router = useRouter();
  const [deleteBookModalOpen, deleteBookModalHandler] = useDisclosure(false);
  const [addBookDrawerOpen, addBookDrawerHandler] = useDisclosure(false);

  const [deletedBooks, setDeletedBooks] = useState<getBooksByPageType[]>([]);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    FixedTableFetchFunctionProps<IBook>
  >({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: null,
  });
  const getBooksByPageQuery = trpc.books.getBooksByPage.useQuery(
    fetchFunctionOpts,
    { keepPreviousData: true }
  );

  const booksDeleteMutation = trpc.books.deleteBooksById.useMutation({
    onError: (_error) => {
      Toast.Error({
        title: "Could not delete book",
        message: _error.message,
      });
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSettled: () => {
      deleteBookModalHandler.close();
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Succcessful",
        message: "Deleted book from library",
      });
      router.refresh();
      getBooksByPageQuery.refetch();
    },
  });

  const onBooksDeleted = async () => {
    const ids = deletedBooks?.map((rows) => rows.id);

    booksDeleteMutation.mutate(ids);
  };

  const columnsObj: Array<{
    id: keyof getBooksByPageType;
    header: string;
    isLink?: boolean;
  }> = [
    { id: "id", header: "ID", isLink: true },
    { id: "title", header: "Tilte" },
    { id: "author", header: "Author" },
    { id: "isbn", header: "ISBN" },
    { id: "genre", header: "Genre" },
    { id: "publisher", header: "Publisher" },
    { id: "edition", header: "Edition" },
    { id: "ddc", header: "DDC" },
    { id: "language", header: "Language" },
    { id: "year", header: "Year" },
    { id: "pages", header: "Pages" },
  ];
  const tanstackColumns = columnsObj.map((column) =>
    columnHelper.accessor(column.id, {
      cell: (info) =>
        column.isLink ? (
          <Link
            href={`/books/${info.getValue()}`}
            className="hover:underline hover:text-primary-700"
          >
            {info.getValue()}
          </Link>
        ) : (
          info.getValue()
        ),
      header: column.header,
    })
  );

  return (
    <div className="w-full h-full flex flex-col text-surface-900 gap-y-3 m-0">
      <FixedTable<getBooksByPageType>
        tanStackColumns={tanstackColumns}
        data={getBooksByPageQuery.data?.data || []}
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        dataCount={getBooksByPageQuery.data?.count || 0}
      >
        <FixedTableToolbar
          onFilterButtonPressed={() => null}
          primaryActionTitle="Add book"
          columns={columnsObj}
          onRefresh={getBooksByPageQuery.refetch}
          primaryAction={addBookDrawerHandler.open}
          onRowDeleted={(deletedRows) => {
            setDeletedBooks(deletedRows);
            deleteBookModalHandler.open();
          }}
          isDataLoading={
            getBooksByPageQuery.isLoading || getBooksByPageQuery.isRefetching
          }
        />
        <FixedTableContent />
        <FixedTableEmptyContent />
        <FixedTableControls loading={getBooksByPageQuery.isLoading} />
      </FixedTable>
      <DeleteModal
        isOpen={deleteBookModalOpen}
        closeModal={deleteBookModalHandler.close}
        onDelete={onBooksDeleted}
        isDeleting={booksDeleteMutation.isLoading}
      />
      <BookAddDrawer
        isAddBookDrawerOpen={addBookDrawerOpen}
        onBookAdded={getBooksByPageQuery.refetch}
        onAddBookDrawerClosed={addBookDrawerHandler.close}
      />
    </div>
  );
}
