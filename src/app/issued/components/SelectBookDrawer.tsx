import { Dispatch, SetStateAction, useState } from "react";
import { BooksTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IIssuedBook } from "@/supabase/types/supabase";
import { UseFormSetValue } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { getBooksByPageType } from "@/server/routes/books";
import { Drawer, Text } from "@mantine/core";
import FixedTableSmall from "@/components/FixedTable/FixedTableSmall";
import FixedTableSmallContent from "@/components/FixedTable/FixedTableSmallContent";
import FixedTableSmallToolbar from "@/components/FixedTable/FixedTableSmallToolbar";
import { FixedTableFetchFunctionProps } from "@/components/FixedTable";

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
    FixedTableFetchFunctionProps<getBooksByPageType>
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
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
      position="right"
      size="80%"
      opened={isAddBookDrawerOpen}
      onClose={() => {
        setIsAddBookDrawerOpen(false);
      }}
    >
      <FixedTableSmall<getBooksByPageType>
        data={getBooksByPageQuery.data?.data || []}
        dataCount={getBooksByPageQuery.data?.count || 0}
        tanStackColumns={booksTableColsTanstack}
        onPaginationChanged={(opts) => setFetchFunctionOpts(opts)}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddBookDrawerOpen(false);
            setSelectedBook(state);
            formSetValue("book_id", state.id);
          }
        }}
      >
        <FixedTableSmallToolbar<getBooksByPageType>
          onRefresh={getBooksByPageQuery.refetch}
          columns={booksTableCols}
          loading={
            getBooksByPageQuery.isLoading || getBooksByPageQuery.isRefetching
          }
        />
        <FixedTableSmallContent />
      </FixedTableSmall>
    </Drawer>
  );
}
