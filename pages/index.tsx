import type { NextPage } from 'next'
import useSWR from 'swr'
import Link from 'next/link'
import { Word } from '@prisma/client'
import { useSession, signIn } from 'next-auth/react'

const Home: NextPage = () => {
  const { data: session, status } = useSession()

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
      <h2 className="text-4xl font-bold">My Wordjangs</h2>
      {wordjangs ? (
        <div className="mt-4">
          {wordjangs?.map((wj) => (
            <div
              key={wj.name}
              className="rounded-xl shadow bg-white my-2 p-4 border"
            >
              <Link href={`/wordjang/${wj.id}`}>
                <a className="font-bold text-2xl capitalize">{wj.name}</a>
              </Link>
              <h3 className=" text-sm text-neutral-800 my-2">
                {wj._count.word}
                {` `}
                {wj._count.word == 1 ? `word` : `words`}
              </h3>
              <span className="text-sm text-neutral-700">
                {wj.updatedAt ? (
                  <>
                    Last updated at:{` `}
                    {new Date(wj.updatedAt).toLocaleString()}
                  </>
                ) : (
                  <>Created at: {new Date(wj.createdAt).toLocaleString()}</>
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>{wordjangs == undefined ? <>loading...</> : <>oops no wordjangs</>}</>
      )}
    </>
  )
}

export default Home
