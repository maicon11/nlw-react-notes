import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { Note } from './entities/note'

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {

    const notesFromLs = localStorage.getItem('nlw-notes')
    if(notesFromLs) {
      return JSON.parse(notesFromLs)
        .map((note: Note) => {
          return {
            ...note,
            date: new Date(note.date)
          }
        })
    }
    return []
  })

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }
  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  function onNoteCreated(content: string) {
    const newNote: Note = {
      id: Math.random(),
      date: new Date(),
      content
    }
    const newNotes = [newNote, ...notes]
    setNotes(newNotes)
    localStorage.setItem('nlw-notes', JSON.stringify(newNotes))
  }

  function onNoteDeleted(id: number) {
    const notesWithoutDeleted = notes.filter(note => note.id != id)
    setNotes(notesWithoutDeleted)
    localStorage.setItem('nlw-notes', JSON.stringify(notesWithoutDeleted))

  }

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt='nlw expert'/>
      <form className='w-full'>
        <input
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          type="text"
          placeholder='Busque as suas notas...'
          onChange={handleSearch}
          />
      </form>

      <div className='h-px bg-slate-700'></div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}
