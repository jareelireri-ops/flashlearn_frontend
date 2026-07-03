
const PENCIL_FIELD = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='380' viewBox='0 0 380 380'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.045'%3E%3Cg transform='translate(30,40) rotate(24)'%3E%3Crect x='0' y='-6' width='96' height='12' rx='2'/%3E%3Crect x='96' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -18,0'/%3E%3C/g%3E%3Cg transform='translate(240,70) rotate(-18)'%3E%3Crect x='0' y='-6' width='80' height='12' rx='2'/%3E%3Crect x='80' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(70,200) rotate(68)'%3E%3Crect x='0' y='-6' width='88' height='12' rx='2'/%3E%3Crect x='88' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -16,0'/%3E%3C/g%3E%3Cg transform='translate(270,240) rotate(-52)'%3E%3Crect x='0' y='-6' width='92' height='12' rx='2'/%3E%3Crect x='92' y='-6' width='10' height='12'/%3E%3Cpolygon points='0,-6 0,6 -17,0'/%3E%3C/g%3E%3Cg transform='translate(150,310) rotate(10)'%3E%3Crect x='0' y='-6' width='76' height='12' rx='2'/%3E%3Crect x='76' y='-6' width='9' height='12'/%3E%3Cpolygon points='0,-6 0,6 -15,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

function Testimonials() {
  return (
    <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
      {/* Pencil texture, matches CallToAction */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: PENCIL_FIELD, backgroundRepeat: 'repeat', backgroundSize: '380px 380px' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Trusted by Learners Everywhere</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-8 rounded-2xl text-left border border-slate-700">
            <p className="text-slate-300 italic mb-6">"I used to spend hours re-reading notes. Thanks to FlashLearn's spaced repetition, my study time is cut in half and my grades have never been better!"</p>
            <div className="font-bold text-lg text-white">Isaac N.</div>
            <div className="text-sm text-red-400">Computer Science Student</div>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl text-left border border-slate-700">
            <p className="text-slate-300 italic mb-6">"The community library is a lifesaver. Being able to find and save decks created by others means I don't have to start from scratch."</p>
            <div className="font-bold text-lg text-white">Jareel I.</div>
            <div className="text-sm text-red-400">Youth Pastor</div>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl text-left border border-slate-700">
            <p className="text-slate-300 italic mb-6">"The website's interface is quite orderly and easy to use. It genuinely makes me want to log in every day to keep my streak going!"</p>
            <div className="font-bold text-lg text-white">Dennis K.</div>
            <div className="text-sm text-red-400">Technical Mentor</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials