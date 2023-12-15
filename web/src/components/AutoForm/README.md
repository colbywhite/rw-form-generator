This is an in-progress doc of the `AutoForm` component.

# Usage

## Basic

```tsx
import AutoForm from "web/src/components/AutoForm/AutoForm";
import { z } from "zod";
import { Submit } from "@redwoodjs/forms";

const schema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required'),
});

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
  const onSubmit = (result: { email: string, name: string }) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Basic usage"
      schema={schema}
      onSubmit={onSubmit}>
      <Submit>Submit form</Submit>
    </AutoForm>
  );
}
```

## Styling
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
  const onSubmit = (result: { email: string }) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Styling usage"
      className="mx-auto w-fit"
      fieldClassName="input-bordered input-secondary input w-full max-w-xs"
      schema={schema}
      onSubmit={onSubmit}>
      <Submit>Submit form</Submit>
    </AutoForm>
  );
}
```

## Custom wrappers
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
  const onSubmit = (result: { email: string, name: string }) => console.log("Submitted", result);
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
      onSubmit={onSubmit}>
      <Submit>Submit form</Submit>
    </AutoForm>
  );
}
```

## Errors

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
  const onSubmit = (result: { email: string, name: string }) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Error usage"
      fieldClassName="input-bordered input-secondary input w-full max-w-xs"
      fieldErrorClassName="input-bordered input-secondary input w-full max-w-xs input-error"
      FieldError={(name) => (
        <FieldError
          name={name}
          className="p-1 italic text-error-content"
        />
      )}
      schema={schema}
      onSubmit={onSubmit}>
      <Submit>Submit form</Submit>
    </AutoForm>
  );
}
```

## Input Type Overrides
Which `input` type to use is determined by the zod schema.
However, some schemas can be ambiguous as to which UI element should be chosen.
The `AutoForm#overrides` property allows for specificity.

### String-related overrides
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
  'tel prop': z.string(),
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="String override usage"
      overrides={{
        'password prop': 'password',
        'search prop': 'search',
        'month prop': 'month',
        'week prop': 'week',
        'color prop': 'color',
        'tel prop': 'tel',
      }}
      schema={schema}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```

#### Notes
`<input type="month">` and `<input type="week">` may not feel related to string overrides,
but the browser treats the value as a string but gives visual indicators that the string represents something date-related.
Same scenario for `<input type="color">` and `<input type="tel">`.

### Date-related overrides
These input types are most likely represented as dates in zod.
An override can be provided that they are visually not `<input type="date">` elements.

```tsx
const schema = z.object({
  'date prop': z.date(),
  'datetime-local prop': z.date(),
  'time prop': z.date(),
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Date override usage"
      overrides={{
        'datetime-local prop': 'datetime-local',
        'time prop': 'time',
      }}
      schema={schema}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```

#### Notes
How the browser visually represents these inputs is browser-dependant.

### Number-related overrides
These input types are most likely represented as numbers in zod.
An override can be provided that they are visually not `<input type="number">` elements.

```tsx
const schema = z.object({
  'number prop': z.number(),
  'range prop': z.number(),
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Number override usage"
      overrides={{
        'range prop': 'range',
      }}
      schema={schema}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```

### Option-related overrides
These input types are most likely represented as enums in zod.
The correct `input` is chosen based on how the enum is represented in zod.

```tsx
const schema = z.object({
  radio: z.enum(['foo', 'bar']),
  checkbox: z.enum(['foo', 'bar']).array(),
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Option usage"
      schema={schema}
      FieldWrapper={({ children }) => (
        <div className="form-control">{children}</div>
      )}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```

#### Notes
`<select>` isn't supported yet.
Feedback is encouraged to determine the best API for the these three option-based inputs.

## Component Overrides
You can bring your own custom fields.

Note: This lib is built on top of `react-hook-form` so your custom component should play nice with RHF.
The easiest way is to use the existing components in `@redwoodjs/forms`.

```tsx
import { InputField, type InputFieldProps } from '@redwoodjs/forms'

function DataListInputField(
  {options, ...props}: InputFieldProps & { options: readonly string[] }
) {
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Custom component override usage"
      overrides={{
        flavor: (props) => (<DataListInputField {...props} options={['Chocolate', 'Coconut', 'Caramel', 'Cherry']} />)
      }}
      schema={schema}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```

## Required vs. optional fields
Due to the way HTML forms work (i.e. doing nothing in an `<input>` usually results in a `""` value), the state of "the user has not entered anything" may get represented in unintuitive ways when stitching together `zod`, `react-hook-form` (which is what `@redwoodjs/forms` is built on), and `@hookform/resolvers`.

The below is not directly related to the `AutoForm` component but instead is a guide for how to represent optional and required fields with the above tools.

```tsx
// leaving a `<input type="number">` empty results in a `NaN`.
// what you choose to do with the `NaN` is up to you.
const schema = z.object({
  required_number: z.number({ invalid_type_error: 'Number is required' }),
  optional_number: z.number().or(z.nan()),
});
```

```tsx
// leaving a `<input type="text">` empty results in a `""`.
// use the length checks to eliminate empty strings.
// what you choose to do with the empty string is up to you.
const schema = z.object({
  required_string: z.string().min(1, 'String is required'),
  optional_string: z.string(),
});
```

```tsx
// leaving a `<input type="date">` empty results in a `null`.
// what you choose to do with the `null` is up to you.
const schema = z.object({
  required_date: z.date({ invalid_type_error: 'Date is required' }),
  optional_date: z.date().nullable(),
});
```

```tsx
// leaving a `<input type="radio">` empty results in a `null`.
// what you choose to do with the `null` is up to you.
const schema = z.object({
  required_radio: z.enum(options, {
    invalid_type_error: 'Radio is required',
  }),
  optional_radio: z.enum(options).nullable(),
});
```

```tsx
// never touching a `<input type="checkbox">` empty results in a `false`.
// checking and unchecking results in an empty array.
// what you choose to do with the `false` is up to you.
const schema = z.object({
  required_checkbox: z
    .enum(options, {
      invalid_type_error: 'Checkbox selection required',
    })
    .array()
    .nonempty('Checkbox selection required'),
  optional_checkbox: z.enum(options).array().or(z.literal(false)),
});
```


## Object fields

```tsx
const schema = z.object({
  name: z.object({
    first: z.string().min(1, 'First name is required'),
    last: z.string().min(1, 'Last name is required'),
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
  const onSubmit = (result) => console.log("Submitted", result);
  return (
    <AutoForm
      aria-label="Object field usage"
      schema={schema}
      onSubmit={onSubmit}>
    </AutoForm>
  );
}
```
