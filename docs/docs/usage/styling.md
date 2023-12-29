---
sidebar_position: 2
---
# Styling

```tsx
/**
 * Results in the following DOM
 * <form aria-label="Styling usage" class="mx-auto w-fit">
 *   <label>
 *     Email
 *     <input id="email" type="email" name="email" class="input-bordered input-secondary input w-full max-w-xs">
 *   </label>
 *   <label>
 *     Name
 *     <input id="name" type="text" name="name" class="input-bordered input-secondary input w-full max-w-xs">
 *   </label>
 *   <button type="submit">Submit form</button>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result: { email: string }) =>
    console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Styling usage"
      className="mx-auto w-fit"
      fieldClassName="input-bordered input-secondary input w-full max-w-xs"
      schema={schema}
      onSubmit={onSubmit}
    >
      <Submit>Submit form</Submit>
    </AutoForm>
  )
}
```
