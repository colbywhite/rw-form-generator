import { titleCase } from 'title-case'
import type {
  ZodFirstPartyTypeKind,
  ZodStringCheck,
  ZodTypeAny,
} from 'zod/lib/types'

import { EmailField, FieldError, TextField } from '@redwoodjs/forms'

const INPUT_CLASSES = 'input-bordered input-secondary input w-full max-w-xs'
const INPUT_ERROR_CLASSES = INPUT_CLASSES + ' input-error'

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
  label,
}: {
  type: T
  name: string
  label?: string
}) => {
  // TODO is there a better way to type this?
  const { typeName, checks } = type._def
  const InputComponent = getInputComponentFromZodType(
    typeName as ZodFirstPartyTypeKind,
    checks as ZodStringCheck[]
  )
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text">{label || titleCase(name)}</span>
      </label>
      <InputComponent
        name={name}
        className={INPUT_CLASSES}
        errorClassName={INPUT_ERROR_CLASSES}
      />
      <FieldError
        name={name}
        className="my-1 rounded border border-error-content bg-error p-1 text-sm italic text-error-content"
      />
    </div>
  )
}

export default AutoField
