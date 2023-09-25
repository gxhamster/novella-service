import { useState } from "react";
import { Popover } from "@headlessui/react";
import ButtonGhost from "../ButtonGhost";
import FilterIcon from "../icons/FilterIcon";
import AddIcon from "../icons/AddIcon";
import CloseIcon from "../icons/CloseIcon";
import ButtonSecondary from "../ButtonSecondary";
import Select from "../Select";

export type Filter = {
  id: number;
  prop: string;
  operator: string;
  value: string | number;
};

type NovellaDataTableFixedFilterMenuProps = {
  tableProps: any;
  filterRulesChanged: (filter: Filter[]) => void;
};

export default function NovellaDataTableFixedFilterMenu({
  tableProps,
  filterRulesChanged,
}: NovellaDataTableFixedFilterMenuProps) {
  const [filters, setFilters] = useState<Filter[]>([]);

  return (
    <Popover as="div" className="relative">
      {({ open }) => (
        <>
          <Popover.Button>
            <ButtonGhost
              icon={<FilterIcon size={18} />}
              title={
                filters.length ? `Filtered by ${filters.length} rule` : "Filter"
              }
              onClick={close}
            />
          </Popover.Button>
          {open && (
            <Popover.Panel
              static
              className="absolute right-0 origin-top-right mt-1 bg-surface-200 border-[1px] border-surface-300  min-w-[320px] p-3 flex gap-2 flex-col text-sm z-10"
            >
              <div className="flex flex-col gap-2">
                {!filters.length ? (
                  <>
                    <span className="text-surface-700">
                      No filter applied to this table
                    </span>
                    <span className="text-surface-600 text-xs">
                      Add a column below to filter the view
                    </span>
                  </>
                ) : (
                  <div className="flex gap-3 items-center w-full text-surface-600">
                    {filters.map((filter, idx) => (
                      <div key={filter.id} className="w-full flex-grow flex">
                        <Select
                          onChange={(e) => {
                            const n = filters.map((v, i) => {
                              if (i === idx)
                                return {
                                  id: v.id,
                                  prop: e.target.value,
                                  operator: v.operator,
                                  value: v.value,
                                };
                              return v;
                            });
                            setFilters(n);
                          }}
                          value={filter.prop}
                          className="flex-grow"
                        >
                          {tableProps.map((prop: any) => (
                            <option key={prop}>{prop}</option>
                          ))}
                        </Select>
                        <Select
                          onChange={(e) => {
                            const n = filters.map((v, i) => {
                              if (i === idx)
                                return {
                                  id: v.id,
                                  prop: v.prop,
                                  operator: e.target.value,
                                  value: v.value,
                                };
                              return v;
                            });
                            setFilters(n);
                          }}
                          value={filter.operator}
                        >
                          {["eq", "gt", "lt"].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </Select>
                        <input
                          value={filter.value}
                          onChange={(e) => {
                            e.preventDefault();
                            setFilters(
                              filters.map((v, i) => {
                                if (i == idx)
                                  return {
                                    id: v.id,
                                    prop: v.prop,
                                    operator: v.operator,
                                    value: e.target.value,
                                  };
                                return v;
                              })
                            );
                          }}
                          className="py-1 px-2 block min-w-[5rem] bg-surface-200 appearance-none outline-none hover:bg-surface-300 border-[1px] border-surface-200 focus:border-surface-900 text-xs text-surface-900 placeholder:text-surface-500"
                          placeholder="Enter your value here"
                        ></input>
                        <ButtonGhost
                          icon={<CloseIcon size={12} />}
                          onClick={() => {
                            const newFilters = filters.filter((f, i) => {
                              if (i !== idx) return f;
                            });
                            setFilters(newFilters);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t-[1px] border-surface-300 pt-3 flex justify-between">
                  <ButtonGhost
                    fontSize="xs"
                    title="Add Filter"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters([
                        ...filters,
                        {
                          id: filters.length,
                          operator: "eq",
                          prop: "id",
                          value: "",
                        },
                      ]);
                    }}
                    icon={<AddIcon size={16} />}
                  />
                  <ButtonSecondary
                    title="Apply filter"
                    fontSize="xs"
                    onClick={() => filterRulesChanged(filters)}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
}
