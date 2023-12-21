"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import NDataTableFixed, {
  NDataTableFixedFetchFunctionProps,
} from "@/components/NDataTableFixed";
import NDeleteModal from "@/components/NDeleteModal";
import { IBook } from "@/supabase/types/supabase";
import { trpc } from "@/app/_trpc/client";
import BookAddDrawer from "./components/BookAddDrawer";
import { Toast } from "@/components/Toast";
import { getBooksByPageType } from "@/server/routes/books";

export default function Books() {
  const columnHelper = createColumnHelper<getBooksByPageType>();
  const router = useRouter();
  const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
  const [deletedBooks, setDeletedBooks] = useState<getBooksByPageType[]>([]);
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    NDataTableFixedFetchFunctionProps<IBook>
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
      setIsDeleteBookModalOpen(false);
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
      <NDataTableFixed<getBooksByPageType>
        columns={columnsObj}
        tanStackColumns={tanstackColumns}
        onCreateRowButtonPressed={() => setIsAddBookDrawerOpen(true)}
        data={getBooksByPageQuery.data ? getBooksByPageQuery.data?.data : []}
        isDataLoading={
          getBooksByPageQuery.isLoading || getBooksByPageQuery.isRefetching
        }
        onRowDeleted={(deletedRows) => {
          setDeletedBooks([...deletedRows]);
          setIsDeleteBookModalOpen(true);
        }}
        dataCount={
          getBooksByPageQuery.data ? getBooksByPageQuery.data?.count : 0
        }
        onRefresh={() => {
          getBooksByPageQuery.refetch();
        }}
        onPaginationChanged={(opts) => {
          setFetchFunctionOpts({ ...opts });
        }}
      />
      <NDeleteModal
        isOpen={isDeleteBookModalOpen}
        closeModal={() => setIsDeleteBookModalOpen(false)}
        onDelete={onBooksDeleted}
        isDeleting={booksDeleteMutation.isLoading}
      />
      <BookAddDrawer
        isAddBookDrawerOpen={isAddBookDrawerOpen}
        onBookAdded={() => getBooksByPageQuery.refetch()}
        onAddBookDrawerClosed={() => setIsAddBookDrawerOpen(false)}
      />
    </div>
  );
}
