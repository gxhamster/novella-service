import { serverClient } from "@/app/_trpc/serverClient";
import DashboardCard from "../components/DashboardCard";
import Link from "next/link";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import NButtonLink from "@/components/NButtonLink";

export default async function PopularBook() {
  const { data: book } = await serverClient.books.getMostPopular();

  return (
    <>
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
    </>
  );
}
