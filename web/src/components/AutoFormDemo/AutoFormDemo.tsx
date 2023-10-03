import { titleCase } from 'title-case'
import type {
  CreateUserMutation,
  CreateUserMutationVariables,
} from 'types/graphql'

import { FieldError, Submit } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AutoForm from 'src/components/AutoForm/AutoForm'
import { QUERY as UsersQuery } from 'src/components/UsersCell'
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

export default function AutoFormDemo() {
  const [create, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_EXAMPLE, {
    onCompleted: ({ createUser: { name, email } }) =>
      toast.success(`${name || email} user created.`, { icon: '✅' }),
    refetchQueries: [{ query: UsersQuery }],
  })
  return (
    <>
      <h2 className="mb-4 text-2xl">Create user</h2>
      <AutoForm
        aria-label="Create user"
        className="mx-auto w-fit"
        fieldClassName="input-bordered input-secondary input w-full max-w-xs"
        fieldErrorClassName="input-bordered input-secondary input w-full max-w-xs input-error"
        onSubmit={(result) =>
          // TODO why does zod not pick up that email is required in the types?
          create({ variables: { input: result as Required<typeof result> } })
        }
        schema={CreateUserSchema}
        error={error}
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
