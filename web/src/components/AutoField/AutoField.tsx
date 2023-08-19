import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'

import { titleCase } from 'title-case'
import type {
  ZodFirstPartyTypeKind,
  ZodStringCheck,
  ZodTypeAny,
} from 'zod/lib/types'

import {
  CheckboxField,
  EmailField,
  FieldError as RedwoodFieldError,
  InputField,
  type InputFieldProps,
  TextField,
} from '@redwoodjs/forms'

/**
 * These are the props that will be passed to the underlying input
 * TODO: this should likely start with FieldProps from @redwoodjs/forms
 *  to pick up HTMLTextAreaElement & HTMLSelectElement, but it's not exported
 */
type AutoFieldInputProps = Omit<
  InputFieldProps,
  'type' | 'validation' | 'onChange' | 'onBlur' | 'form'
>

function getInputComponentFromZodType(
  type: ZodFirstPartyTypeKind,
  checks: ZodStringCheck[] = []
) {
  if (type === 'ZodString') {
    const emailCheck = checks.find(({ kind }) => kind === 'email')
    return emailCheck ? EmailField : TextField
  }
  throw new Error(`zod schema of ${type} is not yet supported`)
}

export type Override = InputFieldProps['type'] | 'checkbox'
// | 'select'
// | 'textarea'

function getOverrideComponent(override: Override) {
  if (override === 'checkbox') {
    return CheckboxField
    // } else if (override === 'select') {
    //   return SelectField
    // } else if (override === 'textarea') {
    //   return TextAreaField
  }
  return forwardRef<HTMLInputElement, Omit<InputFieldProps, 'type'>>(
    (props, ref) => <InputField ref={ref} type={override} {...props} />
  )
}

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
  const { typeName, checks } = type._def
  const InputComponent =
    override === undefined
      ? getInputComponentFromZodType(
          typeName as ZodFirstPartyTypeKind,
          checks as ZodStringCheck[]
        )
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
