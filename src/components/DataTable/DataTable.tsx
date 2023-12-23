"use client";
import {
  ColumnDef,
  PaginationState,
  Table,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface DataTableContextType<TableType> {
  data: TableType[];
  table: Table<TableType>;
  loading: boolean;
  totalPageCount: number;
}

const DataTableContext = createContext<DataTableContextType<any> | null>(null);

export const useDataTable = () => {
  const currentTableContext = useContext(DataTableContext);

  if (!currentTableContext) {
    throw new Error(
      "useDataTable has to be used within <DataTableContext.Provider>"
    );
  }

  return currentTableContext;
};

type DataTableProps<T> = {
  data: T[] | undefined;
  totalDataCount: number;
  isDataLoading: boolean;
  isDataRefetching: boolean;
  columns: ColumnDef<T, any>[];
  onPaginationChanged?: (pageIndex: number, pageSize: number) => void;
  children?: React.ReactNode;
};

export default function DataTable<T>({
  data,
  isDataLoading = true,
  isDataRefetching = true,
  columns,
  totalDataCount,
  onPaginationChanged,
  children,
}: DataTableProps<T>) {
  const [totalPageCount, setTotalPageCount] = useState(0);
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

  useEffect(() => {
    const pageCount = Math.ceil(totalDataCount / pageSize);
    setTotalPageCount(pageCount < 1 ? 1 : pageCount);

    if (onPaginationChanged) onPaginationChanged(pageIndex, pageSize);
  }, [pageIndex, pageSize, totalDataCount]);

  return (
    <div>
      <DataTableContext.Provider
        value={{
          totalPageCount,
          table,
          loading: isDataLoading || isDataRefetching,
          data: data || [],
        }}
      >
        {children}
      </DataTableContext.Provider>
    </div>
  );
}
