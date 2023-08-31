import { forwardRef } from 'react'

import type {
  ZodDateDef,
  ZodNumberDef,
  ZodStringDef,
  ZodTypeAny,
  ZodTypeDef,
} from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'

import {
  CheckboxField,
  DateField,
  EmailField,
  InputField,
  type InputFieldProps,
  NumberField,
  TextField,
  UrlField,
} from '@redwoodjs/forms'

export function getInputComponentFromZod<T extends ZodTypeAny>(type: T) {
  if (isStringDef(type._def)) {
    const emailCheck = type._def.checks.find(({ kind }) => kind === 'email')
    const urlCheck = type._def.checks.find(({ kind }) => kind === 'url')
    return emailCheck ? EmailField : urlCheck ? UrlField : TextField
  } else if (isDateDef(type._def)) {
    return DateField
  } else if (isNumberDef(type._def)) {
    return NumberField
  }

  throw new Error(`zod schema of ${getDefType(type._def)} not yet supported`)
}

function isDateDef(def: ZodTypeDef): def is ZodDateDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodDate
}

function isNumberDef(def: ZodTypeDef): def is ZodNumberDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodNumber
}

function getDefType(def: ZodTypeDef): ZodFirstPartyTypeKind {
  // Every ZodTypeDef contains a typeName
  // but the zod types don't accurately reflect that, hence the casting
  return (def as any).typeName
}

function isStringDef(def: ZodTypeDef): def is ZodStringDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodString
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
