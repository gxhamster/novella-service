"use client";
import { NDrawerCreateForm } from "@/components/NDrawer";
import { IBook } from "@/supabase/types/supabase";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { NDrawerCreateFormFieldsType } from "@/components/NDrawer";
import { format } from "date-fns";
import { Toast } from "@/components/Toast";

const bookFieldCategories: NDrawerCreateFormFieldsType<IBook>[] = [
  {
    title: "Book Fields",
    fields: [
      {
        field: "title",
        fieldType: "string",
        title: "Title",
      },
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
        fieldType: "date",
        help: `Default value will be the time as of now ${new Date().toDateString()}`,
      },
    ],
  },
];

type AddBookDrawerProps = {
  isAddBookDrawerOpen: boolean;
  onAddBookDrawerClosed: () => void;
  onBookAdded: () => void;
};

export default function BookAddDrawer({
  isAddBookDrawerOpen,
  onAddBookDrawerClosed,
  onBookAdded,
}: AddBookDrawerProps) {
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const router = useRouter();

  const bookAddMutation = trpc.books.createBook.useMutation({
    onError: (_error) => {
      Toast.Error({
        title: "Could not create book",
        message: _error.message,
      });
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSettled: () => {
      setSaveButtonLoading(false);
    },
    onSuccess: () => {
      router.refresh();
      Toast.Successful({
        title: "Successful",
        message: "Added a new book to library",
      });
      onBookAdded();
    },
  });

  const addBookToSupabase = async (formData: IBook) => {
    console.log(formData);
    setSaveButtonLoading(true);
    bookAddMutation.mutate(formData);
  };

  return (
    <NDrawerCreateForm<IBook>
      title="Add new book to library"
      saveButtonLoadingState={saveButtonLoading}
      isOpen={isAddBookDrawerOpen}
      onFormSubmit={addBookToSupabase}
      closeDrawer={onAddBookDrawerClosed}
      formFieldsCategories={bookFieldCategories}
      defaultValues={{
        year: new Date().getFullYear(),
        isbn: 0,
        pages: 0,
        created_at: format(new Date(), "yyyy-MM-dd'T'hh:mm"),
      }}
    />
  );
}
