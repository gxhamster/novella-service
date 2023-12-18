import { useState } from "react";
// import { Popover, Transition } from "@headlessui/react";
import { Popover, Button } from "@mantine/core";

type NDataTableFixedSortMenuProps = {
  buttonContent: React.ReactNode;
  buttonIcon: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  position?: "left" | "right";
};
export default function NDataTableFixedMenu({
  buttonContent,
  buttonIcon,
  width = 320,
  position = "right",
  children,
}: NDataTableFixedSortMenuProps) {
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
          variant="light"
          color="dark"
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
