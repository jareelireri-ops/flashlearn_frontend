function MarqueeStrip({ items, variant = 'default', icon = null, speed = 22 }) {
  const doubled = [...items, ...items]
  const isBrand = variant === 'brand'

  return (
    <div
      className={
        isBrand
          ? 'bg-red-600 py-3 overflow-hidden border-b border-gray-900'
          : 'bg-red-50 border-b border-red-100 overflow-hidden py-2'
      }
    >
      <div
        className={
          isBrand
            ? 'flex gap-8 sm:gap-12 whitespace-nowrap text-white'
            : 'inline-flex gap-2 text-sm font-medium text-red-600 items-center whitespace-nowrap'
        }
        style={
          isBrand
            ? {
                fontFamily: '"Bebas Neue", "Impact", sans-serif',
                fontSize: '15px',
                letterSpacing: '0.1em',
                animation: `fl-marquee ${speed}s linear infinite`,
              }
            : { animation: `fl-marquee ${speed}s linear infinite` }
        }
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12">
            {isBrand && <span className="text-red-300 text-sm">✦</span>}
            {!isBrand && icon && i === 0 && icon}
            <span>{isBrand ? item.toUpperCase() : item}</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes fl-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default MarqueeStrip