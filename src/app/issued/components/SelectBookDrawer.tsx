import NDrawer from "@/components/NDrawer";
import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import { Dispatch, SetStateAction } from "react";
import { BooksTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IBook, IIssuedBook } from "@/supabase/types/supabase";
import { getBooksByPage } from "@/app/api/books/client";
import { UseFormSetValue } from "react-hook-form";

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
  return (
    <NDrawer
      title="Select a book to issue"
      isOpen={isAddBookDrawerOpen}
      closeDrawer={() => setIsAddBookDrawerOpen(false)}
    >
      <NDataTableFixedSmall<IBook>
        columns={booksTableCols}
        tanStackColumns={booksTableColsTanstack}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddBookDrawerOpen(false);
            setSelectedBook(state);
            formSetValue("book_id", state.id);
          }
        }}
        fetchData={getBooksByPage}
      />
    </NDrawer>
  );
}
