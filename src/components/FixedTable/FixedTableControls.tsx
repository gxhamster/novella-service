import { Select, Text, Loader, ActionIcon } from "@mantine/core";
import RightArrowIcon from "../icons/RightArrowIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import { Table } from "@tanstack/react-table";
import { useTable } from "./FixedTable";

type PageSizeSelectorProps = {
  dataCount: number;
  value: string;
  onChange: (value: string | null) => void;
  data?: Array<string>;
  disabled?: boolean;
};

export function PageSizeSelector({
  data = ["10", "20", "30", "40", "50"],
  dataCount,
  disabled = false,
  value,
  onChange,
}: PageSizeSelectorProps) {
  return (
    <>
      <Text size="xs">Items per page</Text>
      <Select
        disabled={disabled}
        size="xs"
        w="75"
        placeholder="Pick a page"
        data={data}
        value={value}
        onChange={onChange}
      />
      <Text size="xs">{dataCount} records</Text>
    </>
  );
}

type LoadingStatusProps = {
  loading: boolean;
};

export function LoadingStatus({ loading }: LoadingStatusProps) {
  return loading ? (
    <div className="flex gap-2 text-xxs items-center">
      <Loader color="rgba(237, 237, 237, 0.18)" size="xs" />
      <Text size="xs">Loading data...</Text>
    </div>
  ) : null;
}

type PageNavigationProps = {
  table: Table<any>;
  disabled?: boolean;
};

export function PageNavigation({
  table,
  disabled = false,
}: PageNavigationProps) {
  return (
    <>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Previous Page"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || disabled}
      >
        <RightArrowIcon size={16} />
      </ActionIcon>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Next Page"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || disabled}
      >
        <LeftArrowIcon size={16} />
      </ActionIcon>
    </>
  );
}

type PageSelectorProps = {
  totalPageCount: number;
  table: Table<any>;
  disabled?: boolean;
};
export function PageSelector({
  table,
  totalPageCount,
  disabled = false,
}: PageSelectorProps) {
  return (
    <>
      <Select
        size="xs"
        w="100"
        disabled={disabled}
        placeholder="Pick a page"
        defaultValue={String(table.getState().pagination.pageIndex + 1)}
        data={Array.from({ length: table.getPageCount() }, (value, index) =>
          String(index + 1)
        )}
        onChange={(value) => {
          const page = value ? Number(value) - 1 : 0;
          table.setPageIndex(page);
        }}
      />
      <Text size="xs">of {totalPageCount} pages</Text>
    </>
  );
}

type FixedTableControls = {
  loading: boolean;
};

export default function FixedTableControls({ loading }: FixedTableControls) {
  const { table, totalPageCount, data } = useTable();

  return (
    <div className="flex justify-between items-center px-4 py-1 text-surface-800 bg-dark-7 gap-2 text-sm border-t-[0.7px] border-surface-400/60">
      {/* Left section controls */}
      <div className="flex gap-4 items-center">
        <PageSizeSelector
          dataCount={data.length}
          value={table.getState().pagination.pageSize.toString()}
          onChange={(value) => table.setPageSize(Number(value))}
        />
        <LoadingStatus loading={loading} />
      </div>
      {/* Right section controls */}
      <div className="flex gap-4 items-center">
        <PageNavigation table={table} />
        <PageSelector table={table} totalPageCount={totalPageCount} />
      </div>
    </div>
  );
}
