import { Dispatch, SetStateAction, useMemo, useState } from "react";
import FilterIcon from "../icons/FilterIcon";
import AddIcon from "../icons/AddIcon";
import CloseIcon from "../icons/CloseIcon";
import Select from "../Select";
import { NDataTableFixedFilter } from ".";
import NDataTableFixedMenu from "./NDataTableFixedMenu";
import NButton from "../NButton";

function DisplayEmptyFilters() {
  return (
    <>
      <span className="text-surface-700">No filter applied to this table</span>
      <span className="text-surface-600 text-xs">
        Add a column below to filter the view
      </span>
    </>
  );
}

type FilterItemProps = {
  filter: NDataTableFixedFilter;
  filterItemChanged: (filter: NDataTableFixedFilter) => void;
  filterItemRemoved: () => void;
  tableProps: any[];
};
function FilterItem({
  filter,
  filterItemChanged,
  filterItemRemoved,
  tableProps,
}: FilterItemProps) {
  return (
    <div key={filter.id} className="w-full flex-grow flex">
      <Select
        value={filter.prop}
        className="flex-grow"
        onChange={(e) => {
          filterItemChanged({ ...filter, prop: e.target.value });
        }}
      >
        {tableProps.map((prop: any) => (
          <option key={prop}>{prop}</option>
        ))}
      </Select>
      <Select
        value={filter.operator}
        onChange={(e) => {
          filterItemChanged({ ...filter, operator: e.target.value });
        }}
      >
        {["eq", "gt", "lt", "ilike"].map((v) => (
          <option key={v}>{v}</option>
        ))}
      </Select>
      <input
        value={filter.value}
        onChange={(e) => {
          e.preventDefault();
          filterItemChanged({ ...filter, value: e.target.value });
        }}
        className="py-1 px-2 block min-w-[5rem] bg-surface-200 appearance-none outline-none hover:bg-surface-300 border-[1px] border-surface-200 focus:border-surface-900 text-xs text-surface-900 placeholder:text-surface-500"
        placeholder="Enter your value here"
      ></input>
      <NButton
        kind="ghost"
        icon={<CloseIcon size={12} />}
        onClick={filterItemRemoved}
      />
    </div>
  );
}

type FilterGroupProps = {
  filters: NDataTableFixedFilter[];
  setFilters: Dispatch<SetStateAction<NDataTableFixedFilter[]>>;
  tableProps: any;
};

function FilterGroup({ filters, setFilters, tableProps }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-3 items-center w-full text-surface-600">
      {filters.map((filter, idx) => (
        <FilterItem
          key={filter.id}
          filter={filter}
          tableProps={tableProps}
          filterItemRemoved={() => {
            const filterRemovedArr = filters.filter(
              (_filter, _idx) => idx !== _idx
            );
            setFilters([...filterRemovedArr]);
          }}
          filterItemChanged={(filter) => {
            const updatedFiltersArr = filters.map((_filter, _idx) => {
              if (_idx === idx) return filter;
              return _filter;
            });
            setFilters([...updatedFiltersArr]);
          }}
        />
      ))}
    </div>
  );
}

type FilterControlsProps = {
  addFilter: () => void;
  applyFilters: () => void;
};

function FilterControls({ addFilter, applyFilters }: FilterControlsProps) {
  return (
    <div className="border-t-[1px] border-surface-300 pt-3 flex justify-between">
      <NButton
        kind="ghost"
        className="px-2 py-2"
        size="xs"
        title="Add Filter"
        onClick={(e) => {
          e.preventDefault();
          addFilter();
        }}
        icon={<AddIcon size={16} />}
      />
      <NButton
        kind="secondary"
        className="px-2 py-2"
        title="Apply filter"
        size="xs"
        onClick={applyFilters}
      />
    </div>
  );
}

type NovellaDataTableFixedFilterMenuProps = {
  tableProps: any;
  filterRulesChanged: (filter: NDataTableFixedFilter[]) => void;
  position?: "right" | "left";
};

export default function NDataTableFixedFilterMenu({
  tableProps,
  filterRulesChanged,
}: NovellaDataTableFixedFilterMenuProps) {
  const [filters, setFilters] = useState<NDataTableFixedFilter[]>([]);
  const defaultFilter = useMemo<NDataTableFixedFilter>(
    () => ({
      id: filters.length,
      operator: "eq",
      prop: "id",
      value: "",
    }),
    [filters]
  );

  const addFilter = () => {
    setFilters([...filters, defaultFilter]);
  };

  const applyFilters = () => filterRulesChanged(filters);

  return (
    <NDataTableFixedMenu
      buttonContent={
        <>
          <FilterIcon size={18} />
          {filters.length ? `Filtered by ${filters.length} rule` : "Filter"}
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {!filters.length ? (
          <DisplayEmptyFilters />
        ) : (
          <FilterGroup
            filters={filters}
            setFilters={setFilters}
            tableProps={tableProps}
          />
        )}
        <FilterControls addFilter={addFilter} applyFilters={applyFilters} />
      </div>
    </NDataTableFixedMenu>
  );
}
