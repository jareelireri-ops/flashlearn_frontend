import { Sparkles } from 'lucide-react'

const MESSAGES = [
  ' Consistency beats intensity — even 5 cards a day are impactful ',
  ' FL',
  ' Cards pop up as notifications based on the difficulty you gave them ',
  ' FL ',
]

function MarqueeStrip() {
  const text = MESSAGES.join('     •     ')

  return (
    <div className="bg-red-50 border-b border-red-100 overflow-hidden whitespace-nowrap py-2">
      <div className="inline-flex animate-marquee gap-2 text-sm font-medium text-red-600 items-center">
        <Sparkles size={14} className="shrink-0" />
        <span>{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  )
}

export default MarqueeStrip