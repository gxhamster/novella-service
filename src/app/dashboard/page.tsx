import BookIcon from "@/components/icons/BookIcon";
import IssueBookIcon from "@/components/icons/IssueBookIcon";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import UserIcon from "@/components/icons/UserIcon";
import StatCard from "./StatCard";
import NovellaDataTable from "@/components/NovellaDataTable";
import { getIssuedBooks } from "@/supabase/db";

export default async function Dashboard() {
  const { issued, error } = await getIssuedBooks();
  const issuedBooks = issued?.map((books) => {
    const newObj = {
      id: books.id,
      student_name: books.students.name,
      title: books.books.title,
      issue_date: books.created_at,
      due_date: books.due_date,
    };

    return newObj;
  });

  return (
    <div className="pt-16 px-16 w-full flex flex-col text-surface-900 gap-y-3">
      <span className="text-3xl">Dashboard</span>
      <span className="text-md text-surface-600 font-light">
        View manage your library
      </span>
      <div className="mt-10 flex justify-between">
        <StatCard
          title="Issued Books"
          subtitle="Number of books issued to students"
          stat="57"
        >
          <IssueBookIcon />
        </StatCard>
        <StatCard
          title="Unreturned Books"
          subtitle="Books that are not returned back to the library"
          stat="5"
        >
          <UnreturnedBookIcon />
        </StatCard>
        <StatCard
          title="Students"
          subtitle="Number of students registered in the libraary"
          stat="342"
        >
          <UserIcon />
        </StatCard>
        <StatCard
          title="Books"
          subtitle="Number of books added to library"
          stat="1067"
        >
          <BookIcon />
        </StatCard>
      </div>
      <div className="mt-10">
        <span className="text-1xl text-surface-800">Recently Issued Books</span>
        <div className="mt-10">
          <div className="bg-surface-200 w-full m-0">
            <NovellaDataTable<typeof issuedBooks>
              data={issuedBooks}
              headers={[
                "ID",
                "Student Name",
                "Title",
                "Issued Date",
                "Due Date",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
