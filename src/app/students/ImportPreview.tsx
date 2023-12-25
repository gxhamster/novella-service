"use client";
import {
  DataTable,
  DataTableContent,
  DataTableControls,
} from "@/components/DataTable";
import {
  ActionIcon,
  Box,
  Button,
  LoadingOverlay,
  Modal,
  Popover,
  Stack,
  Stepper,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { Group, Text, Badge, rem } from "@mantine/core";
import {
  IconUpload,
  IconFileTypeCsv,
  IconX,
  IconAlertCircle,
  IconDatabaseImport,
  IconDeviceFloppy,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import { createColumnHelper } from "@tanstack/react-table";
import { ZStudentInsert } from "@/supabase/schema";
import { SafeParseError } from "zod";
import { useDisclosure } from "@mantine/hooks";
import AlertIcon from "@/components/icons/AlertIcon";

type PreviewModalProps = {
  onFileSelected: (file: File) => void;
};

type StatusBadegeProps = {
  status: "Valid" | "Invalid";
};

function StatusBadge({ status }: StatusBadegeProps) {
  switch (status) {
    case "Valid":
      return (
        <Badge variant="light" color="green">
          Valid
        </Badge>
      );
    case "Invalid":
      return (
        <Badge variant="light" color="red">
          Invalid
        </Badge>
      );
  }
}

function FileDropzone({ onFileSelected }: PreviewModalProps) {
  const [selected, setSelected] = useState<File | null>(null);
  return (
    <Dropzone
      onDrop={(files) => {
        onFileSelected(files[0]);
        setSelected(files[0]);
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 1024 ** 2}
      accept={[MIME_TYPES.csv]}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileTypeCsv
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>
        {!selected ? (
          <div>
            <Text size="xl" inline>
              Drag csv files here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Only file can be imported at a time, each file should not exceed
              5mb
            </Text>
          </div>
        ) : (
          <div>
            <Text size="xl" inline>
              Selected a file
            </Text>

            <Text size="sm" c="dimmed" inline mt={7}>
              {`${selected.name}`}
            </Text>
          </div>
        )}{" "}
      </Group>
    </Dropzone>
  );
}

type CellInformationProps = {
  message: string;
};
function CellInformation({ message }: CellInformationProps) {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={200}
      position="bottom"
      variant="light"
      withArrow
      shadow="lg"
      opened={opened}
    >
      <Popover.Target>
        <ActionIcon
          radius="xl"
          size="sm"
          onMouseEnter={open}
          onMouseLeave={close}
          variant="light"
          color="red"
        >
          <IconAlertCircle />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Text size="sm">{message}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

type ImportTableProps = {
  data: Array<Record<string, any>>;
  onIsTableErr: (isError: boolean) => void;
};

function ImportTable({ data, onIsTableErr }: ImportTableProps) {
  const [pageSettings, setPageSettings] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columnHelper = createColumnHelper<any>();
  const sampleHeaders = [
    { id: "name", header: "Name" },
    { id: "island", header: "Island" },
    { id: "address", header: "Address" },
    { id: "phone", header: "Phone" },
    { id: "grade", header: "Grade" },
    { id: "index", header: "Index" },
  ];

  const columns = [
    columnHelper.accessor("row", {
      header: "Row #",
      cell: (prop) => prop.getValue(),
    }),
    ...sampleHeaders.map((header) =>
      columnHelper.accessor(header.id, {
        header: header.header,
        cell: (prop) => (
          <>
            <Group gap={5} align="center" justify="space-between">
              <Text size="xs">{prop.getValue()?.value}</Text>
              {prop.getValue()?.message && (
                <CellInformation message={prop.getValue()?.message} />
              )}
            </Group>
          </>
        ),
      })
    ),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (prop) => <StatusBadge status={prop.getValue()} />,
    }),
  ];

  const pagedData = useMemo(() => {
    const errorStatusPerRow = data.map((dataRow, index) => {
      const parsed = ZStudentInsert.safeParse(dataRow) as SafeParseError<
        typeof dataRow
      >;

      const fieldErrWithMessage: Record<string, string> = {};
      parsed?.error?.issues.forEach((err) => {
        fieldErrWithMessage[String(err.path[0])] = err.message;
      });

      let dataRowWithErr: Record<string, any> = {};
      for (const field in dataRow) {
        const errMessage =
          field in fieldErrWithMessage ? fieldErrWithMessage[field] : "";
        const value = dataRow[field] || null;
        dataRowWithErr[field] = { value, message: errMessage };
      }

      return {
        ...dataRowWithErr,
        row: index + 1,
        status: parsed.success ? "Valid" : "Invalid",
      };
    });

    const startIdx = pageSettings.pageIndex * pageSettings.pageSize;
    const endIdx = pageSettings.pageSize * (pageSettings.pageIndex + 1);
    console.log(errorStatusPerRow);

    const isAnyRowErr = errorStatusPerRow.filter(
      (row) => row.status === "Invalid"
    );
    if (isAnyRowErr.length) onIsTableErr(true);
    else onIsTableErr(false);

    return errorStatusPerRow.slice(startIdx, endIdx);
  }, [data, pageSettings]);

  return (
    <>
      <DataTable
        onPaginationChanged={(pageIndex, pageSize) =>
          setPageSettings({ pageIndex, pageSize })
        }
        totalDataCount={data.length}
        isDataLoading={false}
        isDataRefetching={false}
        data={pagedData}
        columns={columns}
      >
        <DataTableContent spacing="xs" />
        <DataTableControls />
      </DataTable>
    </>
  );
}

export default function ImportPreview() {
  const router = useRouter();
  const [parsedFile, setParsedFile] = useState<Array<
    Record<"string", any>
  > | null>(null);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isTableError, setIsTableError] = useState(false);

  const allowNextStep = useMemo(() => {
    if (parsedFile && !isTableError) return true;
    return false;
  }, [parsedFile, isTableError]);

  const [isUploading, setIsUploading] = useState(false);

  function upload() {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      nextStep();
    }, 10000);
  }

  return (
    <Modal
      opened
      onClose={router.back}
      size="95%"
      title="Import preview"
      radius="md"
    >
      <Box pos="relative" p={20}>
        <LoadingOverlay
          visible={isUploading}
          styles={{
            overlay: {
              backgroundColor: "rgba(36,36,36,0.2)",
            },
          }}
          zIndex={1000}
          overlayProps={{ radius: "lg", blur: 1 }}
        />
        <Stepper
          active={active}
          color="green.5"
          onStepClick={setActive}
          allowNextStepsSelect={allowNextStep}
        >
          <Stepper.Step label="First step" description="Select file">
            <FileDropzone
              onFileSelected={(file) => {
                Papa.parse(file, {
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true,
                  complete: function (results: any) {
                    console.log(results.data);
                    setParsedFile(results.data);
                  },
                });
              }}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="Check for errors"
            color={isTableError ? "red" : "green.5"}
          >
            <ImportTable
              onIsTableErr={(isError) => setIsTableError(isError)}
              data={parsedFile || []}
            />
          </Stepper.Step>

          <Stepper.Step label="Third step" description="Commit records">
            <Stack justify="center" align="center" p={20} gap={40}>
              <IconDatabaseImport size={120} stroke={0.5} color="#9e9e9e" />
              <Button
                variant="filled"
                size="md"
                loading={isUploading}
                onClick={upload}
                leftSection={<IconDeviceFloppy size={20} />}
              >
                Save to library
              </Button>
            </Stack>
          </Stepper.Step>
        </Stepper>
        <Group justify="center" mt="xl">
          <Button
            size="xs"
            leftSection={<IconArrowLeft />}
            variant="default"
            onClick={() => {
              setIsTableError(false);
              prevStep();
            }}
          >
            Back
          </Button>
          <Button
            size="xs"
            variant="default"
            onClick={nextStep}
            rightSection={<IconArrowRight />}
            disabled={!allowNextStep}
          >
            Next step
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
