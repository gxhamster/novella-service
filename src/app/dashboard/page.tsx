import BookIcon from "@/components/icons/BookIcon";
import IssueBookIcon from "@/components/icons/IssueBookIcon";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import UserIcon from "@/components/icons/UserIcon";
import StatCard from "./StatCard";
import DashboardIssuedTable from "./DashboardIssuedTable";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { count: totalIssuedBooks } = await supabase
    .from("issued")
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
    <div className="pt-16 px-16 w-full flex flex-col text-surface-900 gap-y-3 overflow-y-auto">
      <span className="text-3xl">Dashboard</span>
      <span className="text-md text-surface-600 font-light">
        View manage your library
      </span>
      <div className="mt-10 flex justify-between">
        <StatCard
          title="Issued Books"
          subtitle="Number of books issued to students"
          stat={totalIssuedBooks}
        >
          <IssueBookIcon />
        </StatCard>
        <StatCard
          title="Unreturned Books"
          subtitle="Books that are not returned back to the library"
          stat={totalUnreturnedBooks}
        >
          <UnreturnedBookIcon />
        </StatCard>
        <StatCard
          title="Students"
          subtitle="Number of students registered in the libraary"
          stat={totalStudents}
        >
          <UserIcon />
        </StatCard>
        <StatCard
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
    </div>
  );
}
