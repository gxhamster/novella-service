import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/types";
import BookIcon from "../icons/BookIcon";
import UserIcon from "../icons/UserIcon";
import { useRouter } from "next/navigation";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { UnstyledButton, Text, Badge, Group } from "@mantine/core";
import classes from "./GlobalSearch.module.css";
import HomeIcon from "../icons/HomeIcon";
import IssueBookIcon from "../icons/IssueBookIcon";
import SchoolIcon from "../icons/SchoolIcon";
import SearchIcon from "../icons/SearchIcon";
import { IconSearch } from "@tabler/icons-react";

type QueryResultItem = {
  id: number;
  type: "book" | "student";
  title: string;
  subtitle: string;
  baseHref: string;
};

export default function GlobalSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [queryResults, setQueryResults] = useState<QueryResultItem[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const supabase = createClientComponentClient<Database>();
  const nextRouter = useRouter();

  const [actions] = useState<SpotlightActionData[]>([
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
    {
      id: "books",
      label: "Books",
      description: "Books directory",
      onClick: () => nextRouter.push("/books"),
      leftSection: <BookIcon size={20} />,
    },
    {
      id: "students",
      label: "Students",
      description: "Students directory",
      onClick: () => nextRouter.push("/students"),
      leftSection: <UserIcon size={20} />,
    },
    {
      id: "nextyear",
      label: "Academic year",
      description: "Change academic year",
      onClick: () => nextRouter.push("/students/nextyear"),
      leftSection: <SchoolIcon size={20} />,
    },
  ]);

  const actionsWithQueryResults = useMemo(() => {
    if (queryResults.length > 0)
      return [
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
    else return actions;
  }, [queryResults, actions, nextRouter]);

  useEffect(() => {
    async function doTextSearch() {
      // FIXME: Put into API routes
      const { data: booksSearchResult } = await supabase
        .from("books")
        .select()
        .textSearch(
          "searchcol",
          `${debouncedSearchValue.split(" ").join("|")}`,
        );

      if (booksSearchResult !== null) {
        const newBookSearchResult: QueryResultItem[] = booksSearchResult.map(
          (book) => ({
            id: book.id,
            type: "book",
            title: book.title ? book.title : "",
            subtitle: book.author ? book.author : "",
            baseHref: "/books/",
          }),
        );
        setQueryResults([...newBookSearchResult]);
      }

      const { data: studentsSearchResults } = await supabase
        .from("students")
        .select()
        .textSearch(
          "searchcol",
          `${debouncedSearchValue.split(" ").join("|")}`,
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
        <Group justify="space-between" w="100%">
          <Group gap={10}>
            <SearchIcon size={20} className="" />
            <Text size="sm">Search</Text>
          </Group>
          <Badge color="dark.5" radius="sm">
            Ctrl+K
          </Badge>
        </Group>
      </UnstyledButton>
      <Spotlight.Root query={searchValue} onQueryChange={setSearchValue}>
        <Spotlight.Search
          placeholder="Search..."
          leftSection={<IconSearch stroke={1.5} />}
        />
        <Spotlight.ActionsList>
          {actionsWithQueryResults.length > 0 ? (
            actionsWithQueryResults.map((result) => {
              return (
                <Spotlight.Action
                  key={result.id}
                  label={result.label}
                  description={result.description}
                  onClick={result.onClick}
                  leftSection={result.leftSection}
                />
              );
            })
          ) : (
            <Spotlight.Empty>Nothing found...</Spotlight.Empty>
          )}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
}
