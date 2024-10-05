import { Fragment, useEffect, useState } from 'react'

export default function RevealText({ text = '', delay = 10 }) {
  const [index, setIndex] = useState(0) // State variable to keep track of the current index

  useEffect(() => {
    // Function to reveal letters one at a time
    const revealLetters = () => {
      if (index < text.length) {
        setIndex((prevIndex) => prevIndex + 1) // Increment the index
      } else {
        clearInterval(intervalId) // Clear interval when all letters are revealed
      }
    }

    const intervalId = setInterval(revealLetters, delay) // Set up interval

    // Cleanup on unmount
    return () => clearInterval(intervalId)
  }, [text, index, delay]) // Add index to dependencies

  return <Fragment>{text.substring(0, index)}</Fragment> // Render the revealed text using substring
}
