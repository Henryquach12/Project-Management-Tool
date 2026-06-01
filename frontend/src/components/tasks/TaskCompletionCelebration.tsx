import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface Props {
  taskTitle: string
  onClose: () => void
}

const FLOWERS = ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼']

export default function TaskCompletionCelebration({ taskTitle, onClose }: Props) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'],
    })

    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="pointer-events-auto bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center gap-4 animate-bounce-in"
        style={{ animation: 'fadeScaleIn 0.4s ease-out' }}
      >
        <div className="text-5xl flex gap-2">
          {FLOWERS.slice(0, 5).map((f, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ animation: `floatUp 1.5s ease-out ${i * 0.15}s both` }}
            >
              {f}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Task Complete!</h2>
        <p className="text-gray-500 text-center max-w-xs">
          Great job finishing <span className="font-semibold text-gray-700">"{taskTitle}"</span>!
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-medium transition"
        >
          Keep going!
        </button>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(20px) rotate(-10deg); }
          60%  { opacity: 1; transform: translateY(-10px) rotate(5deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
