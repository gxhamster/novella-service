"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import RightArrowIcon from "../icons/RightArrowIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import AddIcon from "../icons/AddIcon";
import RefreshIcon from "../icons/RefreshIcon";
import NDataTableFixedFilterMenu from "./NDataTableFixedFilterMenu";
import NDataTableFixedSortMenu from "./NDataTableFixedSortMenu";
import {
  NDataTableFixedSort,
  NDataTableFixedFilter,
  NDataTableFixedFetchFunctionProps,
} from ".";
import TrashIcon from "../icons/TrashIcon";
import CloseIcon from "../icons/CloseIcon";
import NButtonLink from "../NButtonLink";
import BoxIcon from "../icons/BoxIcon";
import {
  Table,
  Select,
  Text,
  ActionIcon,
  Loader,
  Checkbox,
  Button,
  Flex,
  Stack,
} from "@mantine/core";

type NovellaDataTableProps<TableType> = {
  onRefresh: () => void;
  onPaginationChanged: ({
    filters,
    sorts,
    pageIndex,
    pageSize,
  }: NDataTableFixedFetchFunctionProps<TableType>) => void;
  data: Array<TableType>;
  dataCount: number;
  tanStackColumns: ColumnDef<TableType, any>[];
  columns: Array<{ id: keyof TableType; header: string }>;
  showCreateButton?: boolean;
  isDataLoading?: boolean;
  onCreateRowButtonPressed?: () => void;
  onRowSelectionChanged?: (state: Array<any>) => void;
  onRowDeleted?: (deletedRows: Array<TableType>) => void;
  primaryButtonTitle?: string;
};

export default function NDataTableFixed<TableType>({
  onPaginationChanged,
  data,
  dataCount,
  onRefresh,
  tanStackColumns,
  columns,
  primaryButtonTitle = "Create",
  isDataLoading = false,
  onCreateRowButtonPressed,
  onRowSelectionChanged = () => null,
  showCreateButton = true,
  onRowDeleted,
}: NovellaDataTableProps<TableType>) {
  // Fixme: Remove the any type and put proper typing :(
  const [filters, setFilters] = useState<NDataTableFixedFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorts, setSorts] = useState<NDataTableFixedSort<TableType> | null>(
    null
  );
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [refreshBtnIcon, setRefreshBtnIcon] = useState(
    <RefreshIcon size={18} />
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const selectedData = useMemo(() => {
    const selectedData = Object.keys(rowSelection).map((key) => {
      return data[Number(key)];
    });
    return selectedData;
  }, [rowSelection]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const selectColAdded = useMemo<ColumnDef<TableType>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...tanStackColumns,
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: selectColAdded,
    state: {
      pagination,
      rowSelection,
    },
    pageCount: totalPageCount,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    onPaginationChanged({ filters, sorts, pageIndex, pageSize });
    const pageCount = Math.ceil(dataCount / pageSize);
    setTotalPageCount(pageCount < 1 ? 1 : pageCount);
  }, [pageIndex, pageSize, filters, sorts, dataCount]);

  useEffect(() => {
    onRowSelectionChanged(selectedData);
  }, [selectedData]);

  useEffect(() => {
    setRefreshBtnIcon(() =>
      isDataLoading ? (
        <Loader size="xs" color="dark.1" />
      ) : (
        <RefreshIcon size={18} />
      )
    );
  }, [isDataLoading]);

  return (
    <div className="m-0 flex flex-col h-full">
      {/* Table Functions */}
      <div className="flex max-h-[45px] justify-between bg-dark-7 border-b-[1px] border-surface-300 p-1">
        <ActionIcon
          variant="light"
          color="dark"
          w={100}
          size="lg"
          aria-label="Refresh"
          onClick={onRefresh}
        >
          <Flex gap={10} align="center">
            {refreshBtnIcon}
            <Text size="sm" c="dark.1">
              Refresh
            </Text>
          </Flex>
        </ActionIcon>
        {selectedData.length ? (
          <div className="flex items-center gap-2">
            <ActionIcon
              variant="default"
              color="dark"
              size="lg"
              aria-label="Reset row selection"
              onClick={() => table.resetRowSelection()}
            >
              <CloseIcon size={16} />
            </ActionIcon>
            <Text
              c="dark.1"
              size="xs"
            >{`${selectedData.length} rows selected`}</Text>

            <Button
              variant="filled"
              color="red.8"
              leftSection={<TrashIcon size={18} />}
              onClick={() => {
                onRowDeleted && onRowDeleted(selectedData);
                table.resetRowSelection();
              }}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            {/* Sort Control */}
            <NDataTableFixedSortMenu<TableType>
              fields={columns}
              sortRulesChange={(_sorts) => {
                if (_sorts)
                  setSorts({
                    field: _sorts.field,
                    ascending: _sorts.ascending,
                  });
                else setSorts(null);
              }}
            />
            {/* Filter Controls */}
            <NDataTableFixedFilterMenu
              filterRulesChanged={(filter) => {
                setFilters([...filter]);
              }}
              tableProps={columns.map((col) => col.id)}
            />
            {showCreateButton && (
              <Button
                leftSection={<AddIcon size={18} />}
                onClick={() =>
                  onCreateRowButtonPressed && onCreateRowButtonPressed()
                }
              >
                {primaryButtonTitle}
              </Button>
            )}
          </div>
        )}
      </div>
      {data.length !== 0 ? (
        <div className="flex-grow overflow-scroll bg-dark-8 m-0 relative">
          <Table
            stickyHeader
            verticalSpacing="xs"
            horizontalSpacing="sm"
            withColumnBorders
            className="w-full table-auto"
          >
            <Table.Thead className="text-surface-900 bg-surface-200 sticky top-0 m-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => (
                    <Table.Th
                      key={header.id}
                      className={`text-start p-2 px-4 font-semibold text-sm border-x-[0.7px] border-surface-400 whitespace-nowrap`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  className="text-surface-700 border-b-[0.7px] border-surface-400"
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <Table.Td
                      key={cell.id}
                      className={`p-2 px-4 truncate border-[0.7px] border-surface-400/70 text-sm font-normal`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full bg-dark-8">
          <Stack gap={10}>
            <BoxIcon size={120} className="text-dark-2" strokeWidth={1} />
            <Stack gap={5}>
              <Text size="xl" c="dark.1">
                Empty table
              </Text>
              <Text size="md" c="dark.2">
                To create a new entry, click Create
              </Text>
              <Button
                mt={20}
                variant="outline"
                leftSection={<RightArrowIcon size={18} />}
              >
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </Stack>
          </Stack>
        </div>
      )}

      {/* Table Controls */}
      <div className="flex justify-between items-center px-4 py-1 text-surface-800 bg-dark-7 gap-2 text-sm border-t-[0.7px] border-surface-400/60">
        <div className="flex gap-6 items-center">
          <Text size="xs">Items per page</Text>
          <Select
            size="xs"
            w="75"
            placeholder="Pick a page"
            data={["10", "20", "30", "40", "50"]}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(e) => table.setPageSize(Number(e))}
          />
          <Text size="xs">{dataCount} records</Text>
          {isDataLoading ? (
            <div className="flex gap-2 text-xxs items-center">
              {" "}
              <Loader color="rgba(237, 237, 237, 0.18)" size="xs" />
              <Text size="xs">Loading data...</Text>
            </div>
          ) : null}
        </div>
        <div className="flex gap-4 items-center">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Previous Page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <RightArrowIcon size={16} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Next Page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <LeftArrowIcon size={16} />
          </ActionIcon>
          <Select
            size="xs"
            w="100"
            placeholder="Pick a page"
            defaultValue={String(table.getState().pagination.pageIndex + 1)}
            data={Array.from({ length: table.getPageCount() }, (value, index) =>
              String(index + 1)
            )}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
          <Text size="xs">of {totalPageCount} pages</Text>
        </div>
      </div>
    </div>
  );
}
