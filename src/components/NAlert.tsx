import { Popover, Transition } from "@headlessui/react";
import { Fragment, createContext, useState } from "react";
import AlertIcon from "./icons/AlertIcon";
import CloseIcon from "./icons/CloseIcon";
import NButton from "./NButton";

interface NAlertProps {
  title: string;
  description: string;
  show: boolean;
  closeAlert: () => void;
  className?: string;
}

type NAlertContent = {
  title: string;
  description: string;
};

export type NAlertContextType = {
  closeAlert: () => void;
  openAlert: () => void;
  isOpen: boolean;
  setContent: ({ title, description }: NAlertContent) => void;
};

export const NAlertContext = createContext<NAlertContextType>({
  closeAlert: () => null,
  openAlert: () => null,
  isOpen: false,
  setContent: ({ title, description }) => null,
});

type NAlertProviderProps = {
  children: React.ReactNode;
};
export function NAlertProvider({ children }: NAlertProviderProps) {
  const [alertContent, setAlertContent] = useState<NAlertContent>({
    title: "",
    description: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <NAlertContext.Provider
      value={{
        isOpen: isAlertOpen,
        closeAlert: () => setIsAlertOpen(false),
        openAlert: () => {
          if (isAlertOpen) setIsAlertOpen(false);
          setIsAlertOpen(true);
        },
        setContent: setAlertContent,
      }}
    >
      {children}
      <NAlert
        title={alertContent.title}
        description={alertContent.description}
        show={isAlertOpen}
        closeAlert={() => setIsAlertOpen(false)}
      />
    </NAlertContext.Provider>
  );
}

function NAlert({
  title,
  description,
  className,
  show,
  closeAlert,
}: NAlertProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Popover as="div" className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-full"
        >
          <Popover.Panel
            className={`fixed top-16 right-4 bg-surface-200 border-l-4 border-alert-600 text-surface-900 pl-6 pr-2 py-5 shadow-md min-w-[20rem] ${className}`}
            role="alert"
          >
            <div className="flex items-start justify-between">
              <section className="flex gap-2 max-w-md">
                <div className="py-1">
                  <AlertIcon size={24} className="text-alert-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="">{title}</p>
                  <p className="text-sm text-surface-800">{description}</p>
                </div>
              </section>
              <NButton
                kind="ghost"
                icon={<CloseIcon size={15} />}
                onClick={closeAlert}
              />
            </div>
          </Popover.Panel>
        </Transition.Child>
      </Popover>
    </Transition>
  );
}
