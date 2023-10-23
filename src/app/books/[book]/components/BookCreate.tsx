"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import { IBook } from "@/supabase/types/supabase";
import {
  NDrawerCreateForm,
  NDrawerCreateFormFieldsType,
} from "@/components/NDrawer";
import { trpc } from "@/app/_trpc/client";

export default function BookCreate() {
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);
  const createBookMutation = trpc.books.createBook.useMutation();

  const bookSubmitHandler = async (formData: IBook) => {
    setSaveButtonLoading(true);
    createBookMutation.mutate(formData);
    setSaveButtonLoading(false);
  };

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
  return (
    <>
      <ButtonPrimary
        title="Create a new book"
        onClick={() => setIsAddBookDrawerOpen(true)}
      />
      <NDrawerCreateForm<IBook>
        title="Add new book to library"
        saveButtonLoadingState={saveButtonLoading}
        isOpen={isAddBookDrawerOpen}
        onFormSubmit={bookSubmitHandler}
        closeDrawer={() => setIsAddBookDrawerOpen(false)}
        formFieldsCategories={bookFieldCategories}
        defaultValues={{
          year: new Date().getFullYear(),
          isbn: 0,
          pages: 0,
          created_at: String(new Date().toISOString()),
        }}
      />
    </>
  );
}
