import { useDataTable } from "./DataTable";
import {
  PageSizeSelector,
  LoadingStatus,
  PageNavigation,
  PageSelector,
} from "../FixedTable/FixedTableControls";

type DataTableControlsProps = {
  disabled?: boolean;
};

export default function DataTableControls({
  disabled = false,
}: DataTableControlsProps) {
  const { table, loading, data, totalPageCount } = useDataTable();

  return (
    <div className="flex justify-between items-center px-4 py-2 border-b-[1px] border-r-[1px] border-l-[1px] border-surface-300 bg-dark-7 text-dark-2 gap-2 text-sm">
      <div className="flex gap-4 items-center">
        <PageSizeSelector
          disabled={disabled}
          dataCount={data.length}
          value={table.getState().pagination.pageSize.toString()}
          onChange={(value) => table.setPageSize(Number(value))}
        />
        <LoadingStatus loading={loading} />
      </div>
      <div className="flex gap-4 items-center">
        <PageNavigation disabled={disabled} table={table} />
        <PageSelector
          disabled={disabled}
          table={table}
          totalPageCount={totalPageCount}
        />
      </div>
    </div>
  );
}
