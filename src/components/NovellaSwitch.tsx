import { useState } from "react";
import { Switch } from "@headlessui/react";

type NovellaSwitchProps = {
  onChange: (enabled: boolean) => void;
  defaultValue: boolean;
};

export default function NovellaSwitch({
  onChange,
  defaultValue,
}: NovellaSwitchProps) {
  const [enabled, setEnabled] = useState(defaultValue);

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={(checked) => {
          onChange(checked);
          setEnabled(checked);
        }}
        className={`${enabled ? "bg-primary-500" : "bg-surface-200"}
          relative inline-flex h-[24px] w-[45px] shrink-0 cursor-pointer rounded-full border-2 border-surface-700 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            enabled
              ? "translate-x-[21px] translate-y-0"
              : "translate-x-[0px] translate-y-0"
          }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-surface-900 shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}
