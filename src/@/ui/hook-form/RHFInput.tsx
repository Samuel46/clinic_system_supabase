import { cn } from "@lib/utils";
import { FormControl, FormDescription, FormItem } from "@ui/form";
import React, { useId } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError | undefined;
  label: string;
}

function TextInput({ label, error, ...props }: InputProps) {
  let id = useId();

  return (
    <div className="group relative z-0 transition-all focus-within:z-10">
      <input
        type={props.type || "text"}
        id={id}
        {...props}
        placeholder=" "
        className="peer block w-full border border-neutral-300 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-950 ring-4 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 group-first:rounded-2xl disabled:cursor-not-allowed disabled:opacity-50"
      />
      <label
        htmlFor={id}
        className={cn(
          error?.message
            ? "text-base/6 text-red-600 peer-focus:text-red-800 peer-[:not(:placeholder-shown)]:text-red-800"
            : "text-base/6 text-neutral-500 peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:text-neutral-950",
          "pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left font-display transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold"
        )}
      >
        {label}
      </label>
    </div>
  );
}

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export default function RHFInput({ name, label, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem>
            <FormControl>
              <TextInput
                label={label}
                id={name}
                {...field}
                {...other}
                error={error}
                onChange={(e) => {
                  const value =
                    other.type === "number" ? parseFloat(e.target.value) : e.target.value;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
              {error?.message}
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
