"use client";
import { useState } from "react";
import { Popover, Button } from "@mantine/core";

type FixedTableMenuProps = {
  buttonContent: React.ReactNode;
  buttonIcon: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  position?: "left" | "right";
};
export default function FixedTableMenu({
  buttonContent,
  buttonIcon,
  width = 320,
  children,
}: FixedTableMenuProps) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      opened={opened}
      width={width}
      position="bottom-end"
      onChange={setOpened}
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Button
          variant="default"
          size="xs"
          color="gray"
          leftSection={buttonIcon}
          onClick={() => setOpened(true)}
        >
          {buttonContent}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>{children}</Popover.Dropdown>
    </Popover>
  );
}
