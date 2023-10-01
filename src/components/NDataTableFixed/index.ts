import NDataTableFixed from "./NDataTableFixed";

export default NDataTableFixed;

// Take a filter array and return POSTGRES syntax filter
export function NDataTableFixedConvertToSupabaseFilters(
  filters: NDataTableFixedFilter[]
): string {
  const filterStrArr = filters.map((filter, idx) => {
    return `${filter.prop}.${filter.operator}.${filter.value}`;
  });

  return `and(${filterStrArr.join(",")})`;
}

export type NDataTableFixedFetchFunction<TableType> = ({
  pageIndex,
  pageSize,
  filters,
  sorts,
}: {
  pageIndex: number;
  pageSize: number;
  filters: NDataTableFixedFilter[];
  sorts: NDataTableFixedSort<TableType> | null;
}) => Promise<{ data: any; count: number }>;

export type NDataTableFixedSort<T> = {
  field: keyof T;
  ascending: boolean;
};

export type NDataTableFixedFilter = {
  id: number;
  prop: string;
  operator: string;
  value: string | number;
};