"use client";
import {
  ColumnDef,
  PaginationState,
  Table as TanstackTable,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Checkbox } from "@mantine/core";
import {
  FixedTableFetchFunctionProps,
  FixedTableFilter,
  FixedTableSort,
} from ".";

interface TableContextType<TableType> {
  table: TanstackTable<TableType>;
  selectedData: TableType[];
  data: TableType[];
  totalPageCount: number;
  filters: FixedTableFilter[];
  setFilters: Dispatch<SetStateAction<FixedTableFilter[]>>;
  sorts: FixedTableSort<TableType> | null;
  setSorts: Dispatch<SetStateAction<FixedTableSort<TableType> | null>>;
}
const TableContext = createContext<TableContextType<any> | null>(null);
export const useTable = () => {
  const currentTableContext = useContext(TableContext);

  if (!currentTableContext) {
    throw new Error("useTable has to be used within <TableContext.Provider>");
  }

  return currentTableContext;
};

type FixedTable<TableType> = {
  onPaginationChanged: ({
    filters,
    sorts,
    pageIndex,
    pageSize,
  }: FixedTableFetchFunctionProps<TableType>) => void;
  data: Array<TableType>;
  dataCount: number;
  tanStackColumns: ColumnDef<TableType, any>[];
  children: React.ReactNode;
  onRowSelectionChanged?: (
    state: Array<TableType>,
    table: TanstackTable<TableType>
  ) => void;
};

export default function FixedTable<TableType>({
  onPaginationChanged,
  data,
  dataCount,
  tanStackColumns,
  children,
  onRowSelectionChanged = () => null,
}: FixedTable<TableType>) {
  const [filters, setFilters] = useState<FixedTableFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorts, setSorts] = useState<FixedTableSort<TableType> | null>(null);
  const [totalPageCount, setTotalPageCount] = useState(0);
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
    onRowSelectionChanged(selectedData, table);
  }, [selectedData]);

  return (
    <div className="m-0 flex flex-col h-full">
      <TableContext.Provider
        value={{
          table,
          selectedData,
          data,
          totalPageCount,
          filters,
          setFilters,
          sorts,
          setSorts,
        }}
      >
        {children}
      </TableContext.Provider>
    </div>
  );
}
