import { ToastContainer, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stylesContext: Record<TypeOptions, { borderColor: string }> = {
  error: {
    borderColor: "border-alert-600",
  },
  info: {
    borderColor: "border-primary-600",
  },
  success: {
    borderColor: "border-success-600",
  },
  warning: {
    borderColor: "border-warning-200",
  },
  default: {
    borderColor: "border-primary-600",
  },
};

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{ width: 400 }}
      toastClassName={(opts) => {
        return `bg-surface-300 text-surface-800 text-sm border-l-4 ${
          stylesContext[opts?.type ? opts.type : "default"].borderColor
        } m-2 relative flex p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer`;
      }}
    />
  );
}