import { useMemo } from "react";
import {
  Group,
  ActionIcon,
  Flex,
  Text,
  Button,
  Loader,
  Divider,
} from "@mantine/core";
import RefreshIcon from "../icons/RefreshIcon";
import CloseIcon from "../icons/CloseIcon";
import TrashIcon from "../icons/TrashIcon";
import AddIcon from "../icons/AddIcon";
import { useTable } from "./FixedTable";
import { FixedTableFilterMenu, FixedTableSortMenu } from ".";
import FilterIcon from "../icons/FilterIcon";

type RefreshButtonProps = {
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function RefreshButton({ onRefresh, isRefreshing }: RefreshButtonProps) {
  const refreshBtnIcon = useMemo(() => {
    switch (isRefreshing) {
      case true:
        return <Loader size="xs" color="dark.1" />;
      case false:
        return <RefreshIcon size={18} />;
    }
  }, [isRefreshing]);

  return (
    <Group gap={10}>
      <ActionIcon
        variant="light"
        color="dark"
        w={100}
        size="xs"
        aria-label="Refresh"
        onClick={onRefresh}
      >
        <Flex gap={10} align="center">
          {refreshBtnIcon}
          <Text size="sm" c="dark.1">
            Refresh
          </Text>
        </Flex>
      </ActionIcon>
    </Group>
  );
}

type SelectedActionsProps = {
  active: boolean;
  children: React.ReactNode;
};

function SelectedActions({ active, children }: SelectedActionsProps) {
  return active ? (
    <div className="flex items-center gap-2">{children}</div>
  ) : null;
}

type CancelSelectionAction = {
  selectedDataLength: number;
  onCancelSelection: () => void;
};
function CancelSelectionAction({
  selectedDataLength,
  onCancelSelection,
}: CancelSelectionAction) {
  return (
    <>
      <Text c="dark.1" size="sm">{`${selectedDataLength} rows selected`}</Text>
      <Button
        variant="default"
        color="gray"
        size="xs"
        aria-label="Reset row selection"
        onClick={onCancelSelection}
        leftSection={<CloseIcon size={16} />}
      >
        Cancel
      </Button>
    </>
  );
}

type DeleteSelectionActionProps = {
  onDelete: () => void;
};
function DeleteSelectionAction({ onDelete }: DeleteSelectionActionProps) {
  return (
    <Button
      variant="subtle"
      size="xs"
      color="red.9"
      leftSection={<TrashIcon size={18} />}
      onClick={onDelete}
    >
      Delete
    </Button>
  );
}

type PrimaryActionsProps = {
  active: boolean;
  children: React.ReactNode;
};
function PrimaryActions({ active, children }: PrimaryActionsProps) {
  return active ? (
    <div className="flex gap-3 items-center">{children}</div>
  ) : null;
}

type PrimaryActionProps = {
  title?: string;
  active: boolean;
  onClick: () => void;
};
function PrimaryAction({
  active,
  onClick,
  title = "Create",
}: PrimaryActionProps) {
  return (
    active && (
      <Button size="xs" leftSection={<AddIcon size={18} />} onClick={onClick}>
        {title}
      </Button>
    )
  );
}

type FixedTableToolbarProps<TableType> = {
  onRefresh: () => void;
  onRowDeleted: (deletedRows: Array<TableType>) => void;
  onFilterButtonPressed: () => void;
  isDataLoading: boolean;
  primaryAction: () => void;
  columns: Array<{ id: keyof TableType; header: string }>;
  children?: React.ReactNode;
  selectedToobarActions?: React.ReactNode;
  activePrimaryAction?: boolean;
  primaryActionTitle?: string;
};

export default function FixedTableToolbar<TableType>({
  isDataLoading,
  onRefresh,
  columns,
  onFilterButtonPressed,
  primaryAction,
  primaryActionTitle = "Create",
  activePrimaryAction = true,
  onRowDeleted,
  selectedToobarActions,
  children,
}: FixedTableToolbarProps<TableType>) {
  const { selectedData, setSorts, setFilters, table } = useTable();

  return (
    <div className="flex justify-between bg-dark-7 border-b-[1px] border-surface-300 p-1">
      <RefreshButton isRefreshing={isDataLoading} onRefresh={onRefresh} />
      {/* Selected toolbar */}
      <SelectedActions active={selectedData.length > 0}>
        <CancelSelectionAction
          selectedDataLength={selectedData.length}
          onCancelSelection={table.resetRowSelection}
        />
        <Divider orientation="vertical" mx={10} />
        <DeleteSelectionAction
          onDelete={() => {
            onRowDeleted(selectedData);
            table.resetRowSelection();
          }}
        />
        {selectedToobarActions}
      </SelectedActions>
      <PrimaryActions active={selectedData.length === 0}>
        {children}
        {/* Sort controls and filter controls go here */}
        <FixedTableSortMenu<TableType>
          fields={columns}
          sortRulesChange={(_sorts) => {
            if (_sorts)
              setSorts({
                field: _sorts.field,
                ascending: _sorts.ascending,
              });
            else setSorts(null);
          }}
        />
        {/* Filter Controls */}
        {/* <FixedTableFilterMenu
          filterRulesChanged={(filter) => {
            setFilters([...filter]);
          }}
          tableProps={columns.map((col) => col.id)}
        /> */}
        <Button
          variant="default"
          size="xs"
          color="gray"
          leftSection={<FilterIcon size={16} />}
          onClick={onFilterButtonPressed}
        >
          Filter
        </Button>
        <PrimaryAction
          title={primaryActionTitle}
          active={activePrimaryAction}
          onClick={primaryAction}
        />
      </PrimaryActions>
    </div>
  );
}
