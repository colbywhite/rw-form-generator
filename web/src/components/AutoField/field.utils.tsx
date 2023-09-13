import { type ComponentProps, forwardRef, type RefAttributes } from 'react'

import type {
  ZodDateDef,
  ZodEnumDef,
  ZodNumberDef,
  ZodStringDef,
  ZodTypeAny,
  ZodTypeDef,
} from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'

import {
  type CheckboxFieldProps,
  DateField,
  EmailField,
  InputField,
  type InputFieldProps,
  NumberField,
  RadioField,
  TextField,
  UrlField,
} from '@redwoodjs/forms'

import { DefaultLabel } from 'src/components/AutoField/labeled-inputs'

export function getInputComponentFromZod<T extends ZodTypeAny>(
  type: T,
  Label = DefaultLabel
) {
  if (isStringDef(type._def)) {
    const emailCheck = type._def.checks.find(({ kind }) => kind === 'email')
    const urlCheck = type._def.checks.find(({ kind }) => kind === 'url')
    const StringComponent = emailCheck
      ? EmailField
      : urlCheck
      ? UrlField
      : TextField
    return ({ name, ...props }: ComponentProps<typeof TextField>) => (
      <Label name={name}>
        <StringComponent name={name} {...props} />
      </Label>
    )
  } else if (isDateDef(type._def)) {
    return ({ name, ...props }: ComponentProps<typeof DateField>) => (
      <Label name={name}>
        <DateField name={name} {...props} />
      </Label>
    )
  } else if (isNumberDef(type._def)) {
    return ({ name, ...props }: ComponentProps<typeof NumberField>) => (
      <Label name={name}>
        <NumberField name={name} {...props} />
      </Label>
    )
  } else if (isEnumDef(type._def)) {
    return ({
      name,
      ...props
    }: Omit<CheckboxFieldProps, 'ref' | 'value'> &
      RefAttributes<HTMLInputElement>) => (
      <>
        {type._def.values.map((value, index) => (
          <Label name={value} key={index}>
            <RadioField name={name} value={value} {...props} />
          </Label>
        ))}
      </>
    )
  }

  throw new Error(`zod schema of ${getDefType(type._def)} not yet supported`)
}

function isDateDef(def: ZodTypeDef): def is ZodDateDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodDate
}

function isNumberDef(def: ZodTypeDef): def is ZodNumberDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodNumber
}

function isEnumDef(def: ZodTypeDef): def is ZodEnumDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodEnum
}

function getDefType(def: ZodTypeDef): ZodFirstPartyTypeKind {
  // Every ZodTypeDef contains a typeName
  // but the zod types don't accurately reflect that, hence the casting
  return (def as any).typeName
}

function isStringDef(def: ZodTypeDef): def is ZodStringDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodString
}

export type Override = InputFieldProps['type']
// | 'select'
// | 'textarea'

export function getOverrideComponent(override: Override, Label = DefaultLabel) {
  return forwardRef<HTMLInputElement, Omit<InputFieldProps, 'type'>>(
    (props, ref) => {
      return (
        <Label name={props.name}>
          <InputField ref={ref} type={override} {...props} />
        </Label>
      )
    }
  )
}
