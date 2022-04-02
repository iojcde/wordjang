import { Word } from '@prisma/client'
import React, { useEffect, useState } from 'react'

const TestForm: React.FC<{
  wordjangs:
    | {
        id: string
        word: Word[]
        _count: {
          word: number
        }
        name: string
        createdAt: Date
        updatedAt: Date
      }[]
    | undefined
}> = ({ wordjangs }) => {
  const dictionary: Record<string, Word> = {}
  const [selectedId, setSelectedId] = useState(``)
  const [selected, setSelected] = useState<string[]>([])

  wordjangs?.map((wj) => {
    wj.word.map((w) => {
      dictionary[w.id] = w
    })
  })

  const keys = Object.keys(dictionary)
  const chooseQuestion = () => {
    const shuffled = [...keys].sort(() => 0.5 - Math.random())

    // Get sub-array of first n elements after shuffled
    setSelected(shuffled.slice(0, 5))
  }
  useEffect(() => {
    chooseQuestion()
  }, [setSelected])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedId(e.target.value)
  }

  const grade = () => {
    if (selectedId == dictionary[selected[0]].id) {
      alert(`correct`)

      chooseQuestion()
    } else {
      alert(`incorrect`)
    }
  }

  return (
    <div>
      {Object.keys(dictionary).length < 5 ? (
        <>oops too little words, pls add more words</>
      ) : (
        <>
          <div>
            Select the word with the meaning of:{` `}
            <span className="font-bold">
              {dictionary[selected[0]] && dictionary[selected[0]].definition}
            </span>
          </div>
          <div>
            {selected.map((id) => {
              const w = dictionary[id]

              return (
                <div key={w.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={w.id}
                    checked={selectedId == w.id}
                    onChange={handleChange}
                  />
                  {` `}
                  {w.word}
                </div>
              )
            })}
            <button onClick={() => grade()}>ok</button>
          </div>
        </>
      )}
    </div>
  )
}
export default TestForm
