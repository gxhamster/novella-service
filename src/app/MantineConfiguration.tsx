import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/dropzone/styles.css";

type MantineConfigurationProps = {
  children: React.ReactNode;
};

export default function MantineConfiguration({
  children,
}: MantineConfigurationProps) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
