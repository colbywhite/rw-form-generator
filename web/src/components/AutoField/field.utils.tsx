import {
  type ComponentProps,
  type FC,
  forwardRef,
  type RefAttributes,
} from 'react'

import type { ZodTypeAny, ZodTypeDef } from 'zod'

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
import * as zodUtils from 'src/components/AutoField/zod.utils'

export function getInputComponentFromZod<T extends ZodTypeAny>(
  type: T,
  Label = DefaultLabel
) {
  if (zodUtils.isStringDef(type._def)) {
    const isEmail = zodUtils.containsCheck(type._def, 'email')
    const isUrl = zodUtils.containsCheck(type._def, 'url')
    const StringComponent = isEmail ? EmailField : isUrl ? UrlField : TextField
    return ({ name, ...props }: ComponentProps<typeof TextField>) => (
      <Label name={name}>
        <StringComponent name={name} {...props} />
      </Label>
    )
  } else if (zodUtils.isDateDef(type._def)) {
    return ({ name, ...props }: ComponentProps<typeof DateField>) => (
      <Label name={name}>
        <DateField name={name} {...props} />
      </Label>
    )
  } else if (isRequiredNumber(type._def) || isOptionalNumber(type._def)) {
    return ({ name, ...props }: ComponentProps<typeof NumberField>) => (
      <Label name={name}>
        <NumberField
          name={name}
          validation={{
            valueAsNumber: true,
            required: !isOptionalNumber(type._def),
          }}
          {...props}
        />
      </Label>
    )
  } else if (zodUtils.isEnumDef(type._def)) {
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
  } else if (
    zodUtils.isArrayDef(type._def) &&
    zodUtils.isEnumDef(type._def.type._def)
  ) {
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

  throw new Error(
    `zod schema of ${zodUtils.getDefType(type._def)} not yet supported`
  )
}

function isRequiredNumber(def: ZodTypeDef) {
  return zodUtils.isNumberDef(def)
}

/**
 * Optional numbers can be represented by a `.or(z.nan())` due to the way react-hook-forms and zod handle the empty string.
 * This accounts for both cases.
 */
function isOptionalNumber(def: ZodTypeDef) {
  return zodUtils.isOptionalNumberDef(def) || zodUtils.isNaNUnionDef(def)
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
