import NModal from "@/components/NModal";
import NButton from "@/components/NButton";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-toastify";

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
  const getIssuedBookByIdQuery = trpc.issued.getIssuedBookById.useQuery(
    returnBookID ? returnBookID : 0
  );

  const deleteIssuedBookByIdMutation =
    trpc.issued.deleteIssuedBookById.useMutation({
      onError: (_error) => {
        toast.error(`Could not return the book: ${_error.message}`);
        throw new Error(_error.message);
      },
    });

  const createHistoryMutation = trpc.history.createHistory.useMutation({
    onSuccess: () => {
      setIsReturnBookModalOpen(false);
      toast.success("Added book to history");
      onBookReturned();
    },
    onError: (_error) => {
      setIsReturnBookModalOpen(false);
      toast.error(`Could not add book to history: ${_error.message}`);
      throw new Error(_error.message);
    },
  });

  const returnButtonHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    // Retrieve Issued Book Details before deleting
    const issuedBook = getIssuedBookByIdQuery.data?.data;

    // Delete book from Issued Table
    if (returnBookID) deleteIssuedBookByIdMutation.mutate(returnBookID);

    if (issuedBook) {
      const historyBookRecord = {
        book_id: issuedBook.book_id,
        student_id: issuedBook.student_id,
        due_date: issuedBook.due_date,
        issued_date: issuedBook.created_at,
        returned_date: new Date().toISOString(),
      };
      // Add Issue Detail to History Table
      createHistoryMutation.mutate(historyBookRecord);
    }

    if (getIssuedBookByIdQuery.isError) {
      throw new Error(getIssuedBookByIdQuery.error.message);
    }
  };

  return (
    <NModal
      title="Return the issued book"
      isOpen={isReturnBookModalOpen}
      onModalClose={() => setIsReturnBookModalOpen(false)}
    >
      <form>
        <section className="text-surface-700 p-6">
          <p className="text-sm">
            Do you want to return the book from the student to the library ?
          </p>
        </section>
        <section className="flex gap-2 border-t-[1px] border-surface-300 p-2 justify-end">
          <NButton
            kind="secondary"
            size="sm"
            title="Cancel"
            onClick={(e) => {
              e.preventDefault();
              setIsReturnBookModalOpen(false);
            }}
          />
          <NButton
            kind="primary"
            size="sm"
            title="Return"
            isLoading={
              deleteIssuedBookByIdMutation.isLoading ||
              createHistoryMutation.isLoading
            }
            onClick={returnButtonHandler}
          />
        </section>
      </form>
    </NModal>
  );
}
