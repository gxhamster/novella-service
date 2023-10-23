import BookIcon from "@/components/icons/BookIcon";
import IssueBookIcon from "@/components/icons/IssueBookIcon";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import UserIcon from "@/components/icons/UserIcon";
import StatCard from "../components/StatCard";
import { serverClient } from "@/app/_trpc/serverClient";
import DashboardCard from "../components/DashboardCard";
import Link from "next/link";
import { IBook } from "@/supabase/types/supabase";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import NButtonLink from "@/components/NButtonLink";

type PopularBookProps = {
  book: IBook | null;
};

function PopularBook({ book }: PopularBookProps) {
  return (
    <DashboardCard className="col-span-2">
      {book ? (
        <>
          <div className="flex justify-between mb-3">
            <span className="text-surface-800 group-hover:text-surface-900">
              Most popular book
            </span>
            <Link
              href="/books"
              className="text-sm text-primary-700 group-hover:text-surface-900 hover:underline"
            >
              View all
            </Link>
          </div>
          <span className="text-5xl font-light mt-2">
            {book.times_issued ? book.times_issued : 0}
          </span>
          <span className="text-surface-600 text-sm gap- group-hover:text-surface-900">
            Times issued
          </span>
          <span className="text-xl group-hover:text-surface-900 text-surface-800 mt-3">
            {book.title}
          </span>
          <div className="flex justify-between items-end">
            <div className="flex gap-2 items-end">
              <span className="text-lg group-hover:text-surface-900 text-surface-700">
                {book.author}
              </span>
              <span className="text-surface-600 group-hover:text-surface-900">
                {book.genre}
              </span>
            </div>
            <NButtonLink
              kind="default"
              size="default"
              href={`/books/${book.id}`}
              className="hover:translate-x-2 transition-transform text-surface-500 group-hover:text-surface-900"
              icon={<LeftArrowIcon />}
            />
          </div>
        </>
      ) : (
        <span className="">No popular book</span>
      )}
    </DashboardCard>
  );
}

export default async function Statistics() {
  const { count: totalIssuedBooks } =
    await serverClient.history.getTotalHistoryCount();
  const { count: totalUnreturnedBooks } =
    await serverClient.issued.getTotalIssuedBooks();
  const { count: totalStudents } =
    await serverClient.students.getTotalStudents();
  const { count: totalBooks } = await serverClient.books.getTotalBooksCount();
  const { data: mostPopularBook } = await serverClient.books.getMostPopular();

  return (
    <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-8">
      <StatCard
        href="/issued/history"
        title="Issued Books"
        subtitle="Number of books issued to students"
        stat={totalIssuedBooks}
      >
        <IssueBookIcon />
      </StatCard>
      <StatCard
        href="/issued"
        title="Unreturned Books"
        subtitle="Books that are not returned back to the library"
        stat={totalUnreturnedBooks}
      >
        <UnreturnedBookIcon />
      </StatCard>
      <StatCard
        href="/students"
        title="Students"
        subtitle="Number of students registered in the libraary"
        stat={totalStudents}
      >
        <UserIcon />
      </StatCard>
      <StatCard
        href="/books"
        title="Books"
        subtitle="Number of books added to library"
        stat={totalBooks}
      >
        <BookIcon />
      </StatCard>
      <PopularBook book={mostPopularBook} />
    </div>
  );
}
