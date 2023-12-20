"use client";
import {
  ColumnDef,
  PaginationState,
  TableMeta,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import RightArrowIcon from "./icons/RightArrowIcon";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import LoadingIcon from "./icons/LoadingIcon";
import { Table, Select, Text, ActionIcon, Stack } from "@mantine/core";

type NovellaDataTableProps<T> = {
  data: T[] | undefined;
  isDataLoading: boolean;
  isDataRefetching: boolean;
  columns: ColumnDef<T, any>[];
};
export default function NovellaDataTable<T>({
  data,
  isDataLoading = true,
  isDataRefetching = true,
  columns,
}: NovellaDataTableProps<T>) {
  // Fixme: Remove the any type and put proper typing :(
  const [totalPageCount, setTotalPageCount] = useState(data ? data.length : 0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data ? data : [],
    columns,
    state: {
      pagination,
    },
    pageCount: totalPageCount,
    enableMultiRowSelection: false,
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {}, [pageIndex, pageSize]);

  return (
    <div>
      <Table
        verticalSpacing="sm"
        horizontalSpacing="sm"
        highlightOnHover
        withTableBorder
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th
                  key={header.id}
                  className="text-start p-2 px-4 font-semibold text-sm bg-dark-6/[0.5]"
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
          {data && data.length !== 0 ? (
            table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id} onClick={() => row.toggleSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id} className="p-2 px-4 text-ellipsis">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={12} className="">
                <Stack justify="center" align="center">
                  <Text c="dark.1" size="sm">
                    There are currently no records in the table
                  </Text>
                </Stack>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Table Controls */}
      <div className="flex justify-between items-center px-4 py-2 border-b-[1px] border-r-[1px] border-l-[1px] border-surface-300 bg-dark-7 text-dark-2 gap-2 text-sm">
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
          {isDataLoading || isDataRefetching ? (
            <div className="flex gap-2 text-xs items-center">
              {" "}
              <LoadingIcon size={18} /> <span>Loading data...</span>
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
            <RightArrowIcon size={18} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Next Page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <LeftArrowIcon size={18} />
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
