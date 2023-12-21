"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState, HTMLProps, useRef, use } from "react";
import RightArrowIcon from "../icons/RightArrowIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import RefreshIcon from "../icons/RefreshIcon";
import NDataTableFixedFilterMenu from "./NDataTableFixedFilterMenu";
import NDataTableFixedSortMenu from "./NDataTableFixedSortMenu";
import {
  NDataTableFixedFetchFunctionProps,
  NDataTableFixedSort,
  NDataTableFixedFilter,
} from ".";
import { Text, Flex, ActionIcon, Table, Loader } from "@mantine/core";

type NovellaDataTableProps<TableType> = {
  data: Array<TableType>;
  dataCount: number;
  isDataLoading: boolean;
  onRefresh: () => void;
  onPaginationChanged: ({
    filters,
    sorts,
    pageIndex,
    pageSize,
  }: NDataTableFixedFetchFunctionProps<TableType>) => void;
  tanStackColumns: ColumnDef<TableType, any>[];
  columns: Array<{ id: keyof TableType; header: string }>;
  onRowSelectionChanged?: (state: TableType) => void;
};

/*
  Table allows only 1 row to be selected. To be used inside drawers
*/
export default function NDataTableFixedSmall<TableType>({
  data,
  dataCount,
  isDataLoading,
  onPaginationChanged,
  onRefresh,
  tanStackColumns,
  columns,
  onRowSelectionChanged = () => null,
}: NovellaDataTableProps<TableType>) {
  // Fixme: Remove the any type and put proper typing :(
  const [filters, setFilters] = useState<NDataTableFixedFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorts, setSorts] = useState<NDataTableFixedSort<TableType> | null>(
    null
  );
  const [totalPageCount, setTotalPageCount] = useState(data.length);
  const [refreshBtnIcon, setRefreshBtnIcon] = useState(
    <RefreshIcon size={18} />
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns: tanStackColumns,
    state: {
      pagination,
      rowSelection,
    },
    pageCount: totalPageCount,
    manualPagination: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    const pageCount = Math.ceil(dataCount / pageSize);
    setTotalPageCount(pageCount < 1 ? 1 : pageCount);
    setRefreshBtnIcon(<RefreshIcon size={18} />);
    onPaginationChanged({ filters, sorts, pageIndex, pageSize });
  }, [pageIndex, pageSize, filters, sorts, dataCount]);

  useEffect(() => {
    const selectedData = Object.keys(rowSelection).map((key) => {
      return data[Number(key)];
    })[0];
    onRowSelectionChanged(selectedData);
  }, [rowSelection]);

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
    <div className="h-full flex flex-col justify-between">
      {/* Table Functions */}
      <div className="flex justify-between bg-dark-7 border-b-[1px] border-surface-300">
        <div className="flex items-center">
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
          {/* Sort Control */}
          <NDataTableFixedSortMenu<TableType>
            position="left"
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
            position="left"
            filterRulesChanged={(filter) => {
              setFilters([...filter]);
            }}
            tableProps={columns.map((col) => col.id)}
          />
        </div>
        <div className="flex gap-2 p-1">
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
        </div>
      </div>
      <div className="h-[calc(100vh-43px-57px)] overflow-y-auto bg-dark-8 relative">
        <Table
          layout="auto"
          stickyHeader
          verticalSpacing="xs"
          horizontalSpacing="xs"
          highlightOnHover
          withColumnBorders
          className="w-full"
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <Table.Th key={header.id}>
                    <Text size="sm" c="gray.4" fw="bold" truncate>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Text>
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id} onClick={() => row.toggleSelected()}>
                {row.getVisibleCells().map((cell, _idx) => (
                  <Table.Td maw={350} key={cell.id}>
                    <Text c="dark.1" size="xs" truncate>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
