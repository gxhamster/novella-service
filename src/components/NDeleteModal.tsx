import { useState } from "react";
import NModal from "./NModal";
import NButton from "./NButton";
import LoadingIcon from "./icons/LoadingIcon";

type NDeleteModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onDelete: () => Promise<any>;
  title?: string;
  description?: string;
};

export default function NDeleteModal({
  title = "Confirm to delete",
  description = "Are you sure you want to delete the selected rows? This action cannot be undone",
  isOpen,
  closeModal,
  onDelete,
}: NDeleteModalProps) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  return (
    <NModal isOpen={isOpen} title={title} onModalClose={closeModal}>
      <section className="p-4">
        <p className="text-sm text-surface-700">{description}</p>
      </section>
      <section className="flex gap-2 justify-end py-3 border-t-[1px] border-surface-300 px-3">
        <NButton kind="secondary" title="Cancel" onClick={closeModal} />
        <NButton
          kind="alert"
          title="Delete"
          icon={
            isButtonLoading ? (
              <LoadingIcon size={16} className="text-surface-900" />
            ) : null
          }
          onClick={async () => {
            setIsButtonLoading(true);
            await onDelete();
            setIsButtonLoading(false);
          }}
        />
      </section>
    </NModal>
  );
}
