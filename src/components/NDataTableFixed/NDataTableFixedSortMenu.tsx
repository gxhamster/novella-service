import { Popover } from "@headlessui/react";
import ButtonGhost from "../ButtonGhost";
import ButtonSecondary from "../ButtonSecondary";
import CloseIcon from "../icons/CloseIcon";
import SortIcon from "../icons/SortIcon";
import { useState } from "react";
import Select from "../Select";
import NovellaSwitch from "../NovellaSwitch";
import { NDataTableFixedSort } from ".";

type NovellaDataTableFixedSortMenuProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sortRulesChange: (rule: NDataTableFixedSort<T> | null) => void;
  position?: "left" | "right";
};

export default function NDataTableFixedSortMenu<T>({
  fields,
  sortRulesChange,
  position = "right",
}: NovellaDataTableFixedSortMenuProps<T>) {
  const [sorts, setSorts] = useState<NDataTableFixedSort<T> | null>(null);
  return (
    <Popover as="div" className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button className="py-2 px-3 inline-flex text-sm gap-2 justify-center items-center text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60 outline-none">
            <SortIcon size={18} />
            {sorts ? `Sorted by ${String(sorts.field)}` : "Sort"}
          </Popover.Button>
          {open && (
            <Popover.Panel
              static
              className={`absolute ${position}-0 origin-top-${position} mt-1 bg-surface-200 border-[1px] border-surface-300  min-w-[320px] p-3 flex gap-2 flex-col text-sm z-10`}
            >
              <div className="flex flex-col gap-2">
                {!sorts ? (
                  <>
                    <span className="text-surface-700">
                      No sorting rules applied to this table
                    </span>
                    <span className="text-surface-600 text-xs">
                      Add a column below to sort the view
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 items-center w-full text-surface-600">
                    <div className="flex flex-grow items-center w-full justify-between text-xs">
                      <span>
                        Sorted by<em>{String(sorts.field)}</em>
                      </span>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-2 items-center">
                          <label>ascending: </label>
                          <NovellaSwitch
                            defaultValue={sorts.ascending}
                            onChange={(enabled) => {
                              setSorts({
                                field: sorts.field,
                                ascending: enabled,
                              });
                            }}
                          />
                        </div>
                        <ButtonGhost
                          icon={<CloseIcon size={12} />}
                          onClick={() => {
                            setSorts(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-t-[1px] border-surface-300 pt-3 flex justify-between">
                  <Select
                    onChange={(e) => {
                      setSorts({
                        field: e.target.value as keyof T,
                        ascending: true,
                      });
                    }}
                  >
                    <option disabled selected>
                      Pick a column to sort by
                    </option>
                    {fields.map((field) => (
                      <option>{String(field.id)}</option>
                    ))}
                  </Select>
                  <ButtonSecondary
                    title="Apply sorting"
                    fontSize="xs"
                    onClick={() => sortRulesChange(sorts)}
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
