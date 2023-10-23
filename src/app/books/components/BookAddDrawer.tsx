"use client";
import { NDrawerCreateForm } from "@/components/NDrawer";
import { IBook } from "@/supabase/types/supabase";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { NDrawerCreateFormFieldsType } from "@/components/NDrawer";
import NToast from "@/components/NToast";

const bookFieldCategories: NDrawerCreateFormFieldsType<IBook>[] = [
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
      NToast.error("Could not create book", `${_error.message}`);
      throw new Error(_error.message, {
        cause: _error.shape?.data,
      });
    },
    onSettled: () => {
      setSaveButtonLoading(false);
    },
    onSuccess: () => {
      router.refresh();
      NToast.success("Successful", "Added a new book to library");
      onBookAdded();
    },
  });

  const addBookToSupabase = async (formData: IBook) => {
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
        created_at: String(new Date().toISOString()),
      }}
    />
  );
}
