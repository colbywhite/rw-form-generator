import type { ReactElement } from 'react'

import type {
  ZodFirstPartyTypeKind,
  ZodStringCheck,
  ZodTypeAny,
} from 'zod/lib/types'

import { EmailField, FieldError, TextField } from '@redwoodjs/forms'

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

const AutoField = <T extends ZodTypeAny, LabelElement extends ReactElement>({
  type,
  name,
  label,
  className,
  additionalErrorClass,
  fieldErrorClassName,
}: {
  type: T
  name: string
  label?: LabelElement
  className?: string
  additionalErrorClass?: string
  fieldErrorClassName?: string
}) => {
  // TODO is there a better way to type this?
  const { typeName, checks } = type._def
  const InputComponent = getInputComponentFromZodType(
    typeName as ZodFirstPartyTypeKind,
    checks as ZodStringCheck[]
  )
  return (
    <div className="form-control">
      {label}
      <InputComponent
        name={name}
        className={className}
        errorClassName={
          className
            ? `${className} ${additionalErrorClass}`
            : additionalErrorClass
        }
      />
      <FieldError name={name} className={fieldErrorClassName} />
    </div>
  )
}

export default AutoField
