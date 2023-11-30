import type {
  ZodArrayDef,
  ZodDateDef,
  ZodEnumDef,
  ZodNullableDef,
  ZodNumberDef,
  ZodOptionalDef,
  ZodStringCheck,
  ZodStringDef,
  ZodTypeDef,
  ZodUnionDef,
} from 'zod'
import {
  ZodDate,
  ZodEnum,
  ZodFirstPartyTypeKind,
  ZodNaN,
  ZodNumber,
  ZodOptional,
} from 'zod'

export function getDefType(def: ZodTypeDef): ZodFirstPartyTypeKind {
  // Every ZodTypeDef contains a typeName
  // but the zod types don't accurately reflect that, hence the casting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (def as any).typeName
}

/**
 *  z.number().optional()
 */
export function isOptionalNumberDef(
  def: ZodTypeDef
): def is ZodOptionalDef<ZodNumber> {
  return isOptionalDef(def) && def.innerType instanceof ZodNumber
}

/**
 *  z.number().or(z.nan())
 */
export function isNaNUnionDef(
  def: ZodTypeDef
): def is ZodUnionDef<[ZodNumber, ZodNaN]> {
  return (
    isUnionDef(def) &&
    (def.options[0] instanceof ZodNumber ||
      def.options[0] instanceof ZodOptional) &&
    def.options[1] instanceof ZodNaN
  )
}

export function isOptionalDef(def: ZodTypeDef): def is ZodOptionalDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodOptional
}

export function isUnionDef(def: ZodTypeDef): def is ZodUnionDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodUnion
}

export function isDateDef(def: ZodTypeDef): def is ZodDateDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodDate
}

export function isNumberDef(def: ZodTypeDef): def is ZodNumberDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodNumber
}

export function isEnumDef(def: ZodTypeDef): def is ZodEnumDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodEnum
}

export function isArrayDef(def: ZodTypeDef): def is ZodArrayDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodArray
}

export function isStringDef(def: ZodTypeDef): def is ZodStringDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodString
}

export function isNullableDef(def: ZodTypeDef): def is ZodNullableDef {
  return getDefType(def) === ZodFirstPartyTypeKind.ZodNullable
}

/**
 * z.date().nullable()
 */
export function isNullableDateDef(
  def: ZodTypeDef
): def is ZodNullableDef<ZodDate> {
  return isNullableDef(def) && def.innerType instanceof ZodDate
}

/**
 * z.enum(options).nullable()
 */
export function isNullableEnumDef<T extends [string, ...string[]]>(
  def: ZodTypeDef
): def is ZodNullableDef<ZodEnum<T>> {
  return isNullableDef(def) && def.innerType instanceof ZodEnum
}

/**
 * TODO: rethink this logic so it doesn't loop through everything on every call
 */
export function containsCheck(
  def: ZodStringDef,
  check: ZodStringCheck['kind']
) {
  return def.checks.find(({ kind }) => kind === check) !== undefined
}
