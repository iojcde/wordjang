import type { NextPage } from 'next'
import WordItem from 'components/WordItem'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { User, Word, Wordjang } from '@prisma/client'
import Nav from 'components/Nav'
import WordEditor from 'components/WordEditor'
import useSWR from 'swr'
import { useSession, signIn } from 'next-auth/react'

const Wordjang: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const { id } = router.query

  const fetcher = (url: string) =>
    fetch(url).then((r) => {
      return r.json()
    })

  const { data: wordjang } = useSWR<{
    name: string
    user: User
    word: Word[]
  }>(session ? `/api/wordjang/${id}` : null, fetcher)

  const [word, setWord] = useState(``)
  const [example, setExample] = useState(``)
  const [definition, setDefinition] = useState(``)

  const [opened, setOpened] = useState(false)

  //word to edit
  const [editWord, setEditWord] = useState<Word>()

  const wordInputRef = useRef<HTMLInputElement>(null)

  const newWord = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { wordjangId: id, word, example, definition }
      const res = await fetch(`/api/word`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body),
      }).then((res) => res.json())
      wordInputRef.current?.focus()

      wordjang?.word.unshift({
        word,
        example,
        definition,
        id: res.id,
        wordjangId: id as string,
      })
      setWord(``)
      setExample(``)
      setDefinition(``)
    } catch (error) {
      console.error(error)
    }
  }

  if (!session) {
    return (
      <div>
        <Nav />

        <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 ">
          Please <button onClick={() => signIn()}>sign in</button>.
        </div>
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 ">
        <h1 className="text-4xl font-bold capitalize">
          {wordjang && wordjang.name}
        </h1>
        <h3 className="text-sm text-neutral-800 mt-2">
          {wordjang?.word.length}
          {` `}
          {wordjang?.word.length == 1 ? `word` : `words`}
        </h3>
        <form
          onSubmit={newWord}
          className="max-w-2xl border px-4 py-4 rounded-xl mt-6"
        >
          <h2 className="text-2xl font-bold">New</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <input
              ref={wordInputRef}
              autoFocus
              onChange={(e) => setWord(e.target.value)}
              placeholder="Word"
              className="px-2 outline-none border font-bold border-gray-300 focus:border-gray-500 rounded-md py-1"
              type="text"
              value={word}
            />

            <textarea
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Definition"
              className="px-2 outline-none border w-full resize-none border-gray-3`00 focus:border-gray-500 rounded-md py-1"
              value={definition}
            />

            <textarea
              onChange={(e) => setExample(e.target.value)}
              placeholder="Example"
              className="px-2 outline-none border w-full resize-none border-gray-300 focus:border-gray-500 rounded-md py-1"
              value={example}
            />

            <input
              disabled={!word || !definition}
              type="submit"
              value="Create"
              className="inline-flex mt-4 justify-center px-4 py-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            />
          </div>
        </form>
        <div className="mt-8">
          {wordjang &&
            wordjang.word.map((w) => (
              <WordItem
                key={w.id}
                word={w.word}
                onEdit={() => {
                  setEditWord(w)
                  setOpened(true)
                }}
                def={w.definition}
                example={w.example}
              />
            ))}
        </div>
        <WordEditor editWord={editWord} setOpen={setOpened} isOpen={opened} />
      </div>
    </div>
  )
}

export default Wordjang
