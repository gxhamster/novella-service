import FixedTable from "./FixedTable";
import FixedTableContent from "./FixedTableContent";
import FixedTableControls from "./FixedTableControls";
import FixedTableEmptyContent from "./FixedTableEmptyContent";
import FixedTableFilterMenu from "./FixedTableFilterMenu";
import FixedTableMenu from "./FixedTableMenu";
import FixedTableSortMenu from "./FixedTableSortMenu";
import FixedTableToolbar from "./FixedTableToolbar";

// Take a filter array and return POSTGRES syntax filter
function FixedTableFilterToSupabase(filters: FixedTableFilter[]): string {
  const filterStrArr = filters.map((filter, idx) => {
    if (filter.operator === "like") {
      return `${filter.prop}.${filter.operator}.%${filter.value}%`;
    }
    return `${filter.prop}.${filter.operator}.${filter.value}`;
  });

  return `and(${filterStrArr.join(",")})`;
}

type FixedTableFetchFunctionProps<TableType> = {
  pageIndex: number;
  pageSize: number;
  filters: FixedTableFilter[];
  sorts: FixedTableSort<TableType> | null;
};

type FixedTableFetchFunction<TableType> = ({
  pageIndex,
  pageSize,
  filters,
  sorts,
}: // FIXME: :( Return type of the data from the promise should be the type passed to the table
FixedTableFetchFunctionProps<TableType>) => Promise<{
  data: any;
  count: number;
}>;
type FixedTableSort<T> = {
  field: keyof T;
  ascending: boolean;
};

type FixedTableFilter = {
  id: number;
  prop: string;
  operator: string;
  value: string | number;
};

export {
  FixedTable,
  FixedTableContent,
  FixedTableControls,
  FixedTableEmptyContent,
  FixedTableFilterMenu,
  FixedTableMenu,
  FixedTableSortMenu,
  FixedTableToolbar,
  FixedTableFilterToSupabase,
};

export type {
  FixedTableFetchFunctionProps,
  FixedTableFetchFunction,
  FixedTableSort,
  FixedTableFilter,
};
