---
sidebar_position: 1
---
# Basic

```tsx
import { AutoForm } from '@colbyw/autoform'
import { z } from 'zod'
import { Submit } from '@redwoodjs/forms'

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .min(1, 'Name is required')
})

/**
 * Results in the following DOM
 * <form aria-label="Basic usage">
 *   <label>
 *     Email
 *     <input id="email" type="email" name="email">
 *   </label>
 *   <label>
 *     Name
 *     <input id="name" type="text" name="name">
 *   </label>
 *   <button type="submit">Submit form</button>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result: { email: string; name: string }) =>
    console.log('Submitted', result)
  return (
    <AutoForm aria-label="Basic usage" schema={schema} onSubmit={onSubmit}>
      <Submit>Submit form</Submit>
    </AutoForm>
  )
}
```
