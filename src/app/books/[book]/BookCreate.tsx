"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import BooksCreateDrawer from "../BooksCreateDrawer";
import { IBook } from "@/types/supabase";
import { addBookToSupabase } from "@/app/api/books/client";

export default function BookCreate() {
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [isAddBookDrawerOpen, setIsAddBookDrawerOpen] = useState(false);

  const bookSubmitHandler = async (formData: IBook) => {
    setSaveButtonLoading(true);
    await addBookToSupabase(formData);
    setSaveButtonLoading(false);
  };

  return (
    <>
      <ButtonPrimary
        title="Create a new book"
        onClick={() => setIsAddBookDrawerOpen(true)}
      />
      <BooksCreateDrawer
        title="Add new book to library"
        saveButtonLoadingState={saveButtonLoading}
        isOpen={isAddBookDrawerOpen}
        onBookFormSubmit={bookSubmitHandler}
        closeModal={() => setIsAddBookDrawerOpen(false)}
      />
    </>
  );
}
