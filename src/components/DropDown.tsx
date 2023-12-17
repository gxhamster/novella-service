import { Listbox } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

export type DropDownProps<Type> = {
  title: string;
  selected: [Type, Dispatch<SetStateAction<Type>>];
  children: React.ReactNode;
};

export default function DropDown<Type>({
  selected,
  children,
  title,
}: DropDownProps<Type>) {
  const [selectedValue, setSelectedValue] = selected;
  return (
    <Listbox value={selectedValue} onChange={setSelectedValue}>
      <div className="relative">
        <Listbox.Button className="py-2 px-3 h-full inline-flex text-sm gap-2 justify-center items-center text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60 outline-none">
          {`${selectedValue || ""}`} {title}
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto right-0 bg-surface-200 border-[1px] border-surface-300 min-w-[150px] flex flex-col text-sm z-10">
          {children}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
