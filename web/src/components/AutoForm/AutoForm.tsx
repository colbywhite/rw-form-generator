import type { FC, PropsWithChildren } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type {
  objectInputType,
  objectOutputType,
  UnknownKeysParam,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from 'zod'

import type { FormProps, SubmitHandler } from '@redwoodjs/forms'
import { Form, useForm } from '@redwoodjs/forms'

import AutoField from 'src/components/AutoField/AutoField'
import { Override } from 'src/components/AutoField/field.utils'
import type { DefaultLabel } from 'src/components/AutoField/labeled-inputs'

type AutoFormSpecificProps<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
> = {
  schema: ZodObject<T, UnknownKeys, Catchall, Output, Input>
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
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
> = Omit<FormProps<Output>, 'formMethods' | 'config' | 'aria-label'> &
  PropsWithChildren<
    AutoFormSpecificProps<T, UnknownKeys, Catchall, Output, Input>
  >

const AutoForm = <
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
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
}: AutoFormProps<T, UnknownKeys, Catchall, Output, Input>) => {
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  })

  const fullOnSubmit: SubmitHandler<Output> = async (result, event) => {
    await onSubmit(result, event)
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
          {...(FieldError ? { FieldError: FieldError(key) } : {})}
          {...(overrides[key] ? { override: overrides[key] } : {})}
        />
      ))}
      {children}
    </Form>
  )
}

export default AutoForm
