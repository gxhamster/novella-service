import BooksTable from "./BooksTable";

export default async function Books() {
  return (
    <div className="px-16 w-full flex flex-col text-surface-900 gap-y-3 m-0">
      <BooksTable />
    </div>
  );
}
