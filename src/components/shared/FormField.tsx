"use client"

interface FormFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  optional?: boolean
  colSpan?: 1 | 2
}

export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  required,
  type = "text",
  optional,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12px] font-medium text-[#666] uppercase tracking-wide mb-1.5"
      >
        {label}
        {optional && <span className="normal-case tracking-normal font-normal text-[#999] ml-1">(opcional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-11 px-4 border border-[#e5e5e5] text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
      />
    </div>
  )
}
