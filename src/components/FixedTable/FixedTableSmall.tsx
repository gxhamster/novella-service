"use client";
import {
  ColumnDef,
  PaginationState,
  Table,
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
import {
  FixedTableFetchFunctionProps,
  FixedTableFilter,
  FixedTableSort,
} from ".";

interface FixedSmallTableContextType<TableType> {
  table: Table<TableType>;
  data: TableType[];
  setFilters: Dispatch<SetStateAction<FixedTableFilter[]>>;
  setSorts: Dispatch<SetStateAction<FixedTableSort<TableType> | null>>;
}
const FixedSmallTableContext =
  createContext<FixedSmallTableContextType<any> | null>(null);
export const useSmallTable = () => {
  const currentTableContext = useContext(FixedSmallTableContext);

  if (!currentTableContext) {
    throw new Error(
      "useTable has to be used within <FixedTableSmall.Provider>"
    );
  }

  return currentTableContext;
};

type FixedTableSmall<TableType> = {
  data: Array<TableType>;
  dataCount: number;
  onPaginationChanged: ({
    filters,
    sorts,
    pageIndex,
    pageSize,
  }: FixedTableFetchFunctionProps<TableType>) => void;
  tanStackColumns: ColumnDef<TableType, any>[];
  onRowSelectionChanged?: (state: TableType) => void;
  children?: React.ReactNode;
};

export default function FixedTableSmall<TableType>({
  data,
  dataCount,
  onPaginationChanged,
  tanStackColumns,
  onRowSelectionChanged = () => null,
  children,
}: FixedTableSmall<TableType>) {
  const [filters, setFilters] = useState<FixedTableFilter[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorts, setSorts] = useState<FixedTableSort<TableType> | null>(null);
  const [totalPageCount, setTotalPageCount] = useState(data.length);
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
    onPaginationChanged({ filters, sorts, pageIndex, pageSize });
  }, [pageIndex, pageSize, filters, sorts, dataCount]);

  useEffect(() => {
    const selectedData = Object.keys(rowSelection).map((key) => {
      return data[Number(key)];
    })[0];
    onRowSelectionChanged(selectedData);
  }, [rowSelection]);

  return (
    <div className="h-full flex flex-col justify-between">
      <FixedSmallTableContext.Provider
        value={{
          table,
          data,
          setFilters,
          setSorts,
        }}
      >
        {children}
      </FixedSmallTableContext.Provider>
    </div>
  );
}
