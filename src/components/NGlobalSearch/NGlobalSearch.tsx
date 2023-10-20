import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SearchIcon from "../icons/SearchIcon";
import { Database } from "@/supabase/types/supabase";
import { NGlobalSearchModal } from ".";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import Link from "next/link";
import WarnIcon from "../icons/WarnIcon";
import BookIcon from "../icons/BookIcon";
import UserIcon from "../icons/UserIcon";
import LoadingIcon from "../icons/LoadingIcon";

type QueryResultItem = {
  id: number;
  type: "book" | "student";
  title: string;
  subtitle: string;
  baseHref: string;
};

type QueryResultsProps = {
  items: QueryResultItem[];
  onClick: (item: QueryResultItem) => void;
};
function QueryResultItems({ items, onClick }: QueryResultsProps) {
  return (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <WarnIcon size={40} className="text-surface-700" />
          <span className="text-lg font-light text-surface-700">
            {" "}
            Nothing found
          </span>
        </div>
      ) : (
        items.map((item) => (
          <Link
            onClick={() => onClick(item)}
            href={`${item.baseHref}${item.id}`}
            className="flex items-center hover:bg-surface-300 hover:text-surface-900 justify-between p-2 cursor-pointer transition-all duration-75"
          >
            <div className="flex gap-2 items-center">
              {item.type === "book" ? (
                <BookIcon size={30} />
              ) : (
                <UserIcon size={30} />
              )}
              <div className="flex flex-col transition-all">
                <span className="text-lg font-light">{item.title}</span>
                <span className="text-sm text-surface-600">
                  {item.subtitle}
                </span>
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
  const [queryResults, setQueryResults] = useState<QueryResultItem[]>([]);
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function doTextSearch() {
      setIsSearchResultsLoading(true);
      // FIXME: Put into API routes
      const { data: booksSearchResult } = await supabase
        .from("books")
        .select()
        .textSearch(
          "searchcol",
          `${debouncedSearchValue.split(" ").join("|")}`
        );

      if (booksSearchResult !== null) {
        const newBookSearchResult: QueryResultItem[] = booksSearchResult.map(
          (book) => ({
            id: book.id,
            type: "book",
            title: book.title ? book.title : "",
            subtitle: book.author ? book.author : "",
            baseHref: "/dashboard/books/",
          })
        );
        setQueryResults([...newBookSearchResult]);
      }

      const { data: studentsSearchResults } = await supabase
        .from("students")
        .select()
        .textSearch(
          "searchcol",
          `${debouncedSearchValue.split(" ").join("|")}`
        );

      if (studentsSearchResults !== null) {
        const newStudentsSearchResult: QueryResultItem[] =
          studentsSearchResults.map((student) => ({
            id: student.id,
            type: "student",
            title: student.name ? student.name : "",
            subtitle: student.index ? String(student.index) : "",
            baseHref: "/dashboard/students/",
          }));
        setQueryResults((oldValue) => [
          ...oldValue,
          ...newStudentsSearchResult,
        ]);
      }
      setIsSearchResultsLoading(false);
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
            <div className="flex gap-2 items-center">
              {isSearchResultsLoading ? <LoadingIcon /> : null}
              <button
                className="flex items-center"
                onClick={() => setIsSearchModalOpen(false)}
              >
                <kbd className="text-xs px-1 py-0.5 border-[1px] rounded-sm">
                  ESC
                </kbd>
              </button>
            </div>
          </div>
        }
        searchResults={
          <QueryResultItems
            items={queryResults}
            onClick={() => setIsSearchModalOpen(false)}
          />
        }
        isOpen={isSearchModalOpen}
        onModalClose={() => {
          setIsSearchModalOpen(false);
        }}
      />
    </>
  );
}
