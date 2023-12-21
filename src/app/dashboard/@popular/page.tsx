import { serverClient } from "@/app/_trpc/serverClient";
import DashboardCard from "../components/DashboardCard";
import Link from "next/link";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";
import NButtonLink from "@/components/NButtonLink";
import { Anchor } from "@mantine/core";

export default async function PopularBook() {
  const { data: book } = await serverClient.books.getMostPopular();
  const { data: student } = await serverClient.students.getMostPopular();

  return (
    <>
      <DashboardCard className="col-span-2">
        {book ? (
          <>
            <div className="flex justify-between mb-3">
              <span className="text-surface-800 group-hover:text-surface-900">
                Most popular book
              </span>
              <Anchor href="/books" size="sm" />
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
      <DashboardCard className="col-span-2">
        <div className="flex justify-between mb-3">
          <span className="text-surface-800 group-hover:text-surface-900">
            Most popular student
          </span>
          <Anchor href="/students" size="sm" />
        </div>
        <span className="text-5xl font-light mt-2">{student.count}</span>
        <span className="text-surface-600 text-sm gap- group-hover:text-surface-900">
          Times borrowed
        </span>
        <span className="text-xl group-hover:text-surface-900 text-surface-800 mt-3">
          {student.name}
        </span>
        <div className="flex justify-end items-end">
          <NButtonLink
            kind="default"
            size="default"
            href={`/students/${student.student_id}`}
            className="hover:translate-x-2 transition-transform text-surface-500 group-hover:text-surface-900"
            icon={<LeftArrowIcon />}
          />
        </div>
      </DashboardCard>
    </>
  );
}
