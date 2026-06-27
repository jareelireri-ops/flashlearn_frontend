function Testimonials() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Trusted by Learners Everywhere</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-8 rounded-2xl text-left border border-slate-700">
            <p className="text-slate-300 italic mb-6">"I used to spend hours re-reading notes. Thanks to FlashLearn’s spaced repetition, my study time is cut in half and my grades have never been better!"</p>
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