# Input type overrides

Which `input` type to use is determined by the zod schema.
However, some schemas can be ambiguous as to which UI element should be chosen.
The `AutoForm#overrides` property allows for specificity.

## String-related overrides

These input types are most likely represented as strings in zod (likely with your own custom zod validation).
An override can be provided that they are visually not `<input type="text">` elements.

```tsx
const schema = z.object({
  'string prop': z.string(),
  'password prop': z.string(),
  'search prop': z.string(),
  'month prop': z.string(),
  'week prop': z.string(),
  'color prop': z.string(),
  'tel prop': z.string()
})

/**
 * Results in the following DOM
 * <form aria-label="String override usage">
 *   <label>
 *     String Prop
 *     <input id="stringProp" type="text" name="stringProp">
 *   </label>
 *   <label>
 *     Password Prop
 *     <input id="passwordProp" type="password" name="passwordProp">
 *   </label>
 *   <label>
 *     Search Prop
 *     <input id="searchProp" type="search" name="searchProp">
 *   </label>
 *   <label>
 *     Month Prop
 *     <input id="monthProp" type="month" name="monthProp">
 *   </label>
 *   <label>
 *     Week Prop
 *     <input id="weekProp" type="week" name="weekProp">
 *   </label>
 *   <label>
 *     Color Prop
 *     <input id="colorProp" type="color" name="colorProp">
 *   </label>
 *   <label>
 *     Tel Prop
 *     <input id="telProp" type="tel" name="telProp">
 *   </label>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="String override usage"
      overrides={{
        'password prop': 'password',
        'search prop': 'search',
        'month prop': 'month',
        'week prop': 'week',
        'color prop': 'color',
        'tel prop': 'tel'
      }}
      schema={schema}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```

### Notes

`<input type="month">` and `<input type="week">` may not feel related to string overrides,
but the browser treats the value as a string but gives visual indicators that the string represents something date-related.
Same scenario for `<input type="color">` and `<input type="tel">`.

## Date-related overrides

These input types are most likely represented as dates in zod.
An override can be provided that they are visually not `<input type="date">` elements.

```tsx
const schema = z.object({
  'date prop': z.date(),
  'datetime-local prop': z.date(),
  'time prop': z.date()
})

/**
 * Results in the following DOM
 * <form aria-label="Date override usage">
 *   <label>
 *     Date Prop
 *     <input id="date prop" type="date" name="date prop">
 *   </label>
 *   <label>
 *     Datetime-Local Prop
 *     <input id="datetime-local prop" type="datetime-local" name="datetime-local prop">
 *   </label>
 *   <label>
 *     Time Prop
 *     <input id="time prop" type="time" name="time prop">
 *   </label>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Date override usage"
      overrides={{
        'datetime-local prop': 'datetime-local',
        'time prop': 'time'
      }}
      schema={schema}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```

### Notes

How the browser visually represents these inputs is browser-dependant.

## Number-related overrides

These input types are most likely represented as numbers in zod.
An override can be provided that they are visually not `<input type="number">` elements.

```tsx
const schema = z.object({
  'number prop': z.number(),
  'range prop': z.number()
})

/**
 * Results in the following DOM
 * <form aria-label="Number override usage">
 *   <label>
 *     Number Prop
 *     <input id="number prop" type="number" name="number prop">
 *   </label>
 *   <label>
 *     Range Prop
 *     <input id="range prop" type="range" name="range prop">
 *   </label>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Number override usage"
      overrides={{
        'range prop': 'range'
      }}
      schema={schema}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```

## Option-related overrides

These input types are most likely represented as enums in zod.
The correct `input` is chosen based on how the enum is represented in zod.

```tsx
const schema = z.object({
  radio: z.enum(['foo', 'bar']),
  checkbox: z.enum(['foo', 'bar']).array()
})

/**
 * Results in the following DOM
 * <form aria-label="Option usage">
 *   <div class="form-control>
 *     <label>
 *       Foo
 *       <input id="radio" type="radio" name="radio" value="foo">
 *     </label>
 *     <label>
 *       Bar
 *       <input id="radio" type="radio" name="radio" value="bar">
 *     </label>
 *   </div>
 *   <div class="form-control>
 *     <label>
 *       Foo
 *       <input id="checkbox" type="checkbox" name="checkbox" value="foo">
 *     </label>
 *     <label>
 *       Bar
 *       <input id="checkbox" type="checkbox" name="checkbox" value="bar">
 *     </label>
 *   </div>
 * </form>
 */
export default function Usage() {
  const onSubmit = (result) => console.log('Submitted', result)
  return (
    <AutoForm
      aria-label="Option usage"
      schema={schema}
      FieldWrapper={({ children }) => (
        <div className="form-control">{children}</div>
      )}
      onSubmit={onSubmit}
    ></AutoForm>
  )
}
```

### Notes

`<select>` isn't supported yet.
Feedback is encouraged to determine the best API for the these three option-based inputs.
