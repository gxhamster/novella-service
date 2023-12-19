import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/app/_trpc/client";
import { format, formatISO } from "date-fns";
import { Modal, Group, Stack, Button, Text, TextInput } from "@mantine/core";
import { Toast } from "@/components/Toast";

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
      Toast.Successful({
        title: "Succcessful",
        message: "Added book to history",
      });
      onBookReturned();
    },
    onError: (_error) => {
      setIsReturnBookModalOpen(false);
      Toast.Error({
        title: "Could not add book to history",
        message: _error.message,
      });
      throw new Error(_error.message);
    },
  });

  const returnButtonHandler: SubmitHandler<ReturnBookForm> = (formData) => {
    if (returnBookID) {
      returnBookMutation.mutate({
        id: returnBookID,
        returned_date: formatISO(new Date(formData.returned_date)),
      });
    }
  };

  return (
    <Modal
      size="lg"
      opened={isReturnBookModalOpen}
      onClose={() => setIsReturnBookModalOpen(false)}
      title="Return the issued book"
      centered
    >
      <form onSubmit={handleSubmit(returnButtonHandler)}>
        <Stack gap={20}>
          <Text size="md" c="dark.2">
            Do you want to return the book from the student to the library?
          </Text>
          <TextInput
            type="datetime-local"
            size="md"
            label="Return date"
            description="Return date will default to today"
            {...register("returned_date")}
          />
          <Group gap={15} justify="end">
            <Button
              variant="default"
              size="md"
              onClick={() => setIsReturnBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              type="submit"
              loading={returnBookMutation.isLoading}
              size="md"
            >
              Return
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
    // <NModal
    //   title="Return the issued book"
    //   isOpen={isReturnBookModalOpen}
    //   onModalClose={() => setIsReturnBookModalOpen(false)}
    // >
    //   <form onSubmit={handleSubmit(returnButtonHandler)}>
    //     <section className="text-surface-700 p-6 flex flex-col gap-3">
    //       <p className="text-sm">
    //         Do you want to return the book from the student to the library ?
    //       </p>
    //       <NovellaInput
    //         type="datetime-local"
    //         title="Return Date"
    //         helpText="Returned date will default to today"
    //         reactHookErrorMessage={errors.returned_date}
    //         reactHookRegister={register("returned_date")}
    //       />
    //     </section>
    //     <section className="flex gap-2 border-t-[1px] border-surface-300 p-2 justify-end">
    //       <NButton
    //         kind="secondary"
    //         size="normal"
    //         title="Cancel"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           setIsReturnBookModalOpen(false);
    //         }}
    //       />
    //       <NButton
    //         kind="primary"
    //         size="normal"
    //         title="Return"
    //         isLoading={returnBookMutation.isLoading}
    //       />
    //     </section>
    //   </form>
    // </NModal>
  );
}
