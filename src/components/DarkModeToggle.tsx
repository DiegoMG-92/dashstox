import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}