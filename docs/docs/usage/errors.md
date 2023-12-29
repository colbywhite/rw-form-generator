---
sidebar_position: 4
---
# Errors

```tsx
import { FieldError } from '@redwoodjs/forms'

/**
 * Results in the following DOM when the input fails the zod validation
 * <form aria-label="Error usage">
 *   <label>
 *     Email
 *     <input id="email" type="email" class="input-bordered input-secondary input w-full max-w-xs input-error" name="email">
 *   </label>
 *   <span class="p-1 italic text-error-content">Email address is required</span>
 *   <label>
 *     Name
 *     <input id="name" type="text" class="input-bordered input-secondary input w-full max-w-xs input-error" name="name">
 *   </label>
 *   <span class="p-1 italic text-error-content">Name is required</span>
 *   <button type="submit">Submit form</button>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result: { email: string; name: string }) =>
    console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Error usage"
      fieldClassName="input-bordered input-secondary input w-full max-w-xs"
      fieldErrorClassName="input-bordered input-secondary input w-full max-w-xs input-error"
      FieldError={(name) => (
        <FieldError name={name} className="p-1 italic text-error-content" />
      )}
      schema={schema}
      onSubmit={onSubmit}
    >
      <Submit>Submit form</Submit>
    </AutoForm>
  )
}
```
