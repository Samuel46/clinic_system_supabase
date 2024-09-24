import { Controller, useFormContext } from "react-hook-form";

// form
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../form";
import { Textarea } from "@ui/textarea";
import { cn } from "@lib/utils";
import { useId } from "react";

// ----------------------------------------------------------------------

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export default function RHFTextArea({ name, label }: Props) {
  const { control } = useFormContext();
  let id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem>
            <FormLabel
              htmlFor="reasonForVisit"
              className={cn(
                field.value ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                "text-base/6 text-neutral-500 transform transition-all duration-300 ease-in-out"
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <div className="group relative z-0 transition-all focus-within:z-10 ">
                <Textarea className="resize-none rounded-2xl " {...field} />

                <label
                  htmlFor={id}
                  className={cn(
                    error?.message
                      ? "text-base/6 text-red-600 peer-focus:text-red-800 peer-[:not(:placeholder-shown)]:text-red-800 "
                      : "text-base/6 text-neutral-500 peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:text-neutral-950",
                    field.value !== "" &&
                      " transition-all  duration-300 peer-[:not(:placeholder-shown)]:hidden  ",
                    "pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left font-display transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold "
                  )}
                >
                  {label}
                </label>
              </div>
            </FormControl>
            <FormDescription className="text-[0.8rem] font-medium text-destructive">
              {error?.message}
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
