import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import NDrawer from "@/components/NDrawer";
import { IIssuedBook, IBook, IStudent } from "@/supabase/types/supabase";
import NovellaInput from "@/components/NovellaInput";
import NButton from "@/components/NButton";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import SelectBookDrawer from "./SelectBookDrawer";
import SelectStudentDrawer from "./SelectStudentDrawer";
import { useContext } from "react";
import { NAlertContext } from "@/components/NAlert";
import LoadingIcon from "@/components/icons/LoadingIcon";

type IssueBookDrawerProps = {
  isIssueBookDrawerOpen: boolean;
  setIsIssueBookDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function IssueBookDrawer({
  isIssueBookDrawerOpen,
  setIsIssueBookDrawerOpen,
}: IssueBookDrawerProps) {
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const [isAddStudentDrawerOpen, setIsAddStudentDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setContent, openAlert, isOpen } = useContext(NAlertContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<IIssuedBook>({
    defaultValues: {
      created_at: new Date().toISOString(),
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
        return date.toISOString();
      }, []),
    },
  });

  function issueBookFormSubmitHandler(formData: IIssuedBook) {
    setIsSubmitting(true);
    const postToSupbase = async () => {
      const { data, error } = await fetch("/api/issued", {
        method: "POST",
        body: JSON.stringify(formData),
      }).then((response) => response.json());
      setIsSubmitting(false);

      if (error) {
        setContent({ title: "Cannot issue book", description: error.message });
        openAlert();
        throw new Error(error.message);
      }
    };
    postToSupbase();
  }

  return (
    <>
      <NDrawer
        title="Issue book to student"
        isOpen={isIssueBookDrawerOpen}
        closeDrawer={() =>
          !isOpen &&
          !isAddBookDrawerOpen &&
          !isAddStudentDrawerOpen &&
          setIsIssueBookDrawerOpen(false)
        }
      >
        <form
          onSubmit={handleSubmit(issueBookFormSubmitHandler)}
          className="h-full flex flex-col items-center overflow-y-auto"
        >
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <NovellaInput
              title="ID"
              disabled
              helpText="Issue ID will be assigned by the system"
              labelDirection="horizontal"
              reactHookRegister={register("id")}
              reactHookErrorMessage={errors["id"]}
            />
            <NovellaInput
              title="Issued Date"
              helpText="The current time will be used if not date is given"
              labelDirection="horizontal"
              reactHookRegister={register("created_at", {
                required: "Issue date is required",
              })}
              reactHookErrorMessage={errors["created_at"]}
            />
            <NovellaInput
              title="Due Date"
              helpText="The date 5 days from now will be used by default"
              labelDirection="horizontal"
              reactHookRegister={register("due_date", {
                required: "Due date is required",
              })}
              reactHookErrorMessage={errors["due_date"]}
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <h3 className="text-md text-surface-800">Book Fields</h3>
            <NovellaInput
              title="Book ID"
              helpText="This will be the book that is issued. Select from the table"
              labelDirection="horizontal"
              reactHookRegister={register("book_id", {
                valueAsNumber: true,
                required: "A book needs to be selected",
              })}
              reactHookErrorMessage={errors["book_id"]}
              suffixContent={
                <NButton
                  kind="secondary"
                  size="xs"
                  title="Select book"
                  icon={<LeftArrowIcon size={10} />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddBookDrawerOpen(true);
                  }}
                />
              }
            />
          </section>
          <section className="flex flex-col p-6 w-full gap-4 border-b-[1px] border-surface-300">
            <h3 className="text-md text-surface-800">Student Fields</h3>
            <NovellaInput
              title="Student ID"
              helpText="This will be the student the book is issued to. Select from the table"
              labelDirection="horizontal"
              reactHookRegister={register("student_id", {
                valueAsNumber: true,
                required: "A student needs to be selected",
              })}
              reactHookErrorMessage={errors["student_id"]}
              suffixContent={
                <NButton
                  kind="secondary"
                  size="xs"
                  title="Select student"
                  icon={<LeftArrowIcon size={10} />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddStudentDrawerOpen(true);
                  }}
                />
              }
            />
          </section>
          <section className="flex justify-end gap-3 p-3 w-full border-b-[1px] border-surface-300">
            <NButton
              title="Cancel"
              kind="secondary"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            />
            <NButton
              title="Issue Book"
              kind="primary"
              icon={
                isSubmitting ? (
                  <LoadingIcon className="text-surface-900" size={16} />
                ) : null
              }
              disabled={!isDirty && !isValid && isSubmitting}
            />
          </section>
        </form>
      </NDrawer>
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
