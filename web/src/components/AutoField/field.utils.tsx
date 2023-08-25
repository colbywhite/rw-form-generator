import { forwardRef } from 'react'

import type { ZodStringDef, ZodTypeAny, ZodTypeDef } from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'

import {
  CheckboxField,
  EmailField,
  InputField,
  InputFieldProps,
  TextField,
} from '@redwoodjs/forms'

export function getInputComponentFromZod<T extends ZodTypeAny>(type: T) {
  if (isStringDef(type._def)) {
    const emailCheck = type._def.checks.find(({ kind }) => kind === 'email')
    return emailCheck ? EmailField : TextField
  }

  throw new Error(`zod schema of ${type} not yet supported`)
}

function isStringDef(def: ZodTypeDef): def is ZodStringDef {
  // Every ZodTypeDef contains a typeName
  // but the zod types don't accurately reflect that, hence the casting
  return (def as any).typeName === ZodFirstPartyTypeKind.ZodString
}

export type Override = InputFieldProps['type'] | 'checkbox'
// | 'select'
// | 'textarea'

export function getOverrideComponent(override: Override) {
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
