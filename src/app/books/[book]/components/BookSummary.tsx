"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { IBookUpdate } from "@/supabase/types/supabase";
import BookCategoryCard from "./BookCatergoryCard";
import BookDeleteCard from "./BookDeleteCard";
import { trpc } from "@/app/_trpc/client";
import { getBookByIdType } from "@/server/routes/books";
import { TextInput, Button, Title } from "@mantine/core";
import { Toast } from "@/components/Toast";
import NDeleteModal from "@/components/NDeleteModal";

export default function BookSummary({ data }: { data: getBookByIdType }) {
  let defaultInputValues = {};
  Object.assign(defaultInputValues, data);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<getBookByIdType>({
    defaultValues: defaultInputValues,
  });

  const router = useRouter();
  const formWatchedValues = useWatch({ control });
  const [formValuesChangedFromDefault, setFormValuesChangedFromDefault] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const updateBookByIdMutation = trpc.books.updateBookById.useMutation({
    onError: (_error) => {
      Toast.Error({ title: "Cannot update book", message: _error.message });
      throw new Error(_error.message, {
        cause: `Error occured when trying to update book with ID: ${data.id}`,
      });
    },
    onSuccess: () => {
      Toast.Successful({
        title: "Successful",
        message: "Updated book fields",
      });
      router.refresh();
      setFormValuesChangedFromDefault(false);
    },
  });
  const deleteBookByIdMutation = trpc.books.deleteBookById.useMutation({
    onError: (_error) => {
      Toast.Error({ title: "Cannot delete book", message: _error.message });
      throw new Error(_error.message);
    },
    onSuccess: () => {
      router.back();
      setIsDeleteModalOpen(false);
      Toast.Successful({
        title: "Successful",
        message: "Deleted book from library",
      });
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
    field: keyof getBookByIdType;
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
          title: "Times Issued",
          field: "times_issued",
          disabled: true,
        },
        {
          title: "Times Returned",
          field: "times_returned",
          disabled: true,
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
  }, [formWatchedValues, checkIfFieldsChanged]);

  return (
    <div className="relative">
      <div className="flex-grow flex flex-col gap-8 px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <Title order={2} fw="normal" c="dark.1">
                Books / Ref: {data.id}
              </Title>
            </div>
            <div className="flex gap-2">
              <Button
                color="gray"
                size="md"
                disabled={!formValuesChangedFromDefault}
                onClick={(event) => {
                  event.preventDefault();
                  reset(data);
                }}
              >
                Cancel
              </Button>
              <Button
                size="md"
                disabled={!formValuesChangedFromDefault}
                loading={updateBookByIdMutation.isLoading}
                type="submit"
              >
                Update
              </Button>
            </div>
          </div>
          {categories.map((category) => (
            <BookCategoryCard
              key={category.title}
              title={category.title}
              subtitle={category.description}
            >
              {category.fields.map((field) => (
                <TextInput
                  styles={{
                    label: {
                      color: "var(--mantine-color-dark-1)",
                      fontSize: "var(--mantine-font-size-sm)",
                    },
                  }}
                  size="md"
                  key={field.field}
                  label={field.title}
                  {...register(field.field, { disabled: field.disabled })}
                />
              ))}
            </BookCategoryCard>
          ))}
        </form>
        <BookDeleteCard onClick={() => setIsDeleteModalOpen(true)} />
        <NDeleteModal
          title="Delete book from library"
          description="
              This will permanently delete the book from the database and cannot
              be recovered"
          isDeleting={deleteBookByIdMutation.isLoading}
          isOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          onDelete={deleteModalCloseHandler}
        />
      </div>
    </div>
  );
}
