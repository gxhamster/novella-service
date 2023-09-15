import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BookSummary from "./BookSummary";
import { Database } from "@/types/supabase";
import ButtonPrimary from "@/components/ButtonPrimary";

export const dynamic = "force-dynamic";

export default async function Book({ params }: { params: { book: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", Number(params.book));

  if (error) {
    throw new Error(error.message);
  }

  const resultBook = data ? data[0] : null;
  return (
    <div className="pt-16 px-16 w-full flex flex-col text-surface-900 gap-y-3 min-h-full">
      {resultBook ? (
        <BookSummary data={resultBook} />
      ) : (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex flex-col bg-surface-200 w-[20rem] p-5 gap-5">
            <span className="text-surface-900">Book does not exist</span>
            <span className="text-surface-700 text-sm">
              Please select a valid book on the database or create a new one
            </span>
            <ButtonPrimary title="Create a new book" />
          </div>
        </div>
      )}
    </div>
  );
}
