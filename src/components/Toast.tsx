import { notifications } from "@mantine/notifications";

type ToastProps = {
  title: string;
  message: string;
};

export const Toast = {
  Successful: function ({ title = "Successful", message = "" }: ToastProps) {
    notifications.show({
      title,
      message,
      withBorder: true,
      radius: "",
      color: "green",
    });
  },
  Error: function ({ title = "Successful", message = "" }: ToastProps) {
    notifications.show({
      title,
      color: "red",
      withBorder: true,
      radius: "",
      message,
    });
  },
};
