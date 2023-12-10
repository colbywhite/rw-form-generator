import type { FC, PropsWithChildren } from 'react'
import { Fragment } from 'react'

import type { ZodType } from 'zod'

import {
  FieldError as RedwoodFieldError,
  type InputFieldProps,
} from '@redwoodjs/forms'

import type { DefaultLabel } from 'src/components/AutoField/labeled-inputs'
import { isObjectDef } from 'src/components/AutoField/zod.utils'

import {
  getInputComponentFromZod,
  getInputFieldsetFromZod,
  getOverrideComponent,
  Override,
} from './field.utils'

/**
 * These are the props that will be passed to the underlying input
 * TODO: this should likely start with FieldProps from @redwoodjs/forms
 *  to pick up HTMLTextAreaElement & HTMLSelectElement, but it's not exported
 */
export type AutoFieldInputProps = Omit<
  InputFieldProps,
  'type' | 'validation' | 'onChange' | 'onBlur' | 'form'
>

const AutoField = <T extends ZodType>({
  type,
  name,
  Label,
  FieldWrapper = Fragment,
  FieldError = (name) => <RedwoodFieldError name={name} />,
  override,
  ...fieldProps
}: {
  type: T
  Label?: typeof DefaultLabel
  FieldError?: FC<string>
  FieldWrapper?: FC<PropsWithChildren>
  override?: Override
} & AutoFieldInputProps) => {
  // TODO is there a better way to type this?
  const InputComponent =
    override !== undefined
      ? getOverrideComponent(override, Label)
      : isObjectDef(type._def)
      ? getInputFieldsetFromZod(type._def, Label, FieldWrapper, FieldError)
      : getInputComponentFromZod(type, Label)
  return (
    <FieldWrapper>
      <InputComponent name={name} {...fieldProps} />
      {isObjectDef(type._def) || FieldError(name)}
    </FieldWrapper>
  )
}

export default AutoField
