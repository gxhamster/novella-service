import ButtonGhost from "@/components/ButtonGhost";
import ButtonPrimary from "@/components/ButtonPrimary";
import NDrawer from "@/components/NDrawer";
import NovellaInput from "@/components/NovellaInput";
import LoadingIcon from "@/components/icons/LoadingIcon";
import { IBook } from "@/types/supabase";
import { SubmitHandler, useForm } from "react-hook-form";

type BooksCreateDrawer = {
  isOpen: boolean;
  onBookFormSubmit: (formData: IBook) => void;
  closeModal: () => void;
  saveButtonLoadingState: boolean;
  title: string;
};

export default function BooksCreateDrawer({
  isOpen,
  onBookFormSubmit,
  saveButtonLoadingState,
  closeModal,
  title,
}: BooksCreateDrawer) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: {
      year: new Date().getFullYear(),
      isbn: 0,
      pages: 0,
      created_at: String(new Date().toISOString()),
    },
  });

  const onSubmit: SubmitHandler<IBook> = (formData) => {
    onBookFormSubmit(formData);
  };

  type BookFields = {
    title: string;
    description?: string;
    fields: Array<{
      field: keyof IBook;
      title: string;
      help?: string;
      fieldType: "number" | "string";
      disabled?: boolean;
    }>;
  };
  const bookFieldCategories: BookFields[] = [
    {
      title: "",
      fields: [
        {
          field: "id",
          title: "ID",
          help: "ID will be automatically set by the system",
          fieldType: "number",
          disabled: true,
        },
        {
          field: "created_at",
          title: "Created At",
          fieldType: "string",
          help: `Default value will be the time as of now ${new Date().toDateString()}`,
        },
        {
          field: "title",
          fieldType: "string",
          title: "Title",
        },
      ],
    },
    {
      title: "Publisher Fields",
      description:
        "These are fields that are related to the publisher of the book",
      fields: [
        {
          fieldType: "string",
          field: "publisher",
          title: "Publisher",
        },
        {
          fieldType: "string",
          field: "edition",
          title: "Edition",
        },
        {
          fieldType: "number",
          field: "year",
          title: "Year",
        },
      ],
    },
    {
      title: "Identification Fields",
      description: "These fields are used to identify the book",
      fields: [
        {
          fieldType: "string",
          field: "ddc",
          title: "DDC",
        },
        {
          fieldType: "number",
          field: "isbn",
          title: "ISBN",
        },
      ],
    },
    {
      title: "Misc Fields",
      fields: [
        {
          fieldType: "string",
          field: "author",
          title: "Author",
        },
        {
          fieldType: "string",
          field: "genre",
          title: "Genre",
        },
        {
          fieldType: "number",
          field: "pages",
          title: "Pages",
        },
      ],
    },
  ];

  return (
    <NDrawer isOpen={isOpen} closeDrawer={closeModal} title={title}>
      <div className="flex flex-col justify-between h-[calc(100vh-57px)] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {bookFieldCategories.map((category) => (
            <div className="flex flex-col gap-7 border-b-[1px] border-surface-300 p-6">
              {category.title || category.description ? (
                <section className="flex flex-col gap-2">
                  <h3 className="text-md text-surface-800">{category.title}</h3>
                  <span className="text-sm text-surface-500">
                    {category.description}
                  </span>
                </section>
              ) : null}
              {category.fields.map((field) => (
                <NovellaInput
                  type="text"
                  fontSize="xs"
                  helpText={field.help}
                  reactHookErrorMessage={errors[field.field]}
                  reactHookRegister={register(field.field, {
                    valueAsNumber: field.fieldType === "number" ? true : false,
                    disabled: saveButtonLoadingState ? true : field.disabled,
                  })}
                  labelDirection="horizontal"
                  title={field.title}
                />
              ))}
            </div>
          ))}
          <div className="flex justify-end p-3 gap-2">
            <ButtonGhost
              title="Cancel"
              onClick={(e) => {
                e.preventDefault();
                reset();
                closeModal();
              }}
            />
            <ButtonPrimary
              disabled={saveButtonLoadingState}
              icon={
                saveButtonLoadingState ? (
                  <LoadingIcon className="text-surface-900" size={18} />
                ) : null
              }
              title="Save"
            />
          </div>
        </form>
      </div>
    </NDrawer>
  );
}
