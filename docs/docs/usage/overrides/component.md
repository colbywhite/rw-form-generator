# Component overrides

You can bring your own custom fields.

Note: This lib is built on top of `react-hook-form` so your custom component should play nice with RHF.
The easiest way is to use the existing components in `@redwoodjs/forms`.

```tsx
import { InputField, type InputFieldProps } from '@redwoodjs/forms'

function DataListInputField({
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

/**
 * Results in the following DOM
 * <form aria-label="Custom component override usage">
 *   <label>
 *     Flavor
 *     <input id="flavor" name="flavor" list="flavor-list">
 *     <datalist id="flavor-list">
 *       <option value="Chocolate"></option>
 *       <option value="Coconut"></option>
 *       <option value="Caramel"></option>
 *       <option value="Cherry"></option>
 *     </datalist>
 *   </label>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Custom component override usage"
      overrides={{
        flavor: (props) => (
          <DataListInputField
            {...props}
            options={['Chocolate', 'Coconut', 'Caramel', 'Cherry']}
          />
        )
      }}
      schema={schema}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```
