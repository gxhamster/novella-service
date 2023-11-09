import DashboardIssuedTable from "./components/DashboardIssuedTable";

export default async function RecentlyIssued() {
  return (
    <div className="mt-10">
      <span className="text-1xl text-surface-800">Recently Issued Books</span>
      <div className="mt-10">
        <div className="bg-surface-200 w-full m-0">
          <DashboardIssuedTable />
        </div>
      </div>
    </div>
  );
}
