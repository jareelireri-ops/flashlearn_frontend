import { useRef, useState } from 'react'

const MAX_TILT = 10

function TiltWrapper({ children, className = "", onClick }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalize cursor offset from center to a -1 → 1 range
    const offsetX = (e.clientX - centerX) / (rect.width / 2)
    const offsetY = (e.clientY - centerY) / (rect.height / 2)

    setTilt({
      rotateY: offsetX * MAX_TILT,
      rotateX: -offsetY * MAX_TILT,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 150ms ease',
        transformStyle: 'preserve-3d'
      }}
      className={`transition-all ${className}`}
    >
      {children}
    </div>
  )
}

export default TiltWrapper
