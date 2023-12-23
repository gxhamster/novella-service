import { Dispatch, SetStateAction, useMemo, useState } from "react";
import FilterIcon from "../icons/FilterIcon";
import AddIcon from "../icons/AddIcon";
import { FixedTableFilter } from ".";
import FixedTableMenu from "./FixedTableMenu";
import { Text, Button, Select, TextInput, CloseButton } from "@mantine/core";

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
  filter: FixedTableFilter;
  filterItemChanged: (filter: FixedTableFilter) => void;
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
    <div key={filter.id} className="w-full flex-grow flex gap-2 items-center">
      <Select
        size="xs"
        comboboxProps={{ withinPortal: false }}
        value={filter.prop}
        placeholder="id"
        data={tableProps}
        onChange={(value) => {
          filterItemChanged({ ...filter, prop: value || "" });
        }}
      />
      <Select
        size="xs"
        w={100}
        comboboxProps={{ withinPortal: false }}
        value={filter.operator}
        placeholder="id"
        data={["eq", "gt", "lt", "ilike"]}
        onChange={(value) => {
          filterItemChanged({ ...filter, operator: value || "" });
        }}
      />
      <TextInput
        size="xs"
        placeholder="Enter value here"
        value={filter.value}
        onChange={(event) => {
          event.preventDefault();

          filterItemChanged({ ...filter, value: event.target.value });
        }}
      />
      <CloseButton variant="default" size="xs" onClick={filterItemRemoved} />
    </div>
  );
}

type FilterGroupProps = {
  filters: FixedTableFilter[];
  setFilters: Dispatch<SetStateAction<FixedTableFilter[]>>;
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
      <Button
        variant="subtle"
        color="gray"
        size="xs"
        leftSection={<AddIcon size={16} />}
        onClick={(event) => {
          event.preventDefault();
          addFilter();
        }}
      >
        Add filter
      </Button>
      <Button variant="default" size="xs" onClick={applyFilters}>
        Apply filter
      </Button>
    </div>
  );
}

type FixedTableFilterMenuProps = {
  tableProps: any;
  filterRulesChanged: (filter: FixedTableFilter[]) => void;
  position?: "right" | "left";
};

export default function FixedTableFilterMenu({
  tableProps,
  filterRulesChanged,
}: FixedTableFilterMenuProps) {
  const [filters, setFilters] = useState<FixedTableFilter[]>([]);
  const defaultFilter = useMemo<FixedTableFilter>(
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
    <FixedTableMenu
      width={400}
      buttonContent={
        filters.length ? `Filtered by ${filters.length} rule` : "Filter"
      }
      buttonIcon={<FilterIcon size={16} />}
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
    </FixedTableMenu>
  );
}
