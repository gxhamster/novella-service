import { Fragment } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";

type NGlobalSearchModalProps = {
  isOpen: boolean;
  onModalClose: () => void;
  children: React.ReactNode;
};

export default function NGlobalSearchModal({
  isOpen,
  onModalClose,
  children,
}: NGlobalSearchModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onModalClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        // Add backdrop
        <div className="fixed inset-0 bg-surface-100/70" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex  mt-20 items-start justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full min-w-[45rem] max-w-xl transform overflow-hidden bg-surface-200 text-left align-middle shadow-xl transition-all">
                <Combobox>
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg font-normal leading-6 bg-surface-300/20 text-surface-800 border-b-[1px] border-surface-300 p-4"
                  >
                    {searchSection}
                  </Dialog.Title> */}
                  <section className="text-surface-800">{children}</section>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
