import NDrawer from "@/components/NDrawer";
import NDataTableFixedSmall from "@/components/NDataTableFixed/NDataTableFixedSmall";
import { StudentsTableColumnDef } from "../lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import { IIssuedBook, IStudent } from "@/supabase/types/supabase";
import { Dispatch, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";
import { getStudentsByPage } from "@/app/api/students/client";

const studentsColHelper = createColumnHelper<IStudent>();
const studentsTableCols: Array<StudentsTableColumnDef> = [
  { id: "id", header: "ID" },
  { id: "name", header: "Name" },
  { id: "island", header: "Island" },
  { id: "address", header: "Address" },
  { id: "phone", header: "Phone" },
  { id: "grade", header: "Grade" },
  { id: "index", header: "Index" },
];

const studentsTableColsTanstack = studentsTableCols.map((column) =>
  studentsColHelper.accessor(column.id, {
    cell: (info) => info.getValue(),
    header: column.header,
  })
);

type SelectStudentDrawerProps = {
  isAddStudentDrawerOpen: boolean;
  setIsAddStudentDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedStudent: Dispatch<SetStateAction<IStudent | null>>;
  formSetValue: UseFormSetValue<IIssuedBook>;
};

export default function SelectStudentDrawer({
  isAddStudentDrawerOpen,
  setIsAddStudentDrawerOpen,
  setSelectedStudent,
  formSetValue,
}: SelectStudentDrawerProps) {
  return (
    <NDrawer
      title="Select a student to issue to"
      isOpen={isAddStudentDrawerOpen}
      closeDrawer={() => setIsAddStudentDrawerOpen(false)}
    >
      <NDataTableFixedSmall<IStudent>
        columns={studentsTableCols}
        tanStackColumns={studentsTableColsTanstack}
        onRowSelectionChanged={(state) => {
          if (state) {
            setIsAddStudentDrawerOpen(false);
            setSelectedStudent(state);
            formSetValue("student_id", state.id);
          }
        }}
        fetchData={getStudentsByPage}
      />
    </NDrawer>
  );
}
