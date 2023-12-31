import BookSummary from "./components/BookSummary";
import BookCreate from "./components/BookCreate";
import { appRouter } from "@/server";
import { createContext } from "@/server/trpc";

export default async function Book({ params }: { params: { book: string } }) {
  const serverClient = appRouter.createCaller(await createContext());
  const { data } = await serverClient.books.getBookById(Number(params.book));

  const resultBook = data;

  return (
    <div className="m-16 flex flex-col text-surface-900 gap-y-3">
      {resultBook ? (
        <BookSummary data={resultBook} />
      ) : (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex flex-col bg-dark-8 w-[20rem] p-5 gap-5">
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
