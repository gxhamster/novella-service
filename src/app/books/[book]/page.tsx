import BookSummary from "./components/BookSummary";
import BookCreate from "./components/BookCreate";
import { serverClient } from "@/app/_trpc/serverClient";

export default async function Book({ params }: { params: { book: string } }) {
  const { data } = await serverClient.books.getBookById(Number(params.book));

  const resultBook = data;

  return (
    <div className="m-16 flex flex-col text-surface-900 gap-y-3">
      {resultBook ? (
        <BookSummary data={resultBook} />
      ) : (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex flex-col bg-surface-200 w-[20rem] p-5 gap-5">
            <span className="text-surface-900">Book does not exist</span>
            <span className="text-surface-700 text-sm">
              Please select a valid book on the database or create a new one
            </span>
            <BookCreate />
          </div>
        </div>
      )}
    </div>
  );
}
