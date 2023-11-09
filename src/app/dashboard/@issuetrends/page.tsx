import { serverClient } from "@/app/_trpc/serverClient";
import DashboardCard from "../components/DashboardCard";
import IssueStatChart from "./components/IssueStatChart";

export default async function IssueTrend() {
  const response = await serverClient.history.getHistoryByDate();

  return (
    <DashboardCard showHoverEffect={false} className="col-span-2">
      {response?.data ? (
        <IssueStatChart data={response.data} />
      ) : (
        <p className="text-xl">No data is present</p>
      )}
    </DashboardCard>
  );
}
