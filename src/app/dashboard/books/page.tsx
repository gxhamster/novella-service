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

export default function Books() {
  const columnHelper = createColumnHelper<IBook>();
  const router = useRouter();
  const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
  const [deletedBooks, setDeletedBooks] = useState<IBook[]>([]);
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
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSettled: () => {
      setIsDeleteBookModalOpen(false);
    },
    onSuccess: () => {
      router.refresh();
      getBooksByPageQuery.refetch();
    },
  });

  const onBooksDeleted = async () => {
    const ids = deletedBooks?.map((rows) => rows.id);

    booksDeleteMutation.mutate(ids);
  };

  const columnsObj: Array<{
    id: keyof IBook;
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
            href={`/dashboard/books/${info.getValue()}`}
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
    <div className="w-full flex flex-col text-surface-900 gap-y-3 m-0">
      <NDataTableFixed<IBook>
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
      />
      <BookAddDrawer
        isAddBookDrawerOpen={isAddBookDrawerOpen}
        onBookAdded={() => getBooksByPageQuery.refetch()}
        onAddBookDrawerClosed={() => setIsAddBookDrawerOpen(false)}
      />
    </div>
  );
}
