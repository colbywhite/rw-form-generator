import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Fragment } from 'react'

import type { ZodTypeAny } from 'zod'

import {
  FieldError as RedwoodFieldError,
  type InputFieldProps,
} from '@redwoodjs/forms'

import type { DefaultLabel } from 'src/components/AutoField/labeled-inputs'

import {
  getInputComponentFromZod,
  getOverrideComponent,
  Override,
} from './field.utils'

/**
 * These are the props that will be passed to the underlying input
 * TODO: this should likely start with FieldProps from @redwoodjs/forms
 *  to pick up HTMLTextAreaElement & HTMLSelectElement, but it's not exported
 */
type AutoFieldInputProps = Omit<
  InputFieldProps,
  'type' | 'validation' | 'onChange' | 'onBlur' | 'form'
>

const AutoField = <T extends ZodTypeAny>({
  type,
  name,
  Label,
  FieldWrapper = Fragment,
  FieldError = <RedwoodFieldError name={name} />,
  override,
  ...fieldProps
}: {
  type: T
  Label?: typeof DefaultLabel
  FieldError?: ReactNode
  FieldWrapper?: FC<PropsWithChildren>
  override?: Override
} & AutoFieldInputProps) => {
  // TODO is there a better way to type this?
  const InputComponent =
    override === undefined
      ? getInputComponentFromZod(type, Label)
      : getOverrideComponent(override, Label)
  return (
    <FieldWrapper>
      <InputComponent name={name} {...fieldProps} />
      {FieldError}
    </FieldWrapper>
  )
}

export default AutoField
