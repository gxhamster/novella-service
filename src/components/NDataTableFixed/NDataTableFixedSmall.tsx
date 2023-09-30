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
import LoadingIcon from "../icons/LoadingIcon";
import ButtonGhost from "../ButtonGhost";
import RefreshIcon from "../icons/RefreshIcon";
import NDataTableFixedFilterMenu from "./NDataTableFixedFilterMenu";
import NDataTableFixedSortMenu from "./NDataTableFixedSortMenu";
import {
  NDataTableFixedFetchFunction,
  NDataTableFixedSort,
  NDataTableFixedFilter,
} from ".";
import { IBook } from "@/types/supabase";

type NovellaDataTableProps<TableType> = {
  fetchData: NDataTableFixedFetchFunction<TableType>;
  tanStackColumns: ColumnDef<TableType, any>[];
  columns: Array<{ id: keyof TableType; header: string }>;
  onRowSelectionChanged?: (state: TableType) => void;
};

/*
  Table allows only 1 row to be selected. To be used inside drawers
*/
export default function NDataTableFixedSmall<TableType>({
  fetchData,
  tanStackColumns,
  columns,
  onRowSelectionChanged = () => null,
}: NovellaDataTableProps<TableType>) {
  // Fixme: Remove the any type and put proper typing :(
  const [data, setData] = useState<Array<any>>([]);
  const [filters, setFilters] = useState<NDataTableFixedFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorts, setSorts] = useState<NDataTableFixedSort<TableType> | null>(
    null
  );
  const [totalPageCount, setTotalPageCount] = useState(data.length);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const selectedData = Object.keys(rowSelection).map((key) => {
      return data[Number(key)];
    })[0];
    onRowSelectionChanged(selectedData);
  }, [rowSelection]);

  return (
    <div className="h-full flex flex-col justify-between w-[42rem]">
      {/* Table Functions */}
      <div className="flex justify-between bg-surface-200 border-b-[1px] border-surface-300">
        <div className="flex items-center">
          <ButtonGhost
            icon={refreshBtnIcon}
            title="Refresh"
            onClick={async () => {
              await getData();
            }}
          />
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
        </div>
      </div>
      <div className="h-[calc(100vh-43px-57px)] overflow-y-auto bg-surface-100 relative">
        <table>
          <thead className="text-surface-900 bg-surface-200 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`text-start p-2 px-4 font-normal text-sm border-x-[0.7px] border-surface-300`}
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
                className={`${
                  row.getIsSelected() ? "bg-surface-200/40" : "bg-surface-100"
                } text-surface-800 font-light text-sm border-b-[0.7px] border-surface-400 cursor-pointer hover:bg-surface-200/40 transition-colors`}
                onClick={() => row.toggleSelected()}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`p-2 px-4 truncate border-[0.7px] border-surface-400/70 text-xs font-normal`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
