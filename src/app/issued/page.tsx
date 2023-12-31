"use client";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Table, createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/app/_trpc/client";
import { Anchor, Badge, Button, Group, Text, Accordion } from "@mantine/core";
import { Toast } from "@/components/Toast";
import {
  FixedTable,
  FixedTableToolbar,
  FixedTableContent,
  FixedTableEmptyContent,
  FixedTableControls,
  FixedTableFetchFunctionProps,
} from "@/components/FixedTable";
import IssueBookDrawer from "./components/IssueBookDrawer";
import DeleteModal from "@/components/NDeleteModal";
import ReturnBookModal from "./components/ReturnBookModal";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import {
  FilterFieldDate,
  FilterFieldID,
  FilterFieldSelect,
  FilterFieldText,
} from "@/components/Filter/FilterFields";
import { SubmitHandler, useForm } from "react-hook-form";
import FilterGroup from "@/components/Filter/FilterGroup";
import { Tables } from "@/supabase/types/types";
import {
  FilterDate,
  FilterNumber,
  FilterSelect,
  FilterText,
} from "@/components/Filter/filter";
import FilterSidebar from "@/components/Filter/FilterSidebar";

export type IssuedPageTableFilter = {
  id: FilterNumber;
  issued_date: FilterDate;
  book_id: FilterNumber;
  title: FilterText;
  student_id: FilterNumber;
  name: FilterText;
  due_date: FilterDate;
  status: FilterSelect;
};

type DuedateStatusBadgeProps = {
  status: string;
};
function DuedateStatusBadge({ status }: DuedateStatusBadgeProps) {
  switch (status) {
    case "OVERDUE":
      return (
        <Badge variant="light" color="red.7">
          {status}
        </Badge>
      );
    case "ALMOST DUE":
      return (
        <Badge variant="light" color="yellow.7">
          {status}
        </Badge>
      );
    case "NOT DUE":
      return (
        <Badge variant="light" color="green.7">
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="light" color="green.7">
          {status}
        </Badge>
      );
  }
}

type IssuedParams = {
  searchParams: Record<string, string> | null;
};

export default function Issued({ searchParams }: IssuedParams) {
  type IssuedPageTableType = Tables<"issued_table_view">;
  const showImportDrawer = searchParams?.drawer;
  const [issueDrawerOpen, issueDrawerHandlers] = useDisclosure(
    showImportDrawer ? true : false
  );
  const [returnModalOpen, returnModalHandlers] = useDisclosure(false);
  const [issueDeleteModalOpen, issueDeleteModalHandlers] = useDisclosure(false);
  const [filterSidebarOpen, filterSidebarHandlers] = useDisclosure(false);
  const [returnBookIDs, setReturnBookIDs] = useState<Array<number>>([]);
  const [selectedRows, setSelectedRows] = useState<IssuedPageTableType[]>();
  const issuedBooksColHelper = createColumnHelper<IssuedPageTableType>();
  const [deletedBooks, setDeletedBooks] = useState<IssuedPageTableType[]>([]);
  const [tanstackTableRef, setTanstackTableRef] =
    useState<Table<IssuedPageTableType> | null>(null);
  const [fetchFunctionOpts, setFetchFunctionOpts] = useState<
    FixedTableFetchFunctionProps<IssuedPageTableType>
  >({
    pageIndex: 0,
    pageSize: 10,
    filters: [],
    sorts: null,
  });

  type filterOptsType = {
    pageIndex: number;
    pageSize: number;
    filters: Partial<IssuedPageTableFilter>;
  };

  const filterDefaultValues: Partial<IssuedPageTableFilter> = {
    id: undefined,
    issued_date: undefined,
    book_id: undefined,
    title: "",
    student_id: undefined,
    name: "",
    due_date: undefined,
  };

  const filterFormDefaultValues: IssuedPageTableFilter = {
    id: {
      start: "",
      end: "",
      operator: "eq",
    },
    issued_date: {
      start: "",
      end: "",
      operator: "eq",
    },
    book_id: {
      start: "",
      end: "",
      operator: "eq",
    },
    title: "",
    student_id: {
      start: "",
      end: "",
      operator: "eq",
    },
    name: "",
    due_date: {
      start: "",
      end: "",
      operator: "eq",
    },
    status: "",
  };

  const [filterOpts, setFilterOpts] = useState<filterOptsType>({
    pageIndex: 0,
    pageSize: 10,
    filters: filterDefaultValues,
  });

  const getIssuedBooksByPageQuery =
    trpc.issued.getIssuedBooksByPage.useQuery(filterOpts);

  const deleteIssuedBooksQuery = trpc.issued.deleteIssuedBooksById.useMutation({
    onError: (_error) => {
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSuccess: () => {
      issueDeleteModalHandlers.close();
      getIssuedBooksByPageQuery.refetch();
    },
  });

  const deleteIssuedBooks = async () => {
    const ids = deletedBooks?.map((rows) => rows.id as number);
    deleteIssuedBooksQuery.mutate(ids);
  };

  type issueBooksTableDef = {
    id: any;
    header: string;
    type: "string" | "date" | "link" | "return" | "status";
    href?: string;
  };

  const issuedBooksTableCols: issueBooksTableDef[] = [
    { id: "id", header: "ID", type: "string" },
    { id: "book_id", header: "Book ID", type: "link", href: "/books" },
    { id: "title", header: "Title", type: "string" },
    { id: "student_id", header: "Student ID", type: "link", href: "/students" },
    { id: "name", header: "Student Name", type: "string" },
    { id: "issued_date", header: "Issued Date", type: "date" },
    { id: "due_date", header: "Due Date", type: "date" },
    { id: "status", header: "Status", type: "status" },
    { id: "action", header: "Return", type: "return" },
  ];

  const issuedBooksTableColsTanstack = issuedBooksTableCols.map((column) => {
    switch (column.type) {
      case "string":
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => cell.getValue(),
          header: column.header,
        });
      case "date":
        return issuedBooksColHelper.accessor(column.id, {
          header: column.header,
          cell: (cell) => cell.getValue(),
        });
      case "link":
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => (
            <Anchor
              size="sm"
              underline="always"
              c="blue.1"
              href={`${column.href}/${cell.getValue()}`}
            >
              {cell.getValue()}
            </Anchor>
          ),
          header: column.header,
        });
      case "return":
        return issuedBooksColHelper.display({
          id: column.id,
          cell: (cell) => (
            <Anchor
              c="blue"
              size="sm"
              onClick={() => {
                setReturnBookIDs([
                  cell.row.getAllCells()[1].getValue() as number,
                ]);
                returnModalHandlers.open();
              }}
            >
              Return
            </Anchor>
          ),
          header: column.header,
        });
      case "status":
        return issuedBooksColHelper.accessor("status", {
          id: column.id,
          header: "Status",
          cell: (cell) => {
            return <DuedateStatusBadge status={cell.getValue() || "NOT DUE"} />;
          },
        });
      default:
        return issuedBooksColHelper.accessor(column.id, {
          cell: (cell) => cell.getValue(),
          header: column.header,
        });
    }
  });

  function TableToolbarReturn() {
    return (
      <Button
        size="xs"
        variant="filled"
        onClick={() => {
          if (selectedRows) {
            const booksToReturn = selectedRows
              ?.filter((row) => row.id !== null)
              .map((row) => row.id as number);
            setReturnBookIDs(booksToReturn);
            returnModalHandlers.open();
            tanstackTableRef?.resetRowSelection();
          } else {
            Toast.Error({
              title: "Could not return",
              message:
                "Make sure atleast one row is selected to be able to return",
            });
          }
        }}
        rightSection={<UnreturnedBookIcon size={16} />}
      >
        Return
      </Button>
    );
  }

  const formMethods = useForm<IssuedPageTableFilter>({
    defaultValues: filterFormDefaultValues,
  });

  const onSubmit: SubmitHandler<IssuedPageTableFilter> = (data) => {
    const newFilter: Partial<IssuedPageTableFilter> = {
      id: data.id.start ? data.id : undefined,
      book_id: data.book_id.start ? data.book_id : undefined,
      title: data.title || "",
      student_id: data.student_id.start ? data.student_id : undefined,
      name: data.name || "",
      issued_date: data.issued_date.start ? data.issued_date : undefined,
      due_date: data.due_date.start ? data.due_date : undefined,
      status: data.status || "",
    };

    setFilterOpts((current) => ({ ...current, filters: newFilter }));
    console.log(newFilter);
  };

  return (
    <div className="grid grid-cols-[320px_calc(100%-320px)] h-full">
      {filterSidebarOpen && (
        <FilterSidebar
          formMethods={formMethods}
          defaultOpenedGroups={["Reference ID"]}
          onFilterApplied={onSubmit}
          defaultFieldValues={filterFormDefaultValues}
          onFilterReset={() => {
            setFilterOpts((current) => ({
              ...current,
              filters: filterDefaultValues,
            }));
          }}
        >
          <FilterGroup
            active={filterOpts.filters.id ? true : false}
            type="numeric"
            key={1}
            title="Reference ID"
          >
            <FilterFieldID fieldName="id" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.issued_date ? true : false}
            type="date"
            key={2}
            title="Issued Date"
          >
            <FilterFieldDate fieldName="issued_date" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.book_id ? true : false}
            type="numeric"
            key={3}
            title="Book ID"
          >
            <FilterFieldID fieldName="book_id" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.title ? true : false}
            type="text"
            key={4}
            title="Title"
          >
            <FilterFieldText fieldName="title" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.student_id ? true : false}
            type="numeric"
            key={5}
            title="Student ID"
          >
            <FilterFieldID fieldName="student_id" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.name ? true : false}
            type="text"
            key={6}
            title="Student Name"
          >
            <FilterFieldText fieldName="name" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.due_date ? true : false}
            type="date"
            key={7}
            title="Due Date"
          >
            <FilterFieldDate fieldName="due_date" />
          </FilterGroup>
          <FilterGroup
            active={filterOpts.filters.status ? true : false}
            type="select"
            title="Status"
            key={8}
          >
            <FilterFieldSelect
              options={[
                { value: "OVERDUE", label: "Overdue" },
                { value: "ALMOST DUE", label: "Almost due" },
                { value: "NOT DUE", label: "Not due" },
              ]}
              fieldName="status"
            />
          </FilterGroup>
        </FilterSidebar>
      )}
      <FixedTable<IssuedPageTableType>
        data={getIssuedBooksByPageQuery.data?.data || []}
        fullWidth={!filterSidebarOpen}
        onPaginationChanged={(options) =>
          setFilterOpts((current) => ({
            ...current,
            pageIndex: options.pageIndex,
            pageSize: options.pageSize,
          }))
        }
        dataCount={getIssuedBooksByPageQuery.data?.count || 0}
        tanStackColumns={issuedBooksTableColsTanstack}
        onRowSelectionChanged={(selectedRows, table) => {
          setSelectedRows(selectedRows);
          setTanstackTableRef(table);
        }}
      >
        <FixedTableToolbar<IssuedPageTableType>
          onFilterButtonPressed={() => {
            if (filterSidebarOpen) filterSidebarHandlers.close();
            else filterSidebarHandlers.open();
          }}
          primaryActionTitle="Issue book"
          selectedToobarActions={<TableToolbarReturn />}
          columns={issuedBooksTableCols}
          primaryAction={issueDrawerHandlers.open}
          onRefresh={getIssuedBooksByPageQuery.refetch}
          onRowDeleted={(deletedBooks) => {
            setDeletedBooks(deletedBooks);
            issueDeleteModalHandlers.open();
          }}
          isDataLoading={
            getIssuedBooksByPageQuery.isLoading ||
            getIssuedBooksByPageQuery.isRefetching
          }
        />
        <FixedTableContent />
        <FixedTableEmptyContent />
        <FixedTableControls loading={getIssuedBooksByPageQuery.isLoading} />
      </FixedTable>

      {/* Delete Issued book Modal */}
      <DeleteModal
        isOpen={issueDeleteModalOpen}
        closeModal={issueDeleteModalHandlers.close}
        isDeleting={deleteIssuedBooksQuery.isLoading}
        onDelete={deleteIssuedBooks}
      />
      <ReturnBookModal
        isReturnBookModalOpen={returnModalOpen}
        closeReturnModal={returnModalHandlers.close}
        onBookReturned={() => getIssuedBooksByPageQuery.refetch()}
        returnBookIDs={returnBookIDs}
      />
      <IssueBookDrawer
        onBookIssued={getIssuedBooksByPageQuery.refetch}
        isIssueBookDrawerOpen={issueDrawerOpen}
        closeIssueDrawer={issueDrawerHandlers.close}
      />
    </div>
  );
}
