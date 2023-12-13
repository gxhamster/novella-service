"use client";
import StudentsTable from "./StudentTable";

export default async function Students() {
  return (
    <div className="w-full h-full flex flex-col text-surface-900 gap-y-3 m-0">
      <StudentsTable />
    </div>
  );
}
