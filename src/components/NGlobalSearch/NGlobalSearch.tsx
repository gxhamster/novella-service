import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SearchIcon from "../icons/SearchIcon";
import { Database } from "@/supabase/types/types";
import BookIcon from "../icons/BookIcon";
import UserIcon from "../icons/UserIcon";
import { useRouter } from "next/navigation";
import { UnstyledButton, Flex, Text } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import classes from "./NGlobalSearch.module.css";
import HomeIcon from "../icons/HomeIcon";
import IssueBookIcon from "../icons/IssueBookIcon";

type QueryResultItem = {
  id: number;
  type: "book" | "student";
  title: string;
  subtitle: string;
  baseHref: string;
};

export default function NGlobalSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [queryResults, setQueryResults] = useState<QueryResultItem[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const supabase = createClientComponentClient<Database>();
  const nextRouter = useRouter();

  const actions: SpotlightActionData[] = [
    {
      id: "home",
      label: "Home",
      description: "Get to home page",
      onClick: () => nextRouter.push("/dashboard"),
      leftSection: <HomeIcon size={20} />,
    },
    {
      id: "issuebook",
      label: "Issue Book",
      description: "Issue a book",
      onClick: () => nextRouter.push("/issued"),
      leftSection: <IssueBookIcon size={20} />,
    },
  ];

  const actionsWithQueryResults = [
    ...actions,
    ...queryResults.map((result) => ({
      id: String(result.id),
      label: result.title,
      description: result.subtitle,
      leftSection:
        result.type === "book" ? (
          <BookIcon size={20} />
        ) : (
          <UserIcon size={20} />
        ),
      onClick: () => nextRouter.push(`${result.baseHref}/${result.id}`),
    })),
  ];

  useEffect(() => {
    async function doTextSearch() {
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
            baseHref: "/books/",
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
            baseHref: "/students/",
          }));
        setQueryResults((oldValue) => [
          ...oldValue,
          ...newStudentsSearchResult,
        ]);
      }
    }
    doTextSearch();
  }, [debouncedSearchValue]);

  return (
    <>
      <UnstyledButton
        p={6}
        w="20rem"
        className={classes.button}
        onClick={spotlight.open}
      >
        <Flex gap={10}>
          <SearchIcon size={20} className="" />
          <Text size="sm">Search</Text>
        </Flex>
      </UnstyledButton>
      <Spotlight
        actions={actionsWithQueryResults}
        onChange={(event: any) => setSearchValue(event.target.value)}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <SearchIcon size={20} className="" />,
          placeholder: "Search...",
        }}
      />
    </>
  );
}
