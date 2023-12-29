---
sidebar_position: 6
---
# Object fields

```tsx
const schema = z.object({
  name: z.object({
    first: z.string().min(1, 'First name is required'),
    last: z.string().min(1, 'Last name is required')
  })
})

/**
 * Results in the following DOM
 * <form aria-label="Object field usage">
 *   <fieldset>
 *     <label>
 *       name.first
 *       <input id="name.first" type="text" name="name.first" />
 *     </label>
 *     <label>
 *       name.last
 *       <input id="name.last" type="text" name="name.last" />
 *     </label>
 *   </fieldset>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Object field usage"
      schema={schema}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```
