import {
  type ComponentProps,
  type FC,
  forwardRef,
  type RefAttributes,
} from 'react'

import type {
  ZodArrayDef,
  ZodDateDef,
  ZodEnumDef,
  ZodNumberDef,
  ZodOptionalDef,
  ZodStringDef,
  ZodTypeAny,
  ZodTypeDef,
  ZodUnionDef,
} from 'zod'
import { ZodFirstPartyTypeKind, ZodNaN, ZodNumber, ZodOptional } from 'zod'

import {
  CheckboxField,
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
  } else if (isNumberDef(type._def) || isNumberOptional(type._def)) {
    return ({ name, ...props }: ComponentProps<typeof NumberField>) => (
      <Label name={name}>
        <NumberField
          name={name}
          validation={{
            valueAsNumber: true,
            required: !isNumberOptional(type._def),
          }}
          {...props}
        />
      </Label>
    )
  } else if (isEnumDef(type._def)) {
    return ({
      name,
      ...props
    }: Omit<ComponentProps<typeof RadioField>, 'ref' | 'value'> &
      RefAttributes<HTMLInputElement>) => (
      <>
        {type._def.values.map((value, index) => (
          <Label name={value} key={index}>
            <RadioField name={name} value={value} {...props} />
          </Label>
        ))}
      </>
    )
  } else if (isArrayDef(type._def) && isEnumDef(type._def.type._def)) {
    const { values } = type._def.type._def
    return ({
      name,
      ...props
    }: Omit<CheckboxFieldProps, 'ref' | 'value'> &
      RefAttributes<HTMLInputElement>) => (
      <>
        {values.map((value, index) => (
          <Label name={value} key={index}>
            <CheckboxField name={name} value={value} {...props} />
          </Label>
        ))}
      </>
    )
  }

  throw new Error(`zod schema of ${getDefType(type._def)} not yet supported`)
}

function isNumberOptional(def: ZodTypeDef) {
  return isOptionalNumberDef(def) || isNaNUnionDef(def)
}

function isOptionalNumberDef(
  def: ZodTypeDef
): def is ZodOptionalDef<ZodNumber> {
  return isOptionalDef(def) && def.innerType instanceof ZodNumber
}

function isNaNUnionDef(
  def: ZodTypeDef
): def is ZodUnionDef<[ZodNumber, ZodNaN]> {
  return (
    isUnionDef(def) &&
    (def.options[0] instanceof ZodNumber ||
      def.options[0] instanceof ZodOptional) &&
    def.options[1] instanceof ZodNaN
  )
}

function isOptionalDef(def: ZodTypeDef): def is ZodOptionalDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodOptional
}

function isUnionDef(def: ZodTypeDef): def is ZodUnionDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodUnion
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

function isArrayDef(def: ZodTypeDef): def is ZodArrayDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodArray
}

export function getDefType(def: ZodTypeDef): ZodFirstPartyTypeKind {
  // Every ZodTypeDef contains a typeName
  // but the zod types don't accurately reflect that, hence the casting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (def as any).typeName
}

function isStringDef(def: ZodTypeDef): def is ZodStringDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodString
}

export type Override = FC<InputFieldProps> | InputFieldProps['type']
// | 'select'
// | 'textarea'

export function getOverrideComponent(override: Override, Label = DefaultLabel) {
  if (typeof override === 'string') {
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
  return forwardRef<HTMLInputElement, Omit<InputFieldProps, 'type'>>(
    (props, ref) => {
      return <Label name={props.name}>{override({ ...props, ref: ref })}</Label>
    }
  )
}
