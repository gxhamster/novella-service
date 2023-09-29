import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

type NDrawerProps = {
  isOpen: boolean;
  closeDrawer: () => void;
  title: string;
  children: React.ReactNode;
};

export default function NDrawer({
  isOpen,
  closeDrawer,
  title,
  children,
}: NDrawerProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeDrawer}>
        // Add backdrop
        <div className="fixed inset-0 bg-surface-100/50" aria-hidden="true" />
        <div className="fixed inset-0 overflow-x-hidden">
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-[400ms]"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition duration-[400ms]"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed right-0 w-full h-screen  flex-grow max-w-2xl transform bg-surface-200 text-left shadow-xl transition-all">
              <Dialog.Title
                as="div"
                className="text-base leading-6 text-surface-900 border-b-[1px] bg-surface-200 border-surface-300 p-4 sticky top-0"
              >
                {title}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
