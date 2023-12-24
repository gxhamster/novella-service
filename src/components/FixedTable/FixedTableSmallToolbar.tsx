import { RefreshButton } from "./FixedTableToolbar";
import { FixedTableSortMenu, FixedTableFilterMenu } from ".";
import { PageNavigation } from "./FixedTableControls";
import { useSmallTable } from "./FixedTableSmall";

type FixedTableSmallToolbarProps<TableType> = {
  onRefresh: () => void;
  columns: Array<{ id: keyof TableType; header: string }>;
  loading: boolean;
};

export default function FixedTableSmallToolbar<TableType>({
  onRefresh,
  loading,
  columns,
}: FixedTableSmallToolbarProps<TableType>) {
  const { setSorts, setFilters, table } = useSmallTable();
  return (
    <div className="flex justify-between bg-dark-7 border-b-[1px] border-surface-300 p-2">
      <div className="flex items-center gap-4">
        <RefreshButton onRefresh={onRefresh} isRefreshing={loading} />
      </div>
      <div className="flex items-center gap-4">
        {/* Sort Control */}
        <FixedTableSortMenu<TableType>
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
        <FixedTableFilterMenu
          position="left"
          filterRulesChanged={(filter) => {
            setFilters([...filter]);
          }}
          tableProps={columns.map((col) => col.id)}
        />
        <PageNavigation table={table} />
      </div>
    </div>
  );
}
