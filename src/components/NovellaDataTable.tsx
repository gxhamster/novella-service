"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import RightArrowIcon from "./icons/RightArrowIcon";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import LoadingIcon from "./icons/LoadingIcon";

type NovellaDataTableProps<T> = {
  fetchData: ({
    pageIndex,
    pageSize,
  }: PaginationState) => Promise<{ data: any; count: number }>;
  columns: ColumnDef<T, any>[];
};
export default function NovellaDataTable<T>({
  fetchData,
  columns,
}: NovellaDataTableProps<T>) {
  // Fixme: Remove the any type and put proper typing :(
  const [data, setData] = useState<any>([]);
  const [totalPageCount, setTotalPageCount] = useState(data.length);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const { data, count } = await fetchData({ pageIndex, pageSize });
      // Fixme: Put the proper typing
      setData(() => [...data]);
      const pageCount = Math.floor(count / pageSize);
      setTotalPageCount(pageCount < 1 ? 1 : pageCount);
      setIsLoading(false);
    };
    getData();
  }, [pageIndex, pageSize, fetchData]);

  return (
    <div>
      <table className="w-full">
        <thead className="text-surface-900 bg-surface-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-start p-2 px-4 text-sm">
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
              className={`${
                row.getIsSelected() ? "bg-surface-300/40" : "bg-surface-200"
              } text-surface-800 font-light text-sm border-b-[0.7px] border-surface-400 cursor-pointer hover:bg-surface-300/40 transition-colors`}
              onClick={() => row.toggleSelected()}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 px-4 text-ellipsis">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Table Controls */}
      <div className="flex justify-between items-center px-4 py-1 bg-surface-200 gap-2 text-sm">
        <div className="flex gap-6 items-center">
          <p>Items per page</p>
          <select
            className="apperance-none bg-surface-200 outline-none p-2 focus:ring-1 focus:ring-surface-900 hover:bg-surface-300"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          {isLoading ? (
            <div className="flex gap-2 text-xs items-center">
              {" "}
              <LoadingIcon size={18} /> <span>Loading data...</span>
            </div>
          ) : null}
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="p-2 inline-flex justify-center items-center bg-surface-200 hover:bg-surface-300 transition-all focus:ring-1 focus:ring-surface-900 disabled:opacity-60 disabled:bg-surface-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <RightArrowIcon size={18} />
          </button>
          <button
            className="p-2 inline-flex justify-center items-center bg-surface-200 hover:bg-surface-300 transition-all focus:ring-1 focus:ring-surface-900 disabled:bg-surface-200 disabled:opacity-60"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <LeftArrowIcon size={18} />
          </button>
          <select
            className="apperance-none bg-surface-200 outline-none p-2 focus:ring-1 focus:ring-surface-900 hover:bg-surface-300"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          >
            {Array.from({ length: table.getPageCount() }, (v, i) => i + 1).map(
              (v) => (
                <option key={v}>{v}</option>
              )
            )}
          </select>
          <span>of {totalPageCount} pages</span>
        </div>
      </div>
    </div>
  );
}
