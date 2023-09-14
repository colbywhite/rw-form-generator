import type { ZodObject, ZodRawShape } from 'zod'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const LOGIN_SHAPE: ZodRawShape = {
  email: z.string().email(),
  password: z.string(),
}

export function ZodSchemaVisualizer({
  schema,
  className,
}: {
  className?: string
  schema: ZodObject<any>
}) {
  return (
    <section className={className}>
      <h1>Given zod schema (in JSON form for the sake of readability)</h1>
      <pre>
        <code>{JSON.stringify(zodToJsonSchema(schema), null, 2)}</code>
      </pre>
    </section>
  )
}
