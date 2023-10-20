"use-client";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface NovellaInputProps<NovellaInputField extends string>
  extends React.ComponentPropsWithoutRef<"input"> {
  title: string;
  reactHookRegister: UseFormRegisterReturn<NovellaInputField>;
  reactHookErrorMessage: FieldError | undefined;
  helpText?: string;
  labelDirection?: "horizontal" | "vertical";
  fontSize?: "xs" | "sm" | "md" | "lg";
  suffixContent?: React.ReactNode;
}

function NovellaInput<NovellaInputField extends string>({
  title,
  reactHookRegister,
  reactHookErrorMessage,
  labelDirection = "vertical",
  fontSize = "sm",
  helpText,
  suffixContent,
  ...props
}: NovellaInputProps<NovellaInputField>) {
  const inputBorderStyles = () => {
    if (reactHookErrorMessage?.message)
      return "border-alert-600 ring-alert-600";
    else
      return "border-surface-900 hover:bg-surface-300 hover:placeholder:text-surface-600 ring-surface-700 disabled:border-surface-600 disabled:bg-surface-200 disabled:text-surface-700";
  };
  const { type, ...rest } = props;

  const autoCompleteTag = () => {
    if (type === "email") return "username email";
    else if (type === "password") return "current-password";
  };

  const inputId = () => {
    if (type === "email") return "email";
    else if (type === "password") return "current-password";
  };

  return (
    <section className="flex flex-col">
      <div
        className={`${
          labelDirection === "horizontal"
            ? "grid grid-cols-10 items-center"
            : "flex flex-col"
        }`}
      >
        <label
          htmlFor={reactHookRegister.name}
          className={`text-surface-600 text-${fontSize} col-span-3`}
        >
          {title}
        </label>
        <div className="flex flex-col col-span-7">
          <div className="relative mt-2">
            <input
              {...props}
              className={`flex-grow px-4 py-2 border-[1px] w-full block transition  appearance-none outline-none bg-surface-200 focus:ring-[1px] placeholder:text-surface-500 ${inputBorderStyles()} text-sm`}
              autoComplete={autoCompleteTag()}
              id={inputId()}
              {...reactHookRegister}
            />
            <div className="absolute inset-y-0 right-0 pl-3 pr-2 flex items-center justify-center">
              {suffixContent}
            </div>
          </div>
          <span className={`mt-2 text-alert-600 block text-${fontSize}`}>
            {reactHookErrorMessage?.message}
          </span>
          <span className="mt-2 text-surface-500 block text-sm">
            {helpText}
          </span>
        </div>
      </div>
    </section>
  );
}

export default NovellaInput;
