import { toast } from "react-toastify";

type ToastMessage = {
  title: string;
  subtitle: string;
};

type ToastOptions = {
  inline: boolean;
};

type ToastMessageProps = {
  message: ToastMessage;
  opts: ToastOptions;
};

function ToastMessage({ message, opts }: ToastMessageProps) {
  return (
    <div className={`flex ${opts.inline ? "gap-2" : "flex-col"}`}>
      <span className="font-semibold">{message.title}</span>
      <span>{message.subtitle}</span>
    </div>
  );
}

function toastSuccess(
  title = "Successful",
  subtitle = "",
  opts: ToastOptions = { inline: false }
) {
  toast.success(
    <ToastMessage message={{ title: title, subtitle: subtitle }} opts={opts} />
  );
}

function toastError(
  title = "Error",
  subtitle = "",
  opts: ToastOptions = { inline: false }
) {
  toast.error(
    <ToastMessage message={{ title: title, subtitle: subtitle }} opts={opts} />
  );
}

export const NToast = {
  success: toastSuccess,
  error: toastError,
};
