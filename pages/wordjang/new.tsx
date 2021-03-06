import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'

const NewWordjang = () => {
  const [name, setName] = useState(``)
  const { status } = useSession()

  const newWordjang = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { name }
      await fetch(`/api/wordjang`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body),
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (status == `unauthenticated`) {
    return (
      <h1 className="text-xl">
        Please{` `}
        <button className="font-semibold" onClick={() => signIn()}>
          sign in
        </button>
        {` `}
        to get started.
      </h1>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-medium leading-6 text-gray-900">
        New wordjang
      </h2>
      <div className="mt-2">
        <h3 className="text-gray-600">Choose a name for the new wordjang:</h3>
        <form onSubmit={newWordjang}>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
            className="px-2 outline-none border border-gray-300 focus:border-gray-500 rounded-md py-1 mr-2 mt-2"
          />

          <input
            disabled={!name}
            type="submit"
            value="Create"
            className="inline-flex justify-center px-4 py-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          />
        </form>
      </div>
    </>
  )
}

export default NewWordjang
