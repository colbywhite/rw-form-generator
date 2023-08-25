import type { PropsWithChildren, ReactElement, ReactNode } from 'react'

import { titleCase } from 'title-case'
import type { ZodTypeAny } from 'zod'

import {
  FieldError as RedwoodFieldError,
  type InputFieldProps,
} from '@redwoodjs/forms'

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
  Label = <label htmlFor={name}>{titleCase(name)}</label>,
  FieldWrapper = ({ children }) => <>{children}</>,
  FieldError = <RedwoodFieldError name={name} />,
  override,
  ...fieldProps
}: {
  type: T
  Label?: ReactNode
  FieldError?: ReactNode
  FieldWrapper?: (props: PropsWithChildren) => ReactElement
  override?: Override
} & AutoFieldInputProps) => {
  // TODO is there a better way to type this?
  const InputComponent =
    override === undefined
      ? getInputComponentFromZod(type)
      : getOverrideComponent(override)
  return (
    <FieldWrapper>
      {Label}
      <InputComponent name={name} {...fieldProps} />
      {FieldError}
    </FieldWrapper>
  )
}

export default AutoField
