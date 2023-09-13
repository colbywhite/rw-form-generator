import type { PropsWithChildren } from 'react'

import { titleCase } from 'title-case'

export function DefaultLabel({
  name,
  children,
}: PropsWithChildren<{ name: string }>) {
  return (
    <label>
      {titleCase(name)}
      {children}
    </label>
  )
}
