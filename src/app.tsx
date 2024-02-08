import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
export function App() {

  const note = {
    date: new Date(),
    content: 'Hello World'
  }
  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={logo} alt='nlw expert'/>
      <form className='w-full'>
        <input
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          type="text"
          placeholder='Busque as suas notas...'
          />
      </form>

      <div className='h-px bg-slate-700'></div>

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard/>

        <NoteCard note={note} />
        <NoteCard note={note} />
      </div>
    </div>
  )
}
