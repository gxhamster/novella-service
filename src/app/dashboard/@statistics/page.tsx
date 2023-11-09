import BookIcon from "@/components/icons/BookIcon";
import IssueBookIcon from "@/components/icons/IssueBookIcon";
import UnreturnedBookIcon from "@/components/icons/UnreturnedBookIcon";
import UserIcon from "@/components/icons/UserIcon";
import StatCard from "./components/StatCard";
import { serverClient } from "@/app/_trpc/serverClient";

export default async function Statistics() {
  const { count: totalIssuedBooks } =
    await serverClient.history.getTotalHistoryCount();
  const { count: totalUnreturnedBooks } =
    await serverClient.issued.getTotalIssuedBooks();
  const { count: totalStudents } =
    await serverClient.students.getTotalStudents();
  const { count: totalBooks } = await serverClient.books.getTotalBooksCount();

  return (
    <>
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
    </>
  );
}
