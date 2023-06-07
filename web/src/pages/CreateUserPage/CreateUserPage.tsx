import type {
  CreateUserMutation,
  CreateUserMutationVariables,
} from 'types/graphql'

import {
  Form,
  FormError,
  Submit,
  SubmitHandler,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const CREATE_USER_EXAMPLE = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      email
    }
  }
`
type FormValues = { name: string; email: string }

const CreateUserPage = () => {
  const [create, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_EXAMPLE, {
    onCompleted: ({ createUser: { name, email } }) => {
      toast.success(`${name || email} user created.`, { icon: '✅' })
      formMethods.reset()
    },
  })
  const formMethods = useForm({ mode: 'onBlur' })
  const onSubmit: SubmitHandler<FormValues> = (data) =>
    create({ variables: { input: data } })

  return (
    <main className="p-2">
      <MetaTags title="Create a user" description="Create user form" />

      <section className="w-full text-center">
        <h1 className="mb-4 text-4xl">Create user form</h1>
        <p className="mb-8 text-xs italic">
          This is a demo form based on the <code>UserExample</code> model found
          in the standard Redwood template.
        </p>
        <Form
          className="mx-auto w-fit"
          onSubmit={onSubmit}
          error={error}
          formMethods={formMethods}
        >
          <FormError error={error} wrapperClassName="form-error" />
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <TextField
              name="email"
              className="input-bordered input-secondary input w-full max-w-xs"
            />
          </div>
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Name</span>
            </label>
            <TextField
              name="name"
              className="input-bordered input-secondary input w-full max-w-xs"
            />
          </div>
          <div className="form-control mt-4">
            <Submit disabled={loading} className="btn-primary btn">
              Create user
            </Submit>
          </div>
        </Form>
      </section>
      <section className="w-full text-center">
        <Toaster />
      </section>
    </main>
  )
}

export default CreateUserPage
