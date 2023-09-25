import { Popover } from "@headlessui/react";
import ButtonGhost from "../ButtonGhost";
import ButtonSecondary from "../ButtonSecondary";
import CloseIcon from "../icons/CloseIcon";
import SortIcon from "../icons/SortIcon";
import { useState } from "react";
import Select from "../Select";
import NovellaSwitch from "../NovellaSwitch";

type NovellaDataTableFixedSortMenuProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sortRulesChange: (rule: Sort<T> | null) => void;
};

export type Sort<T> = {
  field: keyof T;
  ascending: boolean;
};

export default function NovellaDataTableFixedSortMenu<T>({
  fields,
  sortRulesChange,
}: NovellaDataTableFixedSortMenuProps<T>) {
  const [sorts, setSorts] = useState<Sort<T> | null>(null);
  return (
    <Popover as="div" className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button>
            <ButtonGhost
              icon={<SortIcon size={18} />}
              title={sorts ? `Sorted by ${String(sorts.field)}` : "Sort"}
              onClick={close}
            />
          </Popover.Button>
          {open && (
            <Popover.Panel
              static
              className="absolute right-0 origin-top-right mt-1 bg-surface-200 border-[1px] border-surface-300  min-w-[320px] p-3 flex gap-2 flex-col text-sm z-10"
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
