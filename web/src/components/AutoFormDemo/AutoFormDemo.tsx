import { useState } from 'react'

import { AutoForm } from '@colbyw/autoform'
import { titleCase } from 'title-case'

import { FieldError, Submit } from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/toast'

import DataListInputField from 'src/components/DataListInputField/DataListInputField'
import { DemoSchema, ICE_CREAM_FLAVORS } from 'src/schemas'

function nameToLabel(name: string) {
  const rawLabel = name.includes('.')
    ? name.split('.').reverse().join(' ')
    : name
  return titleCase(rawLabel.split(/_/).join(' '))
}

export default function AutoFormDemo() {
  const [loading, setLoading] = useState(false)
  const submitEntity = <T,>(result: T) => {
    setLoading(true)
    console.log('Submitted entity', { result })
    toast
      .promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: 'Pretending to create an entity',
        success: 'Entity created; check the console.',
        error: 'Entity creation failed',
      })
      .finally(() => setLoading(false))
  }
  return (
    <>
      <h2 className="mb-4 text-2xl">Create entity</h2>
      <AutoForm
        aria-label="Create entity"
        autoComplete="off"
        className="mx-auto w-fit"
        fieldClassName="input-bordered input-secondary input w-full max-w-xs"
        fieldErrorClassName="input-bordered input-secondary input w-full max-w-xs input-error"
        onSubmit={submitEntity}
        schema={DemoSchema}
        Label={({ name, children }) => (
          <label className="label">
            <span className="label-text mr-2 w-32">{nameToLabel(name)}</span>
            {children}
          </label>
        )}
        FieldWrapper={({ children }) => (
          <div className="form-control">{children}</div>
        )}
        FieldError={(name) => (
          <FieldError
            name={name}
            className="my-1 rounded border border-error-content bg-error p-1 text-sm italic text-error-content"
          />
        )}
        overrides={{
          password: 'password',
          ice_cream_flavor: (props) => (
            <DataListInputField {...props} options={ICE_CREAM_FLAVORS} />
          ),
        }}
      >
        <div className="form-control mt-4">
          <Submit disabled={loading} className="btn-primary btn">
            Create
          </Submit>
        </div>
      </AutoForm>
    </>
  )
}
