import { Dialog, Transition } from '@headlessui/react'
import { Word } from '@prisma/client'
import { useRouter } from 'next/router'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { mutate } from 'swr'
import LoadingSpinner from './LoadingSpinner'

const WordDeleter: React.FC<{
  deleteWord: Word | undefined
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ deleteWord, isOpen, setOpen }) => {
  const closeModal = () => setOpen(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const { id } = router.query

  const onDeleteWord = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { id: deleteWord?.id }

      setDeleting(true)
      await fetch(`/api/word`, {
        method: `DELETE`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body),
      }).then((res) => res.json())

      await mutate(`/api/wordjang/${id}`)
      setDeleting(false)
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
              {deleting ? (
                <LoadingSpinner />
              ) : (
                <form onSubmit={onDeleteWord}>
                  <Dialog.Title as="h2" className="text-2xl font-bold">
                    Delete {deleteWord?.word}?
                  </Dialog.Title>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <input
                      type="submit"
                      value="yeah"
                      className="inline-flex mt-4 justify-center px-4 py-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    />
                    <input
                      onClick={closeModal}
                      value="Cancel"
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
export default WordDeleter
