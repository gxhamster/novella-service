import { IBook } from "@/types/supabase";

export const addBookToSupabase = async (formData: IBook) => {
  const { _, error } = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((res) => res.json());

  if (error) {
    throw new Error(error.message);
  }
};
