

const PENCIL_FIELD = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='380' viewBox='0 0 380 380'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.045'%3E%3Cg transform='translate(30,40) rotate(24)'%3E%3Crect x='0' y='-6' width='96' height='12' rx='2'/%3E%3Crect x='96' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -18,0'/%3E%3C/g%3E%3Cg transform='translate(240,70) rotate(-18)'%3E%3Crect x='0' y='-6' width='80' height='12' rx='2'/%3E%3Crect x='80' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(70,200) rotate(68)'%3E%3Crect x='0' y='-6' width='88' height='12' rx='2'/%3E%3Crect x='88' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(270,240) rotate(-52)'%3E%3Crect x='0' y='-6' width='92' height='12' rx='2'/%3E%3Crect x='92' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -17,0'/%3E%3C/g%3E%3Cg transform='translate(150,310) rotate(10)'%3E%3Crect x='0' y='-6' width='76' height='12' rx='2'/%3E%3Crect x='76' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -15,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

function DashboardBanner({ user, streak, cardsDue }) {
  // Bulletproof check for user.name being undefined or empty, and default to "THERE" if so.
  //using there as a friendly greeting when the user's name is not available. 
  // This ensures that the greeting message is always complete and avoids any potential errors or awkward displays in the UI.
  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'THERE'

  return (
    <div className="bg-slate-900 rounded-2xl px-6 py-5 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: PENCIL_FIELD, backgroundRepeat: 'repeat', backgroundSize: '380px 380px' }}
      />

      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Good morning</p>
        <h1 className="text-xl font-bold mt-1 uppercase">
          {firstName} — YOU'RE ON A <span className="text-red-400">{streak}-DAY STREAK!</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {cardsDue} cards due today. Review them to stay on track.
        </p>
      </div>
    </div>
  )
}

export default DashboardBanner