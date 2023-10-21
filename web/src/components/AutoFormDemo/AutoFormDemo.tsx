import { useState } from 'react'

import { titleCase } from 'title-case'

import { FieldError, Submit } from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/toast'

import AutoForm from 'src/components/AutoForm/AutoForm'
import { DemoSchema } from 'src/schemas'

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
        className="mx-auto w-fit"
        fieldClassName="input-bordered input-secondary input w-full max-w-xs"
        fieldErrorClassName="input-bordered input-secondary input w-full max-w-xs input-error"
        onSubmit={submitEntity}
        schema={DemoSchema}
        Label={({ name, children }) => (
          <label className="label">
            <span className="label-text mr-4">{titleCase(name)}</span>
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
        overrides={{ password: 'password' }}
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
