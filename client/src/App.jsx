import { useCallback, useState } from 'react'
import CharacterForm from './components/CharacterForm.jsx'
import ChatView from './components/ChatView.jsx'

export default function App() {
  const [character, setCharacter] = useState(null)

  const handleCharacterSubmit = useCallback((settings) => {
    setCharacter(settings)
  }, [])

  const handleBack = useCallback(() => {
    setCharacter(null)
  }, [])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-stone-50 via-rose-50/40 to-amber-50/50 text-stone-800">
      {!character ? (
        <CharacterForm onSubmit={handleCharacterSubmit} />
      ) : (
        <ChatView character={character} onBack={handleBack} />
      )}
    </div>
  )
}
