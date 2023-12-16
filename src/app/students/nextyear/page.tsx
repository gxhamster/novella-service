"use client";
import NButton from "@/components/NButton";
import { AcademicIllustration } from "./AcademicIllustration";
import { trpc } from "@/app/_trpc/client";
import { useMemo, useState } from "react";
import { getAllStudentsType } from "@/server/routes/student";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import NBadge from "@/components/NBadge";
import CheckIcon from "@/components/icons/CheckIcon";
import { Popover, Listbox } from "@headlessui/react";

interface getAllStudentsTypeDef extends getAllStudentsType {
  new_grade: number | null;
  status: string;
}

export default function Nextyear() {
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>();
  const getStudentQuery = trpc.students.getAllStudents.useQuery(undefined, {
    enabled: false,
  });
  const getStudentQueryWithStatus = useMemo(() => {
    const n = getStudentQuery.data?.data.map((student) => {
      if (student.grade && student.grade < 12) {
        return { ...student, status: "Changed", new_grade: student.grade + 1 };
      } else {
        return { ...student, status: "No Change", new_grade: null };
      }
    });
    return n;
  }, [getStudentQuery]);
  const columnHelper = createColumnHelper<getAllStudentsTypeDef>();
  const tanstackCols = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("index", {
      header: "Index",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("grade", {
      header: "Grade",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <NBadge type={props.getValue() === "Changed" ? "success" : "secondary"}>
          {props.getValue()}
        </NBadge>
      ),
    }),
    columnHelper.accessor("new_grade", {
      header: "New Grade",
      cell: (props) => props.getValue(),
    }),
  ];
  return (
    <div className="flex flex-col text-surface-900 gap-y-3 relative max-h-full overflow-y-auto flex-grow px-20 ">
      <section className="flex flex-col justify-center items-center">
        <section className="flex flex-col mt-10">
          <span className="text-3xl">Academic year</span>
          <span className="text-md text-surface-600 font-light mt-2a">
            Allows to transfer all registered library students to the next
            academic year
          </span>
        </section>
        <section className="flex flex-col justify-center">
          <AcademicIllustration size={300} />
          <NButton
            disabled={showStudents}
            title="Review Changes"
            size="normal"
            kind="secondary"
            onClick={() => {
              setShowStudents(true);
              getStudentQuery.refetch();
            }}
          />
        </section>
      </section>

      {showStudents && (
        <section className="m-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-2xl">Review changes</span>
            <span className="text-md text-surface-600 font-light my-2">
              Review the proposed changes that will be made to the students
              information
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-end">
              <Listbox value={selectedGrade} onChange={setSelectedGrade}>
                <Listbox.Button className="h-full py-2 px-3 inline-flex text-sm gap-2 justify-center items-center text-surface-700 bg-surface-200 hover:bg-surface-300 transition-all border-[1px] border-surface-200 focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60 outline-none">
                  {selectedGrade} Hello
                </Listbox.Button>
                <Listbox.Options>
                  {getStudentQueryWithStatus
                    ?.map((record) => record.grade)
                    .filter((grade, idx, array) => idx === array.indexOf(grade))
                    .map((grade) => (
                      <Listbox.Option key={grade} value={grade}>
                        {grade}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Listbox>
              <NButton
                size="normal"
                title="Save Changes"
                icon={<CheckIcon size={10} />}
              ></NButton>
            </div>
            <NovellaDataTable<getAllStudentsTypeDef>
              columns={tanstackCols}
              isDataLoading={getStudentQuery.isLoading}
              isDataRefetching={getStudentQuery.isRefetching}
              data={getStudentQueryWithStatus}
            />
          </div>
        </section>
      )}
    </div>
  );
}
