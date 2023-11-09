import { serverClient } from "@/app/_trpc/serverClient";
import DashboardCard from "../components/DashboardCard";
import IssueStatChart from "./components/IssueStatChart";
import ReturnStatChart from "./components/ReturnStatChart";

export default async function IssueTrend() {
  const issueHistoryResponse =
    await serverClient.history.getIssueHistoryCurrentMonth();
  const returnHistoryResponse =
    await serverClient.history.getReturnHistoryCurrentMonth();

  return (
    <>
      <DashboardCard showHoverEffect={false} className="col-span-2">
        {issueHistoryResponse?.data ? (
          <IssueStatChart data={issueHistoryResponse.data} />
        ) : (
          <p className="text-xl">No data is present</p>
        )}
      </DashboardCard>
      <DashboardCard showHoverEffect={false} className="col-span-2">
        {returnHistoryResponse?.data ? (
          <ReturnStatChart data={returnHistoryResponse.data} />
        ) : (
          <p className="text-xl">No data is present</p>
        )}
      </DashboardCard>
    </>
  );
}
