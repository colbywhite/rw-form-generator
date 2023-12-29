import type { FC, PropsWithChildren } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodObject, ZodRawShape } from 'zod'

import type { FieldValues, FormProps, SubmitHandler } from '@redwoodjs/forms'
import { Form, useForm } from '@redwoodjs/forms'

import AutoField from '../AutoField/AutoField'
import type { Override } from '../AutoField/field.utils'
import type { DefaultLabel } from '../AutoField/labeled-inputs'

type AutoFormSpecificProps<T extends ZodRawShape> = {
  schema: ZodObject<T>
  /**
   * TODO: This is duplicate of react-hook-form's `resetOptions` and likely not needed
   */
  resetOnSuccess?: boolean
  fieldClassName?: string
  fieldErrorClassName?: string
  Label?: typeof DefaultLabel
  FieldError?: FC<string>
  FieldWrapper?: FC<PropsWithChildren>
  'aria-label': string // make this a required prop
  overrides?: Record<string, Override>
}

export type AutoFormProps<
  T extends ZodRawShape,
  Output extends FieldValues = FieldValues
> = Omit<FormProps<Output>, 'formMethods' | 'config' | 'aria-label'> &
PropsWithChildren<AutoFormSpecificProps<T>>

const AutoForm = <
  T extends ZodRawShape,
  Output extends FieldValues = FieldValues
>({
    schema,
    onSubmit,
    resetOnSuccess = true,
    fieldErrorClassName,
    fieldClassName,
    children,
    Label,
    FieldError,
    FieldWrapper,
    overrides = {},
    ...formProps
  }: AutoFormProps<T>) => {
  const formMethods = useForm<Output>({
    mode: 'onBlur',
    resolver: zodResolver(schema)
  })

  const fullOnSubmit: SubmitHandler<Output> = async (result, event) => {
    if (onSubmit !== undefined) {
      onSubmit(result, event)
    }
    if (resetOnSuccess) {
      formMethods.reset()
    }
  }

  return (
    <Form onSubmit={fullOnSubmit} formMethods={formMethods} {...formProps}>
      {Object.keys(schema.shape).map((key) => (
        <AutoField
          key={key}
          type={schema.shape[key]}
          name={key}
          className={fieldClassName}
          errorClassName={fieldErrorClassName}
          Label={Label}
          FieldWrapper={FieldWrapper}
          FieldError={FieldError}
          {...(overrides[key] !== undefined ? { override: overrides[key] } : {})}
        />
      ))}
      {children}
    </Form>
  )
}

export default AutoForm
