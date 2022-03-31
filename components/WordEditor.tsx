import { Dialog, Transition } from '@headlessui/react'
import { Word } from '@prisma/client'
import { useRouter } from 'next/router'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const WordEditor: React.FC<{
  editWord: Word | undefined
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ editWord, isOpen, setOpen }) => {
  const router = useRouter()

  const closeModal = () => setOpen(false)
  const [word, setWord] = useState(``)
  const [example, setExample] = useState(``)
  const [definition, setDefinition] = useState(``)
  const [replacing, setReplacing] = useState(false)

  useEffect(() => {
    if (editWord) {
      setWord(editWord?.word)

      setExample(editWord?.example)

      setDefinition(editWord?.definition)
    }

    setReplacing(false)
  }, [editWord])

  const onEditWord = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { id: editWord?.id, word, example, definition }
      await fetch(`/api/word`, {
        method: `PATCH`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body),
      }).then((res) => res.json())

      setReplacing(true)
      await router.replace(router.asPath)

      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {replacing ? (
                <LoadingSpinner />
              ) : (
                <form onSubmit={onEditWord}>
                  <Dialog.Title as="h2" className="text-2xl font-bold">
                    Edit Word
                  </Dialog.Title>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <input
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
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
export default WordEditor
