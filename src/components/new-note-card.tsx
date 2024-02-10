import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  let speechRecognition: SpeechRecognition | null = null
  
  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }
  
  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setContent(value)
    if(value == '') setShouldShowOnboarding(true)
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault()
    if(content == '') return
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota criada com sucesso!')
  }


  function handleStartRecording(e: FormEvent) {
    
    const isSpechRecognizeAPIAvailable = 'speechRecognition' in window || 'webkitSpeechRecognition' in window
    
    if(!isSpechRecognizeAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a api de gravação!')
      return
    }
    
    setIsRecording(true)
    setShouldShowOnboarding(false)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true


    speechRecognition.onresult = (e) => {
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      setContent(transcription)
    }

    speechRecognition.onerror = (e) => {
      console.log(e)
    }
    
    speechRecognition.start()
  }

  function handleEndRecording(e: FormEvent) {
    if(speechRecognition) speechRecognition.stop()

    setIsRecording(false)
  }

  return (
      <Dialog.Root>
        <Dialog.Trigger className='flex flex-col rounded-md bg-slate-700 p-5 text-left gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
          <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
          <p className='text-sm leading-6 text-slate-400'>
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>
        </Dialog.Trigger>
        <Dialog.Portal>
              <Dialog.Overlay className='inset-0 fixed bg-black/60' />
              <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[648px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                  <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                      <X className='size-5'/>
                  </Dialog.Close>
                  <form className='flex-1 flex flex-col'>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-medium text-slate-300'>
                          Adicionar nota
                        </span>
                        {shouldShowOnboarding ? (
                          <p className='text-sm leading-6 text-slate-400'>
                          Comece <button type='button' className='font-medium text-lime-400 hover:underline' onClick={handleStartRecording}>gravando uma nota</button> em audio ou se preferir utilize <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>apenas texto</button>.
                        </p>
                        ): (
                          <textarea
                          autoFocus
                          className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                          onChange={handleContentChange}
                          value={content}
                          />
                        )}
                    </div>

                    {isRecording ? (
                      <button
                      type='button'
                      onClick={handleEndRecording}
                      className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-small text-slate-300 outline-none font-medium hover:text-slate-100'>
                        <div className='size-3 rounded-full bg-red-500 animate-pulse'></div>
                        Gravando (clique para interromper)
                      </button>                      
                    ) : (
                      <button
                      type='button'
                      onClick={handleSaveNote}
                      className='w-full bg-lime-400 py-4 text-center text-small text-lime-950 outline-none font-medium hover:bg-lime-500'>Salvar nota</button>
                    )}
                  </form>
              </Dialog.Content>
          </Dialog.Portal>
      </Dialog.Root>
  )
}