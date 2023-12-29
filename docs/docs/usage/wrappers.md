---
sidebar_position: 3
---
# Custom wrappers

```tsx
/**
 * Results in the following DOM
 * <form aria-label="Custom wrappers usage">
 *   <div class="form-control">
 *     <label class="label">
 *       <span class="label-text mr-4">Email</span>
 *       <input id="email" type="email" name="email">
 *     </label>
 *   </div>
 *   <div class="form-control">
 *     <label class="label">
 *       <span class="label-text mr-4">Name</span>
 *       <input id="name" type="text" name="name">
 *     </label>
 *   </div>
 *   <button type="submit">Submit form</button>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result: { email: string; name: string }) =>
    console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Custom wrappers usage"
      schema={schema}
      Label={({ name, children }) => (
        <label className="label">
          <span className="label-text mr-4">{titleCase(name)}</span>
          {children}
        </label>
      )}
      FieldWrapper={({ children }) => (
        <div className="form-control">{children}</div>
      )}
      onSubmit={onSubmit}
    >
      <Submit>Submit form</Submit>
    </AutoForm>
  )
}
```
