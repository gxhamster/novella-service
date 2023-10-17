"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import NovellaInput from "@/components/NovellaInput";
import { IBook, IBookUpdate } from "@/supabase/types/supabase";
import BookCategoryCard from "./BookCatergoryCard";
import BookDeleteCard from "./BookDeleteCard";
import { trpc } from "@/app/_trpc/client";
import NButton from "@/components/NButton";
import NDeleteModal from "@/components/NDeleteModal";
import { toast } from "react-toastify";

export default function BookSummary({ data }: { data: IBook }) {
  let defaultInputValues = {};
  Object.assign(defaultInputValues, data);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: defaultInputValues,
  });

  const router = useRouter();
  const formWatchedValues = useWatch({ control });
  const [formValuesChangedFromDefault, setFormValuesChangedFromDefault] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const updateBookByIdMutation = trpc.books.updateBookById.useMutation({
    onError: (_error) => {
      toast.error(`Cannot update book: ${_error.message}`);
      throw new Error(_error.message, {
        cause: `Error occured when trying to update book with ID: ${data.id}`,
      });
    },
    onSuccess: () => {
      toast.success("Succesfully updated book fields");
      router.refresh();
      setFormValuesChangedFromDefault(false);
    },
  });
  const deleteBookByIdMutation = trpc.books.deleteBookById.useMutation({
    onError: (_error) => {
      toast.error(`Cannot delete book: ${_error.message}`);
      throw new Error(_error.message);
    },
    onSuccess: () => {
      router.back();
      setIsDeleteModalOpen(false);
      toast.success("Succesfully deleted the book");
    },
  });

  function removeEmptyFields(formData: IBookUpdate) {
    (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
      formData[key] === undefined && delete formData[key];
    });

    let filteredFormData = formData;
    filteredFormData.id = Number(data.id);
    return filteredFormData;
  }

  const onSubmit: SubmitHandler<IBookUpdate> = async (
    formData: IBookUpdate
  ) => {
    // Updaing database with update fields
    const emptyFieldsRemoved = removeEmptyFields(formData);
    updateBookByIdMutation.mutate(emptyFieldsRemoved);
  };

  const deleteModalCloseHandler = async () => {
    deleteBookByIdMutation.mutate(data.id);
  };

  type BookField = {
    title: string;
    field: keyof IBook;
    disabled: boolean;
  };

  type BookCategory = {
    title: string;
    description: string;
    fields: BookField[];
  };

  const categories: BookCategory[] = [
    {
      title: "General information",
      description: "Edit the general information about the book",
      fields: [
        {
          title: "Title",
          field: "title",
          disabled: false,
        },
        {
          title: "Author",
          field: "author",
          disabled: false,
        },
        {
          title: "Reference ID",
          field: "id",
          disabled: true,
        },
        {
          title: "Created Date",
          field: "created_at",
          disabled: true,
        },
      ],
    },
    {
      title: "Publisher information",
      description: "Edit the publisher information about the book",
      fields: [
        {
          title: "Publisher",
          field: "publisher",
          disabled: false,
        },
        {
          title: "Edition",
          field: "edition",
          disabled: false,
        },
        {
          title: "Year",
          field: "year",
          disabled: false,
        },
      ],
    },
    {
      title: "Identification",
      description: "Edit the information used to identify the book",
      fields: [
        {
          title: "ISBN",
          field: "isbn",
          disabled: false,
        },
        {
          title: "DDC",
          field: "ddc",
          disabled: false,
        },
      ],
    },
    {
      title: "Miscellaneous",
      description: "Edit other informatio about the book",
      fields: [
        {
          title: "Genre",
          field: "genre",
          disabled: false,
        },
        {
          title: "Language",
          field: "language",
          disabled: false,
        },
        {
          title: "Pages",
          field: "pages",
          disabled: false,
        },
      ],
    },
    {
      title: "User Information",
      description: "The user who created the book",
      fields: [
        {
          title: "User ID",
          field: "user_id",
          disabled: true,
        },
      ],
    },
  ];

  function checkIfFieldsChanged() {
    let key: keyof typeof formWatchedValues;
    let result = false;
    for (key in formWatchedValues) {
      if (formWatchedValues[key] != undefined) {
        if (formWatchedValues[key] !== data[key]) result = true;
      }
    }

    return result;
  }

  // Check whether the input values are same as the default values
  useEffect(() => {
    const result = checkIfFieldsChanged();
    setFormValuesChangedFromDefault(result);
  }, [formWatchedValues]);

  return (
    <div className="relative">
      <div className="flex-grow flex flex-col gap-8 px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl text-surface-700 font-light">
                Books / Ref:{" "}
                <span className="text-surface-900 text-3xl"> {data.id}</span>
              </h3>
            </div>
            <div className="flex gap-2">
              <NButton
                kind="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  reset(data);
                }}
                disabled={!formValuesChangedFromDefault}
                title="Cancel"
              />
              <NButton
                kind="primary"
                disabled={!formValuesChangedFromDefault}
                title="Save"
              />
            </div>
          </div>
          {categories.map((category) => (
            <BookCategoryCard
              key={category.title}
              title={category.title}
              subtitle={category.description}
            >
              {category.fields.map((field) => (
                <NovellaInput
                  key={field.field}
                  type="text"
                  title={field.title}
                  reactHookRegister={register(field.field, {
                    disabled: field.disabled,
                  })}
                  reactHookErrorMessage={errors[field.field]}
                ></NovellaInput>
              ))}
            </BookCategoryCard>
          ))}
        </form>
        <BookDeleteCard onClick={() => setIsDeleteModalOpen(true)} />
        <NDeleteModal
          isOpen={isDeleteModalOpen}
          description="This will permanently delete the book from the database and cannot be recovered"
          isDeleting={deleteBookByIdMutation.isLoading}
          closeModal={() => setIsDeleteModalOpen(false)}
          onDelete={deleteModalCloseHandler}
        />
      </div>
    </div>
  );
}
