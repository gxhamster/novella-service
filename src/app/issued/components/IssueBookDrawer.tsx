import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IIssuedBook } from "@/supabase/types/supabase";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import SelectBookDrawer from "./SelectBookDrawer";
import SelectStudentDrawer from "./SelectStudentDrawer";
import { trpc } from "@/app/_trpc/client";
import NToast from "@/components/NToast";
import { getBooksByPageType } from "@/server/routes/books";
import { getStudentsByPageType } from "@/server/routes/student";
import { format, formatISO } from "date-fns";
import { Button, Drawer, TextInput, Text, ActionIcon } from "@mantine/core";
import { Toast } from "@/components/Toast";

type IssueBookDrawerProps = {
  isIssueBookDrawerOpen: boolean;
  setIsIssueBookDrawerOpen: Dispatch<SetStateAction<boolean>>;
  onBookIssued: () => void;
};

export default function IssueBookDrawer({
  isIssueBookDrawerOpen,
  setIsIssueBookDrawerOpen,
  onBookIssued,
}: IssueBookDrawerProps) {
  const [selectedBook, setSelectedBook] = useState<getBooksByPageType | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] =
    useState<getStudentsByPageType | null>(null);
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [isAddStudentDrawerOpen, setIsAddStudentDrawerOpen] = useState(false);
  const createIssuedBookMutation = trpc.issued.createIssuedBook.useMutation({
    onError: (_error) => {
      Toast.Error({
        title: "Cannot Issue Book",
        message: _error.message,
      });
      throw new Error(_error.message);
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Successful",
        message: "Issued a new book",
      });
      onBookIssued();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<IIssuedBook>({
    defaultValues: {
      created_at: format(new Date(), "yyyy-MM-dd'T'hh:mm"),
      student_id: useMemo(
        () => (selectedStudent ? selectedStudent.id : 0),
        [selectedStudent]
      ),
      book_id: useMemo(
        () => (selectedBook ? selectedBook.id : 0),
        [selectedBook]
      ),
      due_date: useMemo(() => {
        const days = 5;
        const date = new Date();
        date.setDate(date.getDate() + days);
        return format(date, "yyyy-MM-dd'T'hh:mm");
      }, []),
    },
  });

  function issueBookFormSubmitHandler(formData: IIssuedBook) {
    if (formData.created_at && formData.due_date) {
      formData.created_at = formatISO(new Date(formData.created_at));
      formData.due_date = formatISO(new Date(formData.due_date));
      createIssuedBookMutation.mutate(formData);
      onBookIssued();
    } else {
      throw new Error("Created at and Due Date cannot be null");
    }
  }

  return (
    <>
      <Drawer
        title="Issue book to student"
        position="right"
        size="lg"
        opened={isIssueBookDrawerOpen}
        onClose={() => {
          !isAddBookDrawerOpen &&
            !isAddStudentDrawerOpen &&
            setIsIssueBookDrawerOpen(false);
        }}
      >
        <form
          onSubmit={handleSubmit(issueBookFormSubmitHandler)}
          className="h-full flex flex-col items-center overflow-y-auto"
        >
          <section className="flex flex-col p-6 w-full gap-7 border-b-[1px] border-surface-300">
            <TextInput
              disabled
              size="md"
              placeholder="325"
              label="Issue ID"
              description="Issue ID will be assigned by the system"
              {...register("id")}
            />
            <TextInput
              type="datetime-local"
              size="md"
              label="Issued Date"
              description="Issue ID will be assigned by the system"
              {...register("created_at")}
            />
            <TextInput
              type="datetime-local"
              size="md"
              label="Due Date"
              description="The date 5 days from now will be used by default"
              {...register("due_date")}
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <Text size="lg" c="dark.1">
              Book Fields
            </Text>
            <TextInput
              size="md"
              label="Book ID"
              description="This will be the book that is issued. Select from the table"
              rightSection={
                <ActionIcon
                  color="dark.5"
                  size={32}
                  onClick={(event) => {
                    event.preventDefault();
                    setIsAddBookDrawerOpen(true);
                  }}
                >
                  <LeftArrowIcon size={18} />
                </ActionIcon>
              }
              {...register("book_id", {
                valueAsNumber: true,
              })}
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <Text size="lg" c="dark.1">
              Student Fields
            </Text>
            <TextInput
              size="md"
              label="Student ID"
              description="This will be the student that book will issued to. Select from the table"
              rightSection={
                <ActionIcon
                  color="dark.5"
                  size={32}
                  onClick={(event) => {
                    event.preventDefault();
                    setIsAddStudentDrawerOpen(true);
                  }}
                >
                  <LeftArrowIcon size={18} />
                </ActionIcon>
              }
              {...register("student_id", {
                valueAsNumber: true,
              })}
            />
          </section>
          <section className="flex justify-end gap-3 p-3 w-full ">
            <Button
              variant="light"
              size="md"
              color="gray"
              onClick={(event) => {
                event.preventDefault();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              size="md"
              loading={createIssuedBookMutation.isLoading}
              type="submit"
              disabled={
                !isDirty && !isValid && createIssuedBookMutation.isLoading
              }
            >
              Issue Book
            </Button>
          </section>
        </form>
      </Drawer>
      <SelectBookDrawer
        setSelectedBook={setSelectedBook}
        isAddBookDrawerOpen={isAddBookDrawerOpen}
        setIsAddBookDrawerOpen={setIsAddBookDrawerOpen}
        formSetValue={setValue}
      />
      <SelectStudentDrawer
        setSelectedStudent={setSelectedStudent}
        isAddStudentDrawerOpen={isAddStudentDrawerOpen}
        setIsAddStudentDrawerOpen={setIsAddStudentDrawerOpen}
        formSetValue={setValue}
      />
    </>
  );
}
