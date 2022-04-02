import { Word } from '@prisma/client'
import Nav from 'components/Nav'
import TestForm from 'components/TestForm'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const Test = () => {
  const session = useSession()
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

  return (
    <>
      <Nav />
      <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 ">
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
      </div>
    </>
  )
}

export default Test
