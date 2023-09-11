import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BookSummary from "./BookSummary";

export default async function Book({ params }: { params: { book: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", Number(params.book));
  const resultBook = data ? data[0] : null;
  console.log("=== Called from [book] ===", resultBook, data);
  return (
    <div className="pt-16 px-16 w-full flex flex-col text-surface-900 gap-y-3">
      {resultBook ? (
        <BookSummary data={resultBook} />
      ) : (
        <div>Cannot find the requested book</div>
      )}
    </div>
  );
}
