import NModal from "@/components/NModal";
import NButton from "@/components/NButton";
import { Dispatch, SetStateAction } from "react";

type ReturnBookModalProps = {
  isReturnBookModalOpen: boolean;
  returnBookID: number | undefined;
  setIsReturnBookModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ReturnBookModal({
  isReturnBookModalOpen,
  setIsReturnBookModalOpen,
  returnBookID,
}: ReturnBookModalProps) {
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
            onClick={async (e) => {
              e.preventDefault();
              // Retrieve Issued Book Details before deleting
              const { data: issuedBook, error: issuedBookError } = await fetch(
                `/api/issued?id=${returnBookID}`
              ).then((res) => res.json());
              // First Delete book from Issued Table
              const { error } = await fetch(`/api/issued?id=${returnBookID}`, {
                method: "DELETE",
                body: JSON.stringify({ ids: [returnBookID] }),
              }).then((res) => res.json());

              // Add Issue Detail to History Table
              const historyBookRecord = {
                book_id: issuedBook.book_id,
                student_id: issuedBook.student_id,
                due_date: issuedBook.due_date,
                issued_date: issuedBook.created_at,
                returned_date: new Date().toISOString(),
              };
              const { data: historyBook, error: historyBookError } =
                await fetch(`/api/issued/history`, {
                  method: "POST",
                  body: JSON.stringify(historyBookRecord),
                }).then((res) => res.json());

              if (error || issuedBookError || historyBookError)
                throw new Error(error.message);

              setIsReturnBookModalOpen(false);
            }}
          />
        </section>
      </form>
    </NModal>
  );
}
