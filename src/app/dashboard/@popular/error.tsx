"use client";

import AlertIcon from "@/components/icons/AlertIcon";
import DashboardCard from "../components/DashboardCard";

type ErrorProps = {
  error: Error;
};

function ErrorCard() {
  return (
    <DashboardCard className="col-span-2 justify-center items-center">
      <AlertIcon
        size={50}
        className="text-surface-800 mb-3 group-hover:text-surface-900"
      />
      <span className="text-xl block group-hover:text-surface-900">
        Error Has Occured
      </span>
      <span className="text-surface-700 group-hover:text-surface-900">
        Could not retreive results from server
      </span>
    </DashboardCard>
  );
}

export default function Error({ error }: ErrorProps) {
  return (
    <>
      <ErrorCard />
      <ErrorCard />
    </>
  );
}
