import {
  type ComponentProps,
  type FC,
  forwardRef,
  type PropsWithChildren,
  type RefAttributes
} from 'react'

import type { ZodObjectDef, ZodTypeAny, ZodTypeDef } from 'zod'

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
  UrlField
} from '@redwoodjs/forms'

import type { AutoFieldInputProps } from './AutoField'
import AutoFieldSet from './AutoFieldSet'
import { DefaultLabel } from './labeled-inputs'
import * as zodUtils from './zod.utils'

export function getInputFieldsetFromZod(
  def: ZodObjectDef,
  Label: typeof DefaultLabel,
  FieldWrapper: FC<PropsWithChildren>,
  FieldError: FC<string>
) {
  return ({ name: prefix, ...props }: AutoFieldInputProps) => {
    return (
      <AutoFieldSet
        shape={def.shape()}
        prefix={prefix}
        Label={Label}
        FieldWrapper={FieldWrapper}
        FieldError={FieldError}
        {...props}
      />
    )
  }
}

export function getInputComponentFromZod<T extends ZodTypeAny>(
  type: T,
  Label = DefaultLabel
) {
  const def = type._def as ZodTypeDef
  if (zodUtils.isStringDef(def)) {
    const isEmail = zodUtils.containsCheck(def, 'email')
    const isUrl = zodUtils.containsCheck(def, 'url')
    const StringComponent = isEmail ? EmailField : isUrl ? UrlField : TextField
    return ({ name, ...props }: ComponentProps<typeof TextField>) => (
      <Label name={name}>
        <StringComponent name={name} {...props} />
      </Label>
    )
  } else if (
    zodUtils.isDateDef(def) ||
    zodUtils.isNullableDateDef(def)
  ) {
    return ({ name, ...props }: ComponentProps<typeof DateField>) => (
      <Label name={name}>
        <DateField
          name={name}
          validation={{ required: !zodUtils.isNullableDateDef(def) }}
          {...props}
        />
      </Label>
    )
  } else if (isRequiredNumber(def) || isOptionalNumber(def)) {
    return ({ name, ...props }: ComponentProps<typeof NumberField>) => (
      <Label name={name}>
        <NumberField
          name={name}
          validation={{
            valueAsNumber: true,
            required: !isOptionalNumber(def)
          }}
          {...props}
        />
      </Label>
    )
  } else if (
    zodUtils.isEnumDef(def) ||
    zodUtils.isNullableEnumDef(def)
  ) {
    const [values, required] = zodUtils.isEnumDef(def)
      ? [def.values, true]
      : [def.innerType._def.values, false]
    return ({
      name,
      ...props
    }: Omit<ComponentProps<typeof RadioField>, 'ref' | 'value'> &
    RefAttributes<HTMLInputElement>) => (
      <>
        {values.map((value, index) => (
          <Label name={value} key={index}>
            <RadioField
              name={name}
              value={value}
              validation={{ required }}
              {...props}
            />
          </Label>
        ))}
      </>
    )
  } else if (
    zodUtils.isArrayOfEnumsDef(def) ||
    zodUtils.isArrayOfEnumsAndLiteralUnionDef(def)
  ) {
    const [values, required] = zodUtils.isArrayOfEnumsDef(def)
      ? [def.type._def.values, true]
      : [def.options[0]._def.type._def.values, false]
    return ({
      name,
      ...props
    }: Omit<CheckboxFieldProps, 'ref' | 'value'> &
    RefAttributes<HTMLInputElement>) => (
      <>
        {values.map((value, index) => (
          <Label name={value} key={index}>
            <CheckboxField
              name={name}
              value={value}
              validation={{ required }}
              {...props}
            />
          </Label>
        ))}
      </>
    )
  }

  throw new Error(
    `zod schema of ${zodUtils.getDefType(def)} not yet supported`
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
  return forwardRef<HTMLInputElement, Omit<InputFieldProps, 'type'>>(
    (props, ref) => {
      if (typeof override === 'function') {
        return (
          <Label name={props.name}>{override({ ...props, ref })}</Label>
        )
      }
      return (
        <Label name={props.name}>
          <InputField ref={ref} type={override} {...props} />
        </Label>
      )
    }
  )
}
