import { InputField, type InputFieldProps } from '@redwoodjs/forms'

export default function DataListInputField({
  options,
  ...props
}: InputFieldProps & { options: readonly string[] }) {
  const listName = `${props.id || props.name}-list`
  return (
    <>
      <InputField {...props} list={listName} />

      <datalist id={listName}>
        {options.map((option, i) => (
          <option key={i} value={option}></option>
        ))}
      </datalist>
    </>
  )
}
