import React from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import clsx from 'clsx'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError | undefined
  label: string
}

function RadioInput({ label, error, ...props }: InputProps) {
  return (
    <label className="flex gap-x-3">
      <input
        type="radio"
        {...props}
        className={clsx(
          error?.message
            ? 'border-red-950/20 checked:border-red-950 focus-visible:ring-red-950 '
            : 'focus-visible:ring-neutral-950xwxxw border-neutral-950/20 checked:border-neutral-950',
          'h-6 w-6 flex-none appearance-none rounded-full border outline-none checked:border-[0.5rem] focus-visible:ring-1  focus-visible:ring-offset-2',
        )}
      />
      <span
        className={clsx(
          error?.message ? ' text-red-950' : 'text-neutral-800',
          'text-base/6 ',
        )}
      >
        {label}
      </span>
    </label>
  )
}

const budgetOptions = [
  { label: '$1K – $10K', value: '5000' },
  { label: '$10K – $20K', value: '20,000' },
  { label: '$25K – $50K', value: '25,000' },
  { label: '$50K – $100K', value: '50,000' },
  { label: '$100K – $150K', value: '100,000' },
  { label: 'More than $150K', value: '150,000' },
]

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
}

export default function RHFRadioGroup({ name, label, ...other }: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <fieldset onChange={field.onChange}>
          <legend
            className={clsx(
              error?.message ? 'text-red-500' : 'text-neutral-500',
              'text-base/6',
            )}
          >
            {error?.message ? error.message : label}
          </legend>
          <div className="mt-6 grid grid-cols-1 gap-8 pb-4 sm:grid-cols-2">
            {budgetOptions.map((option) => (
              <RadioInput
                key={option.value}
                label={option.label}
                name={name}
                value={option.value}
                error={error}
              />
            ))}
          </div>
        </fieldset>
      )}
    />
  )
}
