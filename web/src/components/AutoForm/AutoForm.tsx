import type { FC, PropsWithChildren } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type {
  objectInputType,
  objectOutputType,
  UnknownKeysParam,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from 'zod/lib/types'

import type { FormProps, SubmitHandler } from '@redwoodjs/forms'
import { Form, useForm } from '@redwoodjs/forms'

import AutoField from 'src/components/AutoField/AutoField'

type AutoFormSpecificProps<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
> = {
  schema: ZodObject<T, UnknownKeys, Catchall, Output, Input>
  resetOnSuccess?: boolean
  fieldClassName?: string
  fieldWrapperClassName?: string
  additionalFieldErrorClass?: string
  fieldErrorClassName?: string
  label?: FC<string>
}

export type AutoFormProps<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
> = Omit<FormProps<Output>, 'formMethods' | 'config'> &
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
  fieldWrapperClassName,
  additionalFieldErrorClass,
  fieldClassName,
  children,
  label,
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
          wrapperClassName={fieldWrapperClassName}
          additionalErrorClass={additionalFieldErrorClass}
          fieldErrorClassName={fieldErrorClassName}
          {...(label ? { label: label(key) } : {})}
        />
      ))}
      {children}
    </Form>
  )
}

export default AutoForm
