import type { PropsWithChildren, ReactElement } from 'react'

import { titleCase } from 'title-case'
import type {
  ZodFirstPartyTypeKind,
  ZodStringCheck,
  ZodTypeAny,
} from 'zod/lib/types'

import {
  EmailField,
  FieldError as RedwoodFieldError,
  InputFieldProps,
  TextField,
} from '@redwoodjs/forms'

/**
 * These are the props that will be passed to the underlying input
 * TODO: this should likely start with FieldProps from @redwoodjs/forms, but it's not exported
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

const AutoField = <T extends ZodTypeAny>({
  type,
  name,
  Label = <label htmlFor={name}>{titleCase(name)}</label>,
  FieldWrapper = ({ children }) => <>{children}</>,
  FieldError = <RedwoodFieldError name={name} />,
  ...fieldProps
}: {
  type: T
  Label?: ReactElement
  FieldError?: ReactElement
  FieldWrapper?: (props: PropsWithChildren) => ReactElement
} & AutoFieldInputProps) => {
  // TODO is there a better way to type this?
  const { typeName, checks } = type._def
  const InputComponent = getInputComponentFromZodType(
    typeName as ZodFirstPartyTypeKind,
    checks as ZodStringCheck[]
  )
  return (
    <FieldWrapper>
      {Label}
      <InputComponent name={name} {...fieldProps} />
      {FieldError}
    </FieldWrapper>
  )
}

export default AutoField
