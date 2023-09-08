"use-client";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface NovellaInputProps<NovellaInputField extends string> {
  type: "email" | "text" | "password";
  title: string;
  reactHookRegister: UseFormRegisterReturn<NovellaInputField>;
  reactHookErrorMessage: FieldError | undefined;
  placeholder?: string;
}

function NovellaInput<NovellaInputField extends string>({
  type,
  title,
  placeholder,
  reactHookRegister,
  reactHookErrorMessage,
}: NovellaInputProps<NovellaInputField>) {
  const inputBorderStyles = () => {
    if (reactHookErrorMessage?.message)
      return "border-alert-600 ring-alert-500";
    else
      return "border-surface-500 hover:bg-surface-400 hover:placeholder:text-surface-600 ring-surface-700";
  };

  return (
    <section className="flex flex-col justify-start">
      <label
        htmlFor={reactHookRegister.name}
        className="text-surface-600 text-sm"
      >
        {title}
      </label>
      <input
        className={`px-4 py-2 mt-2 border-[1px] transition  appearance-none outline-none bg-surface-300  focus:ring-[1px] placeholder:text-surface-500 rounded-md ${inputBorderStyles()}`}
        placeholder={placeholder}
        type={type}
        id={reactHookRegister.name}
        {...reactHookRegister}
      ></input>
      <span className="mt-2 text-sm text-alert-400">
        {reactHookErrorMessage?.message}
      </span>
    </section>
  );
}

export default NovellaInput;
