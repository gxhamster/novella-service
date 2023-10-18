import { useEffect, useState, Fragment } from "react";
import { useDebounce } from "usehooks-ts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SearchIcon from "../icons/SearchIcon";
import { Database, IBook } from "@/supabase/types/supabase";
import { NGlobalSearchModal } from ".";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import Link from "next/link";
import WarnIcon from "../icons/WarnIcon";
import BookIcon from "../icons/BookIcon";

type queryResultsProps = {
  books: IBook[];
  onClick: (book: IBook) => void;
};
function QueryResultItems({ books, onClick }: queryResultsProps) {
  return (
    <>
      {books.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <WarnIcon size={40} className="text-surface-700" />
          <span className="text-lg font-light text-surface-700">
            {" "}
            Nothing found
          </span>
        </div>
      ) : (
        books.map((book) => (
          <Link
            onClick={() => onClick(book)}
            href={`/dashboard/books/${book.id}`}
            className="flex items-center hover:bg-surface-300 hover:text-surface-900 justify-between p-2 cursor-pointer transition-all duration-75"
          >
            <div className="flex gap-2 items-center">
              <BookIcon size={30} />
              <div className="flex flex-col transition-all">
                <span className="text-lg font-light">{book.title}</span>
                <span className="text-sm text-surface-600">{book.author}</span>
              </div>
            </div>
            <LeftArrowIcon size={20} />
          </Link>
        ))
      )}
    </>
  );
}

export default function NGlobalSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [queryResults, setQueryResults] = useState<IBook[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function doTextSearch() {
      // FIXME: Put into API routes
      const { data, error } = await supabase
        .from("books")
        .select()
        .textSearch("searchcol", debouncedSearchValue);

      if (data !== null) setQueryResults([...data]);
    }
    doTextSearch();
  }, [debouncedSearchValue]);

  return (
    <>
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="apperance-none outline-none px-4 py-2 flex justify-between bg-surface-200/30 border-[1px] border-surface-100 hover:bg-surface-200/50 hover:text-surface-900 min-w-[20rem] cursor-pointer transition-all text-sm"
      >
        <span>Search libary...</span>
        <SearchIcon size={20} className="" />
      </button>
      <NGlobalSearchModal
        searchSection={
          <div className="flex justify-between">
            <input
              onChange={(event) => setSearchValue(event.target.value)}
              type="text"
              placeholder="Search here..."
              className="appearance-none outline-none bg-opacity-0 bg-surface-100 w-full text-base"
            />
            <button onClick={() => setIsSearchModalOpen(false)}>
              <kbd className="text-xs px-1 border-[1px] rounded-sm">Esc</kbd>
            </button>
          </div>
        }
        searchResults={
          <QueryResultItems
            books={queryResults}
            onClick={() => setIsSearchModalOpen(false)}
          />
        }
        isOpen={isSearchModalOpen}
        onModalClose={() => {
          setIsSearchModalOpen(false);
          // setSearchValue("");
          // setQueryResults([]);
        }}
      />
    </>
  );
}
