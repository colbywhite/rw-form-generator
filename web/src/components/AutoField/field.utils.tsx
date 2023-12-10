import {
  type ComponentProps,
  type FC,
  forwardRef,
  type PropsWithChildren,
  type RefAttributes,
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
  UrlField,
} from '@redwoodjs/forms'

import type { AutoFieldInputProps } from 'src/components/AutoField/AutoField'
import AutoFieldSet from 'src/components/AutoField/AutoFieldSet'
import { DefaultLabel } from 'src/components/AutoField/labeled-inputs'
import * as zodUtils from 'src/components/AutoField/zod.utils'

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
  if (zodUtils.isStringDef(type._def)) {
    const isEmail = zodUtils.containsCheck(type._def, 'email')
    const isUrl = zodUtils.containsCheck(type._def, 'url')
    const StringComponent = isEmail ? EmailField : isUrl ? UrlField : TextField
    return ({ name, ...props }: ComponentProps<typeof TextField>) => (
      <Label name={name}>
        <StringComponent name={name} {...props} />
      </Label>
    )
  } else if (
    zodUtils.isDateDef(type._def) ||
    zodUtils.isNullableDateDef(type._def)
  ) {
    return ({ name, ...props }: ComponentProps<typeof DateField>) => (
      <Label name={name}>
        <DateField
          name={name}
          validation={{ required: !zodUtils.isNullableDateDef(type._def) }}
          {...props}
        />
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
  } else if (
    zodUtils.isEnumDef(type._def) ||
    zodUtils.isNullableEnumDef(type._def)
  ) {
    const [values, required] = zodUtils.isEnumDef(type._def)
      ? [type._def.values, true]
      : [type._def.innerType._def.values, false]
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
    zodUtils.isArrayOfEnumsDef(type._def) ||
    zodUtils.isArrayOfEnumsAndLiteralUnionDef(type._def)
  ) {
    const [values, required] = zodUtils.isArrayOfEnumsDef(type._def)
      ? [type._def.type._def.values, true]
      : [type._def.options[0]._def.type._def.values, false]
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
