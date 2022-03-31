import { MouseEventHandler } from 'react'

const WordItem: React.FC<{
  word: string
  def: string
  example: string
  onEdit: MouseEventHandler<HTMLButtonElement>
}> = ({ word, def, example, onEdit }) => {
  return (
    <div className="my-3 text-lg w-full border rounded-xl p-4">
      <div className="flex items-center">
        <h3 className="font-bold text-2xl">{word}</h3>

        <button className="w-8 h-8 ml-4 text-sm" onClick={onEdit}>
          Edit
        </button>
      </div>
      <p className="col-span-4 my-1">{def}</p>
      <p className="col-span-4 my-1 text-base italic">{example}</p>
    </div>
  )
}

export default WordItem