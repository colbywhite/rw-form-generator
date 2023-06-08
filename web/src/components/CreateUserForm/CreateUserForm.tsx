import { CreateUserMutation, CreateUserMutationVariables } from 'types/graphql'

import {
  Form,
  FormError,
  Submit,
  SubmitHandler,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY as UsersQuery } from 'src/components/UsersCell'

const CREATE_USER_EXAMPLE = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`
type FormValues = { name: string; email: string }

const CreateUserForm = () => {
  const [create, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_EXAMPLE, {
    onCompleted: ({ createUser: { name, email } }) => {
      toast.success(`${name || email} user created.`, { icon: '✅' })
      formMethods.reset()
    },
    refetchQueries: [{ query: UsersQuery }],
  })
  const formMethods = useForm({ mode: 'onBlur' })
  const onSubmit: SubmitHandler<FormValues> = (data) =>
    create({ variables: { input: data } })
  return (
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
          Create
        </Submit>
      </div>
    </Form>
  )
}

export default CreateUserForm
