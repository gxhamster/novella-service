import NDrawer from "@/components/NDrawer";
import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import { Dispatch, SetStateAction, useState } from "react";
import { BooksTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IBook, IIssuedBook } from "@/supabase/types/supabase";
import { UseFormSetValue } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { NDataTableFixedFetchFunctionProps } from "@/components/NDataTableFixed";

const booksColHelper = createColumnHelper<IBook>();
const booksTableCols: Array<BooksTableColumnDef> = [
  { id: "id", header: "ID" },
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

const booksTableColsTanstack = booksTableCols.map((column) =>
  booksColHelper.accessor(column.id, {
    cell: (info) => info.getValue(),
    header: column.header,
  })
);

type SelectBookDrawerProps = {
  isAddBookDrawerOpen: boolean;
  setIsAddBookDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedBook: Dispatch<SetStateAction<IBook | null>>;
  formSetValue: UseFormSetValue<IIssuedBook>;
};

export default function SelectBookDrawer({
  isAddBookDrawerOpen,
  setIsAddBookDrawerOpen,
  setSelectedBook,
  formSetValue,
}: SelectBookDrawerProps) {
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    NDataTableFixedFetchFunctionProps<IBook>
  >({
    pageIndex: 0,
    pageSize: 100,
    filters: [],
    sorts: null,
  });
  const getBooksByPageQuery = trpc.books.getBooksByPage.useQuery(
    fetchFunctionOpts,
    { keepPreviousData: true }
  );

  return (
    <NDrawer
      title="Select a book to issue"
      isOpen={isAddBookDrawerOpen}
      closeDrawer={() => setIsAddBookDrawerOpen(false)}
    >
      <NDataTableFixedSmall<IBook>
        columns={booksTableCols}
        tanStackColumns={booksTableColsTanstack}
        isDataLoading={
          getBooksByPageQuery.isLoading || getBooksByPageQuery.isRefetching
        }
        data={getBooksByPageQuery.data ? getBooksByPageQuery.data.data : []}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddBookDrawerOpen(false);
            setSelectedBook(state);
            formSetValue("book_id", state.id);
          }
        }}
        dataCount={
          getBooksByPageQuery.data ? getBooksByPageQuery.data.count : 0
        }
        onPaginationChanged={(opts) => {
          setFetchFunctionOpts({ ...opts });
        }}
        onRefresh={() => getBooksByPageQuery.refetch()}
      />
    </NDrawer>
  );
}
