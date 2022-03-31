import Nav from 'components/Nav'
import { useState } from 'react'

const NewWordjang = () => {
  const [name, setName] = useState(``)

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

  return (
    <div>
      <Nav />

      <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 ">
        <h2 className="text-2xl font-medium leading-6 text-gray-900">
          New wordjang
        </h2>
        <div className="mt-2">
          <h3 className="text-gray-500">Choose a name for the new wordjang:</h3>
          <form onSubmit={newWordjang}>
            <input
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="px-2"
              type="text"
              value={name}
            />

            <input
              disabled={!name}
              type="submit"
              value="Create"
              className="inline-flex justify-center px-4 py-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewWordjang