import { Dispatch, SetStateAction, useState, Fragment } from "react";
import ButtonGhost from "../ButtonGhost";
import ButtonSecondary from "../ButtonSecondary";
import CloseIcon from "../icons/CloseIcon";
import SortIcon from "../icons/SortIcon";
import Select from "../Select";
import NovellaSwitch from "../NovellaSwitch";
import { NDataTableFixedSort } from ".";
import NDataTableFixedMenu from "./NDataTableFixedMenu";

type NovellaDataTableFixedSortMenuProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sortRulesChange: (rule: NDataTableFixedSort<T> | null) => void;
  position?: "left" | "right";
};

function DisplayEmptySorts() {
  return (
    <>
      <span className="text-surface-700">
        No sorting rules applied to this table
      </span>
      <span className="text-surface-600 text-xs">
        Add a column below to sort the view
      </span>
    </>
  );
}

type DisplayEmptySortsProps<T> = {
  sorts: NDataTableFixedSort<T> | null;
  setSorts: Dispatch<SetStateAction<NDataTableFixedSort<T> | null>>;
};
function DisplaySortingRules<T>({
  sorts,
  setSorts,
}: DisplayEmptySortsProps<T>) {
  return (
    <div className="flex flex-col gap-2 items-center w-full text-surface-600">
      <div className="flex flex-grow items-center w-full justify-between text-xs">
        <span>
          Sorted by<em>{String(sorts!.field)}</em>
        </span>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <label>ascending: </label>
            <NovellaSwitch
              defaultValue={sorts!.ascending}
              onChange={(enabled) => {
                setSorts({
                  field: sorts!.field,
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
  );
}

type SortControlProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sorts: NDataTableFixedSort<T> | null;
  setSorts: Dispatch<SetStateAction<NDataTableFixedSort<T> | null>>;
  sortRulesChange: (rule: NDataTableFixedSort<T> | null) => void;
};
function SortControls<T>({
  sorts,
  setSorts,
  fields,
  sortRulesChange,
}: SortControlProps<T>) {
  return (
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
  );
}

export default function NDataTableFixedSortMenu<T>({
  fields,
  sortRulesChange,
}: NovellaDataTableFixedSortMenuProps<T>) {
  const [sorts, setSorts] = useState<NDataTableFixedSort<T> | null>(null);

  return (
    <NDataTableFixedMenu
      buttonContent={
        <>
          <SortIcon size={18} />
          {sorts ? `Sorted by ${String(sorts.field)}` : "Sort"}
        </>
      }
    >
      <>
        <div className="flex flex-col gap-2">
          {!sorts ? (
            <DisplayEmptySorts />
          ) : (
            <DisplaySortingRules sorts={sorts} setSorts={setSorts} />
          )}
        </div>
        <SortControls
          sorts={sorts}
          setSorts={setSorts}
          fields={fields}
          sortRulesChange={sortRulesChange}
        />
      </>
    </NDataTableFixedMenu>
  );
}
