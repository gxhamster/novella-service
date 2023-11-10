import NModal from "@/components/NModal";
import NButton from "@/components/NButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/app/_trpc/client";
import NovellaInput from "@/components/NovellaInput";
import { format, formatISO } from "date-fns";
import NToast from "@/components/NToast";

type ReturnBookModalProps = {
  isReturnBookModalOpen: boolean;
  returnBookID: number | null;
  setIsReturnBookModalOpen: Dispatch<SetStateAction<boolean>>;
  onBookReturned: () => void;
};

export default function ReturnBookModal({
  isReturnBookModalOpen,
  setIsReturnBookModalOpen,
  returnBookID,
  onBookReturned,
}: ReturnBookModalProps) {
  type ReturnBookForm = {
    returned_date: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReturnBookForm>({
    defaultValues: {
      returned_date: format(new Date(), "yyyy-MM-dd'T'hh:mm"),
    },
  });

  const returnBookMutation = trpc.issued.returnIssuedBook.useMutation({
    onSuccess: () => {
      setIsReturnBookModalOpen(false);
      NToast.success("Successful", "Added book to history");
      onBookReturned();
    },
    onError: (_error) => {
      setIsReturnBookModalOpen(false);
      NToast.error("Could not add book to history", `${_error.message}`);
      throw new Error(_error.message);
    },
  });

  // FIXME: Move the intermdiary steps of moving to history to server. Have 1 function that can
  // transfer a issued book to the history
  const returnButtonHandler: SubmitHandler<ReturnBookForm> = (formData) => {
    if (returnBookID) {
      returnBookMutation.mutate({
        id: returnBookID,
        returned_date: formatISO(new Date(formData.returned_date)),
      });
    }
  };

  return (
    <NModal
      title="Return the issued book"
      isOpen={isReturnBookModalOpen}
      onModalClose={() => setIsReturnBookModalOpen(false)}
    >
      <form onSubmit={handleSubmit(returnButtonHandler)}>
        <section className="text-surface-700 p-6 flex flex-col gap-3">
          <p className="text-sm">
            Do you want to return the book from the student to the library ?
          </p>
          <NovellaInput
            type="datetime-local"
            title="Return Date"
            helpText="Returned date will default to today"
            reactHookErrorMessage={errors.returned_date}
            reactHookRegister={register("returned_date")}
          />
        </section>
        <section className="flex gap-2 border-t-[1px] border-surface-300 p-2 justify-end">
          <NButton
            kind="secondary"
            size="normal"
            title="Cancel"
            onClick={(e) => {
              e.preventDefault();
              setIsReturnBookModalOpen(false);
            }}
          />
          <NButton
            kind="primary"
            size="normal"
            title="Return"
            isLoading={returnBookMutation.isLoading}
          />
        </section>
      </form>
    </NModal>
  );
}
