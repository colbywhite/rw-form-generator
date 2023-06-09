import type { FC } from 'react'

import { titleCase } from 'title-case'
import type {
  CreateUserMutation,
  CreateUserMutationVariables,
} from 'types/graphql'

import { Submit } from '@redwoodjs/forms'
import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import AutoForm from 'src/components/AutoForm/AutoForm'
import UsersCell, { QUERY as UsersQuery } from 'src/components/UsersCell'
import { CreateUserSchema } from 'src/schemas'

const CREATE_USER_EXAMPLE = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`
const AutoFormPage = () => {
  const [create, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_EXAMPLE, {
    onCompleted: ({ createUser: { name, email } }) =>
      toast.success(`${name || email} user created.`, { icon: '✅' }),
    refetchQueries: [{ query: UsersQuery }],
  })
  const Label: FC<string> = (name) => (
    <label htmlFor={name} className="label">
      <span className="label-text">{titleCase(name)}</span>
    </label>
  )
  return (
    <main className="grid grid-cols-2 gap-8 p-2">
      <MetaTags title="Create a user" description="Create user form" />
      <header className="col-span-2 w-full text-center">
        <h1 className="mb-4 text-4xl">Users</h1>
        <p className="text-xs italic">
          This is a form auto-generated from the zod schema at{' '}
          <code>/web/src/schemas/CreateUser</code>.
        </p>
      </header>

      <section className="text-center">
        <h2 className="mb-4 text-2xl">Create user</h2>
        <AutoForm
          className="mx-auto w-fit"
          fieldClassName="input-bordered input-secondary input w-full max-w-xs"
          additionalFieldErrorClass="input-error"
          fieldWrapperClassName="form-control"
          fieldErrorClassName="my-1 rounded border border-error-content bg-error p-1 text-sm italic text-error-content"
          schema={CreateUserSchema}
          error={error}
          label={Label}
          onSubmit={(result) =>
            // TODO why does zod not pick up that email is required in the types?
            create({ variables: { input: result as Required<typeof result> } })
          }
        >
          <div className="form-control mt-4">
            <Submit disabled={loading} className="btn-primary btn">
              Create
            </Submit>
          </div>
        </AutoForm>
      </section>

      <section className="max-h-[60vh] overflow-auto text-center">
        <UsersCell />
      </section>

      <Toaster />
    </main>
  )
}

export default AutoFormPage
