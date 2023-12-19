"use client";
import NButton from "@/components/NButton";
import { AcademicIllustration } from "./AcademicIllustration";
import { trpc } from "@/app/_trpc/client";
import { useMemo, useState } from "react";
import { getAllStudentsType } from "@/server/routes/student";
import NovellaDataTable from "@/components/NovellaDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import CheckIcon from "@/components/icons/CheckIcon";
import { Badge, Button, Title, Text, Select } from "@mantine/core";

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
      if (
        student.grade &&
        student.grade < 12 &&
        student.grade === selectedGrade
      ) {
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
        <Badge color={props.getValue() === "Changed" ? "green" : "dark.6"}>
          {props.getValue()}
        </Badge>
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
        <section className="flex flex-col justify-center items-center mt-10">
          <Title order={1} fw="bold" c="dark.1">
            Academic year
          </Title>
          <Title c="dark.2" order={4} fw="normal">
            Allows to transfer all registered library students to the next
            academic year
          </Title>
        </section>
        <section className="flex flex-col justify-center">
          <AcademicIllustration size={300} />
          <Button
            color="gray"
            disabled={showStudents}
            size="md"
            onClick={() => {
              setShowStudents(true);
              getStudentQuery.refetch();
            }}
          >
            Review changes
          </Button>
        </section>
      </section>

      {showStudents && (
        <section className="m-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Text size="xl" c="dark.1">
              Review changes
            </Text>
            <Text size="md" c="dark.2">
              Review the proposed changes that will be made to the students
              information
            </Text>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-end mb-5 gap-3">
              <Select
                size="sm"
                placeholder="Pick grade"
                onChange={(value) => setSelectedGrade(Number(value))}
                data={getStudentQueryWithStatus
                  ?.map((record) => record.grade)
                  .filter((grade, idx, array) => idx === array.indexOf(grade))
                  .map((grade) => String(grade))}
              />
              <Button size="sm" leftSection={<CheckIcon size={10} />}>
                Save changes
              </Button>
              {/* <DropDown title="Grade" selected={selectedGrade}>
                {getStudentQueryWithStatus
                  ?.map((record) => record.grade)
                  .filter((grade, idx, array) => idx === array.indexOf(grade))
                  .map((grade) => (
                    <div
                      key={grade}
                      className="px-2 hover:bg-surface-300/[0.5]"
                    >
                      <Listbox.Option
                        key={grade}
                        value={grade}
                        className={({ active }) =>
                          ` py-2  border-t-[1px] border-surface-300 ${
                            active
                              ? "  focus:border-surface-900 disabled:bg-surface-200 disabled:opacity-60 outline-none"
                              : ""
                          }`
                        }
                      >
                        {grade}
                      </Listbox.Option>
                    </div>
                  ))}
              </DropDown> */}
              {/* <NButton
                size="normal"
                title="Save Changes"
                icon={<CheckIcon size={10} />}
              ></NButton> */}
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
