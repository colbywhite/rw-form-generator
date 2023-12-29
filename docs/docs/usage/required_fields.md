---
sidebar_position: 5
---
# Required vs. optional fields

Due to the way HTML forms work (i.e. doing nothing in an `<input>` usually results in a `""` value), the state of "the user has not entered anything" may get represented in unintuitive ways when stitching together `zod`, `react-hook-form` (which is what `@redwoodjs/forms` is built on), and `@hookform/resolvers`.

And `AutoForm` intended to stitch these tools together without injecting a whole lot more on top of them.

Thus this doc isn't directly related to the `AutoForm` component but instead is a guide for how to represent optional and required fields with the above tools.

## Number

```tsx
// leaving a `<input type="number">` empty results in a `NaN`.
// what you choose to do with the `NaN` is up to you.
const schema = z.object({
  required_number: z.number({ invalid_type_error: 'Number is required' }),
  optional_number: z.number().or(z.nan())
})
```

## Text

```tsx
// leaving a `<input type="text">` empty results in a `""`.
// use the length checks to eliminate empty strings.
// what you choose to do with the empty string is up to you.
const schema = z.object({
  required_string: z.string().min(1, 'String is required'),
  optional_string: z.string()
})
```

## Date

```tsx
// leaving a `<input type="date">` empty results in a `null`.
// what you choose to do with the `null` is up to you.
const schema = z.object({
  required_date: z.date({ invalid_type_error: 'Date is required' }),
  optional_date: z.date().nullable()
})
```

## Radio options

```tsx
// leaving a `<input type="radio">` empty results in a `null`.
// what you choose to do with the `null` is up to you.
const schema = z.object({
  required_radio: z.enum(options, {
    invalid_type_error: 'Radio is required'
  }),
  optional_radio: z.enum(options).nullable()
})
```

## Checkbox options

```tsx
// never touching a `<input type="checkbox">` empty results in a `false`.
// checking and unchecking results in an empty array.
// what you choose to do with the `false` is up to you.
const schema = z.object({
  required_checkbox: z
    .enum(options, {
      invalid_type_error: 'Checkbox selection required'
    })
    .array()
    .nonempty('Checkbox selection required'),
  optional_checkbox: z.enum(options).array().or(z.literal(false))
})
```
