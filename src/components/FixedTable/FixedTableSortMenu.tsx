"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Text, Switch, CloseButton, Select, Button } from "@mantine/core";
import SortIcon from "../icons/SortIcon";
import { FixedTableSort } from ".";
import FixedTableMenu from "./FixedTableMenu";

type FixedTableSortMenuProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sortRulesChange: (rule: FixedTableSort<T> | null) => void;
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
  sorts: FixedTableSort<T> | null;
  setSorts: Dispatch<SetStateAction<FixedTableSort<T> | null>>;
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
            <Switch
              fz="xs"
              defaultChecked
              size="md"
              onChange={(event) =>
                setSorts({
                  field: sorts!.field,
                  ascending: event.target.checked,
                })
              }
            />
          </div>
          <CloseButton
            variant="default"
            size="xs"
            onClick={() => setSorts(null)}
          />
        </div>
      </div>
    </div>
  );
}

type SortControlProps<T> = {
  fields: Array<{ id: keyof T; header: string }>;
  sorts: FixedTableSort<T> | null;
  setSorts: Dispatch<SetStateAction<FixedTableSort<T> | null>>;
  sortRulesChange: (rule: FixedTableSort<T> | null) => void;
};
function SortControls<T>({
  sorts,
  setSorts,
  fields,
  sortRulesChange,
}: SortControlProps<T>) {
  return (
    <div className="border-t-[1px] border-surface-300 pt-3 flex gap-2 justify-between mt-2">
      <Select
        size="xs"
        comboboxProps={{ withinPortal: false }}
        placeholder="Pick a field"
        data={fields.map((field) => String(field.id))}
        onChange={(value) => {
          setSorts({
            field: value as keyof T,
            ascending: true,
          });
        }}
      />
      <Button
        variant="default"
        size="xs"
        onClick={() => sortRulesChange(sorts)}
      >
        Apply Sort
      </Button>
    </div>
  );
}

export default function FixedTableSortMenu<T>({
  fields,
  sortRulesChange,
}: FixedTableSortMenuProps<T>) {
  const [sorts, setSorts] = useState<FixedTableSort<T> | null>(null);

  return (
    <FixedTableMenu
      buttonContent={sorts ? `Sorted by ${String(sorts.field)}` : "Sort"}
      buttonIcon={<SortIcon size={18} />}
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
    </FixedTableMenu>
  );
}
