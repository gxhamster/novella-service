import { useEffect, useState, Fragment } from "react";
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
import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

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
          <Combobox.Option
            key={item.id}
            value={item}
            className={({ active }) =>
              `p-2 hover:bg-surface-300 hover:text-surface-900  text-surface-600 cursor-pointer transition-all duration-75 ${
                active ? "bg-surface-300 text-surface-900" : ""
              }`
            }
          >
            <Link
              className="flex items-center justify-between"
              onClick={() => onClick(item)}
              href={`${item.baseHref}${item.id}`}
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
          </Combobox.Option>
        ))
      )}
    </>
  );
}

export default function NGlobalSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState<QueryResultItem>();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [queryResults, setQueryResults] = useState<QueryResultItem[]>([]);
  const [isSearchResultsLoading, setIsSearchResultsLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const supabase = createClientComponentClient<Database>();
  const nextRouter = useRouter();

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

  useEffect(() => {
    if (selected) nextRouter.push(`${selected?.baseHref}${selected?.id}`);
    setIsSearchModalOpen(false);
  }, [selected]);

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
        isOpen={isSearchModalOpen}
        onModalClose={() => {
          setIsSearchModalOpen(false);
        }}
      >
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <Combobox.Input
              placeholder="Search here..."
              className={`appearance-none p-4 outline-none bg-opacity-0 bg-surface-100 w-full text-base border-b-[2px] transition-colors ${
                isSearchResultsLoading
                  ? "border-primary-600"
                  : "border-surface-300"
              }`}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setSearchValue("")}
            >
              <Combobox.Options className="p-4 max-h-[20rem] w-full overflow-auto bg-surface-200 text-base focus:outline-none sm:text-sm">
                <QueryResultItems
                  items={queryResults}
                  onClick={() => setIsSearchModalOpen(false)}
                />
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </NGlobalSearchModal>
    </>
  );
}
