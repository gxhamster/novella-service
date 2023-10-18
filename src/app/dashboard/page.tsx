import BookIcon from "@/components/icons/BookIcon";
import IssueBookIcon from "@/components/icons/IssueBookIcon";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import UserIcon from "@/components/icons/UserIcon";
import StatCard from "./StatCard";
import DashboardIssuedTable from "./DashboardIssuedTable";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AddIcon from "@/components/icons/AddIcon";
import NButtonLink from "@/components/NButtonLink";

export default async function Dashboard() {
  // FIXME: Move to server
  const supabase = createServerComponentClient({ cookies });
  const { count: totalIssuedBooks } = await supabase
    .from("history")
    .select("*", { count: "exact", head: true });
  const { count: totalUnreturnedBooks } = await supabase
    .from("issued")
    .select("*", { count: "exact", head: true });
  const { count: totalBooks } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  return (
    <div className="my-16 mx-auto px-16 w-full flex flex-col text-surface-900 gap-y-3">
      <section className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-3xl">Dashboard</span>
          <span className="text-md text-surface-600 font-light">
            View manage your library
          </span>
        </div>
        <NButtonLink
          href="/dashboard/issued"
          kind="primary"
          title="Issue book"
          size="normal"
          icon={<AddIcon size={20} />}
        />
      </section>
      <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-8">
        <StatCard
          href="/dashboard/history"
          title="Issued Books"
          subtitle="Number of books issued to students"
          stat={totalIssuedBooks}
        >
          <IssueBookIcon />
        </StatCard>
        <StatCard
          href="/dashboard/issued"
          title="Unreturned Books"
          subtitle="Books that are not returned back to the library"
          stat={totalUnreturnedBooks}
        >
          <UnreturnedBookIcon />
        </StatCard>
        <StatCard
          href="/dashboard/students"
          title="Students"
          subtitle="Number of students registered in the libraary"
          stat={totalStudents}
        >
          <UserIcon />
        </StatCard>
        <StatCard
          href="/dashboard/books"
          title="Books"
          subtitle="Number of books added to library"
          stat={totalBooks}
        >
          <BookIcon />
        </StatCard>
      </div>
      <div className="mt-10">
        <span className="text-1xl text-surface-800">Recently Issued Books</span>
        <div className="mt-10">
          <div className="bg-surface-200 w-full m-0">
            <DashboardIssuedTable />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <span className="text-1xl text-surface-800">Recently Issued Books</span>
        <div className="mt-10">
          <div className="bg-surface-200 w-full m-0">
            <DashboardIssuedTable />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <span className="text-1xl text-surface-800">Recently Issued Books</span>
        <div className="mt-10">
          <div className="bg-surface-200 w-full m-0">
            <DashboardIssuedTable />
          </div>
        </div>
      </div>
    </div>
  );
}
