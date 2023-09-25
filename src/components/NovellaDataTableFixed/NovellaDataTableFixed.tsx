"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import RightArrowIcon from "../icons/RightArrowIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import LoadingIcon from "../icons/LoadingIcon";
import ButtonPrimary from "../ButtonPrimary";
import ButtonGhost from "../ButtonGhost";
import AddIcon from "../icons/AddIcon";
import RefreshIcon from "../icons/RefreshIcon";
import NovellaDataTableFixedFilterMenu, {
  Filter,
} from "./NovellaDataTableFixedFilterMenu";
import { TableFetchFunction } from "@/app/books/BooksTable";
import NovellaDataTableFixedSortMenu from "./NovellaDataTableFixedSortMenu";
import { Sort } from "./NovellaDataTableFixedSortMenu";
import BooksCreateDrawer from "@/app/books/BooksCreateDrawer";

type NovellaDataTableProps<TableType> = {
  fetchData: ({
    pageIndex,
    pageSize,
    filters,
    sorts,
  }: TableFetchFunction<TableType>) => Promise<{ data: any; count: number }>;
  tanStackColumns: ColumnDef<TableType, any>[];
  columns: Array<{ id: keyof TableType; header: string }>;
  onCreateRowButtonPressed: () => void;
};

export default function NovellaDataTableFixed<TableType>({
  fetchData,
  tanStackColumns,
  columns,
  onCreateRowButtonPressed,
}: NovellaDataTableProps<TableType>) {
  // Fixme: Remove the any type and put proper typing :(
  const [data, setData] = useState<any>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sorts, setSorts] = useState<Sort<TableType> | null>(null);
  const [totalPageCount, setTotalPageCount] = useState(data.length);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshBtnIcon, setRefreshBtnIcon] = useState(
    <RefreshIcon size={18} />
  );
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
    data,
    columns: tanStackColumns,
    state: {
      pagination,
    },
    pageCount: totalPageCount,
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const getData = async () => {
    setIsLoading(true);
    setRefreshBtnIcon(<LoadingIcon size={18} />);
    const { data, count } = await fetchData({
      pageIndex,
      pageSize,
      filters,
      sorts,
    });
    // Fixme: Put the proper typing
    setData([...data]);
    const pageCount = Math.ceil(count / pageSize);
    setTotalRecords(count);
    setTotalPageCount(pageCount < 1 ? 1 : pageCount);
    setIsLoading(false);
    setRefreshBtnIcon(<RefreshIcon size={18} />);
  };

  useEffect(() => {
    getData();
  }, [pageIndex, pageSize, fetchData, filters, sorts]);

  return (
    <div className="m-0">
      {/* Table Functions */}
      <div className="flex justify-between bg-surface-200 border-b-[1px] border-surface-300">
        <div className="flex">
          <ButtonGhost
            icon={refreshBtnIcon}
            title="Refresh"
            onClick={async () => {
              await getData();
            }}
          />
        </div>
        <div className="flex">
          {/* Sort Control */}
          <NovellaDataTableFixedSortMenu<TableType>
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
          <NovellaDataTableFixedFilterMenu
            filterRulesChanged={(filter) => {
              setFilters([...filter]);
            }}
            tableProps={columns.map((col) => col.id)}
          />
          <ButtonPrimary
            title="Create"
            icon={<AddIcon size={18} />}
            onClick={() => onCreateRowButtonPressed()}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-(58px+45px))] overflow-scroll bg-surface-100 m-0">
        <table className="w-full">
          <thead className="text-surface-900 bg-surface-200 sticky top-0 m-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-start p-2 px-4 font-normal text-sm border-x-[0.7px] border-surface-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="text-surface-700 bg-surface-100 border-b-[0.7px] border-surface-400"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-2 px-4 truncate border-[0.7px] border-surface-400/70 text-sm font-normal"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Table Controls */}
        <div className="flex justify-between items-center px-4 py-1 text-surface-800 bg-surface-100 gap-2 text-sm fixed w-[calc(100%-64px)] bottom-0 border-t-[0.7px] border-surface-400/60">
          <div className="flex gap-6 items-center">
            <p>Items per page</p>
            <select
              className="apperance-none bg-surface-100 outline-none p-2 focus:ring-1 focus:ring-surface-900 hover:bg-surface-200"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <p>{totalRecords} records</p>
            {isLoading ? (
              <div className="flex gap-2 text-xxs items-center">
                {" "}
                <LoadingIcon size={18} /> <span>Loading data...</span>
              </div>
            ) : null}
          </div>
          <div className="flex gap-4 items-center">
            <button
              className="p-2 inline-flex justify-center items-center bg-surface-100 hover:bg-surface-200 transition-all focus:ring-1 focus:ring-surface-900 disabled:opacity-60 disabled:bg-surface-100"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <RightArrowIcon size={18} />
            </button>
            <button
              className="p-2 inline-flex justify-center items-center bg-surface-100 hover:bg-surface-200 transition-all focus:ring-1 focus:ring-surface-900 disabled:bg-surface-100 disabled:opacity-60"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <LeftArrowIcon size={18} />
            </button>
            <select
              className="apperance-none bg-surface-100 outline-none p-2 focus:ring-1 focus:ring-surface-900 hover:bg-surface-200"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            >
              {Array.from(
                { length: table.getPageCount() },
                (v, i) => i + 1
              ).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <span>of {totalPageCount} pages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
