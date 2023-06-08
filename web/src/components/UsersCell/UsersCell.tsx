import type { UsersQuery } from 'types/graphql'

import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query UsersQuery {
    users {
      id
      name
      email
    }
  }
`

export const Loading = () => <h2 className="text-2xl">Loading users ...</h2>

export const Empty = () => <h2 className="text-2xl">No users exist yet</h2>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="text-red-500">Error: {error?.message}</div>
)

export const Success = ({ users }: CellSuccessProps<UsersQuery>) => {
  return (
    <table className="table-pin-rows table-pin-cols table-zebra table-sm table max-h-full">
      <caption>
        <h2 className="mb-4 text-2xl">{users.length} existing users</h2>
      </caption>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ id, name, email }) => (
          <tr key={id}>
            <th>{id}</th>
            <td>{email}</td>
            <td>{name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
