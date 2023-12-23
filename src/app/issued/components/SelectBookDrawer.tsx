import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import { Dispatch, SetStateAction, useState } from "react";
import { BooksTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IIssuedBook } from "@/supabase/types/supabase";
import { UseFormSetValue } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { NDataTableFixedFetchFunctionProps } from "@/components/NDataTableFixed";
import { getBooksByPageType } from "@/server/routes/books";
import { Drawer, Text } from "@mantine/core";

const booksColHelper = createColumnHelper<getBooksByPageType>();
const booksTableCols: Array<BooksTableColumnDef> = [
  { id: "id", header: "ID" },
  { id: "title", header: "Tilte" },
  { id: "isbn", header: "ISBN" },
  { id: "ddc", header: "DDC" },
  { id: "genre", header: "Genre" },
  { id: "edition", header: "Edition" },
];

const booksTableColsTanstack = booksTableCols.map((column) =>
  booksColHelper.accessor(column.id, {
    cell: (info) => <Text truncate>{info.getValue()}</Text>,
    header: column.header,
  })
);

type SelectBookDrawerProps = {
  isAddBookDrawerOpen: boolean;
  setIsAddBookDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedBook: Dispatch<SetStateAction<getBooksByPageType | null>>;
  formSetValue: UseFormSetValue<IIssuedBook>;
};

export default function SelectBookDrawer({
  isAddBookDrawerOpen,
  setIsAddBookDrawerOpen,
  setSelectedBook,
  formSetValue,
}: SelectBookDrawerProps) {
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    NDataTableFixedFetchFunctionProps<getBooksByPageType>
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
    <Drawer
      title="Select a book to issue"
      styles={{
        body: { padding: 0 },
      }}
      position="right"
      size="80%"
      opened={isAddBookDrawerOpen}
      onClose={() => {
        setIsAddBookDrawerOpen(false);
      }}
    >
      <NDataTableFixedSmall<getBooksByPageType>
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
    </Drawer>
  );
}
