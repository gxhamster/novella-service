"use client";
import StudentsTable from "./StudentTable";
import { NAlertProvider } from "@/components/NAlert";

export default async function Books() {
  return (
    <div className="w-full flex flex-col text-surface-900 gap-y-3 m-0">
      <NAlertProvider>
        <StudentsTable />
      </NAlertProvider>
    </div>
  );
}
