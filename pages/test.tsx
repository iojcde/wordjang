import { Word } from '@prisma/client'
import TestForm from 'components/TestForm'
import { useSession, signIn } from 'next-auth/react'

import { useState } from 'react'
import useSWR from 'swr'

const Test = () => {
  const { data: session, status } = useSession()
  // useEffect(() => {
  //   window.onbeforeunload = () => {
  //     return true
  //   }
  // })

  const [started, setStarted] = useState(false)

  const fetcher = (url: string) =>
    fetch(url).then((r) => {
      return r.json()
    })

  const { data: wordjangs } = useSWR<
    {
      id: string
      word: Word[]
      _count: {
        word: number
      }
      name: string
      createdAt: Date
      updatedAt: Date
    }[]
  >(session ? `/api/wordjang` : null, fetcher)

  const [selected, setSelected] = useState<boolean[]>(
    new Array(wordjangs?.length).fill(false),
  )

  let selectedWordjangs = wordjangs?.filter((_, i) => selected[i])

  const handleSelected = (position: number) => {
    const updatedCheckedState = selected.map((item, index) =>
      index === position ? !item : item,
    )

    setSelected(updatedCheckedState)
    selectedWordjangs = wordjangs?.filter((_, i) => selected[i])
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
      {started ? (
        <TestForm wordjangs={selectedWordjangs} />
      ) : (
        <>
          take a test lol
          <div className="mt-8">
            <h2 className="font-semibold text-2xl">
              Select wordjangs to take a test with:
            </h2>
            {wordjangs &&
              wordjangs.map((wj, i) => (
                <div className=" capitalize" key={wj.id}>
                  <input
                    className="outline-none"
                    type="checkbox"
                    onClick={() => handleSelected(i)}
                  ></input>
                  {` `}
                  {wj.name}
                </div>
              ))}
            <button
              onClick={() => setStarted(true)}
              className="inline-flex mt-4 justify-center px-4 py-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              lesgoo
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Test
