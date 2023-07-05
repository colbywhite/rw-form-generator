import type { PropsWithChildren } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type {
  objectInputType,
  objectOutputType,
  UnknownKeysParam,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from 'zod/lib/types'

import type { SubmitHandler } from '@redwoodjs/forms'
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
  onSubmit?: SubmitHandler<Output>
  error?: unknown
  resetOnSuccess?: boolean
}

export type AutoFormProps<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
> = PropsWithChildren<
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
  error,
  resetOnSuccess = true,
  children,
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
    <Form
      className="mx-auto w-fit"
      onSubmit={fullOnSubmit}
      error={error}
      formMethods={formMethods}
    >
      {Object.keys(schema.shape).map((key) => (
        <AutoField key={key} type={schema.shape[key]} name={key} />
      ))}
      {children}
    </Form>
  )
}

export default AutoForm
