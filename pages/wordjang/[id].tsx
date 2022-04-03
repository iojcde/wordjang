import type { NextPage } from 'next'
import WordItem from 'components/WordItem'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { User, Word, Wordjang } from '@prisma/client'
import TextareaAutosize from 'react-textarea-autosize'
import WordEditor from 'components/WordEditor'
import useSWR from 'swr'
import { useSession, signIn } from 'next-auth/react'
import WordDeleter from 'components/DeletePopup'
import Link from 'next/link'

const Wordjang: NextPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const { id } = router.query

  const fetcher = (url: string) =>
    fetch(url).then((r) => {
      return r.json()
    })

  const { data: wordjang } = useSWR<{
    name: string
    user: User
    word: Word[]
    status?: string
  }>(session ? `/api/wordjang/${id}` : null, fetcher)

  const [word, setWord] = useState(``)
  const [example, setExample] = useState(``)
  const [definition, setDefinition] = useState(``)

  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)

  //word to edit
  const [editWord, setEditWord] = useState<Word>()
  //word to delete
  const [deleteWord, setDeleteWord] = useState<Word>()

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

  if (wordjang?.status == `not found`) {
    return (
      <>
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="my-2">The Wordjang you requested could not be found.</p>
        <a className=" ">
          <Link href="/" passHref>
            &lt;- Back to home
          </Link>
        </a>
      </>
    )
  }

  return (
    <>
      <h1
        className={`text-4xl font-bold capitalize ${
          !wordjang && `rounded-lg bg-gray-100 w-32 h-10`
        }`}
      >
        {wordjang && wordjang.name}
      </h1>
      <h3
        className={`text-sm text-neutral-800 mt-2  ${
          !wordjang && `rounded-lg bg-gray-100 w-16 h-5`
        }`}
      >
        {wordjang && (
          <>
            {wordjang?.word.length}
            {` `}
            {wordjang?.word.length == 1 ? `word` : `words`}
          </>
        )}
      </h3>
      <form
        onSubmit={newWord}
        className="max-w-2xl border px-4 py-4 rounded-xl mt-6 shadow"
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

          <TextareaAutosize
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Definition"
            minRows={2}
            className="px-2 outline-none border w-full resize-none border-gray-3`00 focus:border-gray-500 rounded-md py-1"
            value={definition}
          />

          <TextareaAutosize
            onChange={(e) => setExample(e.target.value)}
            placeholder="Example"
            minRows={2}
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

      <div className="my-8">
        {wordjang ? (
          wordjang.word.map((w) => (
            <WordItem
              key={w.id}
              word={w.word}
              onEdit={() => {
                setEditWord(w)
                setEditOpened(true)
              }}
              onDelete={() => {
                setDeleteWord(w)
                setDeleteOpened(true)
              }}
              def={w.definition}
              example={w.example}
            />
          ))
        ) : (
          <>
            <div className="my-3 text-lg w-full border rounded-xl p-4 px-5">
              <div className="flex items-center">
                <h3 className="font-bold text-2xl rounded-lg animate-pulse bg-gray-100 w-24 h-8" />

                <button className="w-8 h-8 ml-4 text-xs text-gray-400">
                  Edit
                </button>
                <button className="w-8 h-8 ml-4 text-xs text-gray-400">
                  Delete
                </button>
              </div>
              <p className="col-span-4 my-2 text-base whitespace-pre-line w-64 h-6 bg-gray-100 rounded-lg animate-pulse"></p>

              <p className="col-span-4 mt-2 font-semibold whitespace-pre-line text-base italic bg-gray-100 rounded-lg animate-pulse w-64 h-6"></p>
            </div>
            <div className="my-3 text-lg w-full border rounded-xl p-4 px-5">
              <div className="flex items-center">
                <h3 className="font-bold text-2xl rounded-lg animate-pulse bg-gray-100 w-24 h-8" />

                <button className="w-8 h-8 ml-4 text-xs text-gray-400">
                  Edit
                </button>
                <button className="w-8 h-8 ml-4 text-xs text-gray-400">
                  Delete
                </button>
              </div>
              <p className="col-span-4 my-2 text-base whitespace-pre-line w-64 h-6 bg-gray-100 rounded-lg animate-pulse"></p>

              <p className="col-span-4 mt-2 font-semibold whitespace-pre-line text-base italic bg-gray-100 rounded-lg animate-pulse w-64 h-6"></p>
            </div>
          </>
        )}
      </div>
      <WordEditor
        editWord={editWord}
        setOpen={setEditOpened}
        isOpen={editOpened}
      />
      <WordDeleter
        deleteWord={deleteWord}
        setOpen={setDeleteOpened}
        isOpen={deleteOpened}
      />
    </>
  )
}

export default Wordjang
