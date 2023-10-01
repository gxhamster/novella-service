import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

type NModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onModalClose?: () => void;
  title?: string;
  description?: string;
};

export default function NModal({
  isOpen,
  onModalClose = () => null,
  children,
  title,
}: NModalProps) {
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
        <div className="fixed inset-0 bg-surface-100/50" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-surface-200 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-normal leading-6 bg-surface-300/20 text-surface-800 border-b-[1px] border-surface-300 p-4"
                >
                  {title}
                </Dialog.Title>
                <section>{children}</section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
