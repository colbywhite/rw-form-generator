import { InputField, type InputFieldProps } from '@redwoodjs/forms'

import { SearchIcon } from 'src/components/SearchIcon/SearchIcon'

export default function DataListInputField({
  options,
  ...props
}: InputFieldProps & { options: readonly string[] }) {
  const listName = `${props.id || props.name}-list`
  return (
    <>
      <div className="relative">
        <InputField {...props} list={listName} />
        <SearchIcon className="absolute right-3 top-1/2 inline-block -translate-y-1/2" />
      </div>

      <datalist id={listName}>
        {options.map((option, i) => (
          <option key={i} value={option}></option>
        ))}
      </datalist>
    </>
  )
}
