import type { ComponentProps } from 'react'

import type { ZodRawShape } from 'zod'

import AutoField from 'src/components/AutoField/AutoField'

const AutoFieldSet = <T extends ZodRawShape>({
  shape,
  prefix,
  ...props
}: Omit<ComponentProps<typeof AutoField>, 'type' | 'name'> & {
  shape: T
  prefix: string
}) => {
  return (
    <fieldset>
      {Object.keys(shape).map((key) => (
        <AutoField
          {...props}
          key={key}
          type={shape[key]}
          name={`${prefix}.${key}`}
        />
      ))}
    </fieldset>
  )
}

export default AutoFieldSet
