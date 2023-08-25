import type { ZodStringDef, ZodTypeAny, ZodTypeDef } from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'

import { EmailField, TextField } from '@redwoodjs/forms'

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
