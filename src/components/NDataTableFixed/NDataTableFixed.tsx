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
import ButtonPrimary from "../ButtonPrimary";
import ButtonGhost from "../ButtonGhost";
import AddIcon from "../icons/AddIcon";
import RefreshIcon from "../icons/RefreshIcon";
import NDataTableFixedFilterMenu from "./NDataTableFixedFilterMenu";
import NDataTableFixedSortMenu from "./NDataTableFixedSortMenu";
import {
  NDataTableFixedFetchFunction,
  NDataTableFixedSort,
  NDataTableFixedFilter,
} from ".";
import NButton from "../NButton";
import TrashIcon from "../icons/TrashIcon";
import CloseIcon from "../icons/CloseIcon";

type TableCheckboxProps = {
  indeterminate?: boolean;
} & HTMLProps<HTMLInputElement>;

function TableCheckbox({ indeterminate, ...rest }: TableCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (typeof indeterminate === "boolean")
      ref.current.indeterminate = !rest.checked && indeterminate;
  }, [ref, indeterminate]);
  return <input ref={ref} type="checkbox" {...rest} />;
}

type NovellaDataTableProps<TableType> = {
  fetchData: NDataTableFixedFetchFunction<TableType>;
  tanStackColumns: ColumnDef<TableType, any>[];
  columns: Array<{ id: keyof TableType; header: string }>;
  showCreateButton?: boolean;
  onCreateRowButtonPressed?: () => void;
  onRowSelectionChanged?: (state: Array<any>) => void;
  onRowDeleted?: (deletedRows: Array<TableType>) => void;
};

export default function NDataTableFixed<TableType>({
  fetchData,
  tanStackColumns,
  columns,
  onCreateRowButtonPressed,
  onRowSelectionChanged = () => null,
  showCreateButton = true,
  onRowDeleted,
}: NovellaDataTableProps<TableType>) {
  // Fixme: Remove the any type and put proper typing :(
  const [data, setData] = useState<Array<any>>([]);
  const [filters, setFilters] = useState<NDataTableFixedFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const selectedData = useMemo(() => {
    const selectedData = Object.keys(rowSelection).map((key) => {
      return data[Number(key)];
    });
    return selectedData;
  }, [rowSelection]);

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
    pageSize: 10,
  });
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
          <TableCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <TableCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
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
    onRowSelectionChanged(selectedData);
  }, [selectedData]);

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
        {selectedData.length ? (
          <div className="flex items-center gap-2">
            <NButton
              kind="ghost"
              icon={<CloseIcon size={18} />}
              onClick={() => table.resetRowSelection()}
            />

            <span className="text-sm text-surface-700">{`${selectedData.length} rows selected`}</span>
            <NButton
              title="Delete"
              kind="alert"
              icon={<TrashIcon size={18} />}
              onClick={() => {
                onRowDeleted && onRowDeleted(selectedData);
                table.resetRowSelection();
              }}
            />
          </div>
        ) : (
          <div className="flex">
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
              <ButtonPrimary
                title="Create"
                icon={<AddIcon size={18} />}
                onClick={() =>
                  onCreateRowButtonPressed && onCreateRowButtonPressed()
                }
              />
            )}
          </div>
        )}
      </div>
      {/* FIXME: WTH need to cleaner solution */}
      <div className="h-[calc(100vh-(58px+45px+39px))] overflow-scroll bg-surface-100 m-0 relative">
        <table className="w-full table-auto">
          <thead className="text-surface-900 bg-surface-200 sticky top-0 m-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`text-start p-2 px-4 font-normal text-sm border-x-[0.7px] border-surface-300 whitespace-nowrap`}
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
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`p-2 px-4 truncate border-[0.7px] border-surface-400/70 text-sm font-normal`}
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
