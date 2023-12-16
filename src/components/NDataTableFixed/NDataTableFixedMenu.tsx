import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

type NDataTableFixedSortMenuProps = {
  buttonContent: React.ReactNode;
  children: React.ReactNode;
  position?: "left" | "right";
};
export default function NDataTableFixedMenu({
  buttonContent,
  position = "right",
  children,
}: NDataTableFixedSortMenuProps) {
  return (
    <Popover as="div" className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="h-full py-2 px-3 inline-flex text-sm gap-2 justify-center items-center text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60 outline-none">
            {buttonContent}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-5"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-5"
          >
            <Popover.Panel
              static
              className={`absolute ${position}-0 origin-top-${position} mt-1 bg-surface-200 border-[1px] border-surface-300  min-w-[320px] p-3 flex gap-2 flex-col text-sm z-10`}
            >
              {children}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
