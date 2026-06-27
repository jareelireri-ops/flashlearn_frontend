import Navbar from '../components/ReusableComponents/Navbar'
import Hero from '../components/landing-page/Hero'
import CallToAction from '../components/landing-page/CallToAction'
import SpacedRepetition from '../components/landing-page/SpacedRepetition'
import Categories from '../components/landing-page/Categories'
import Features from '../components/landing-page/Features'
import FeaturedDecks from '../components/landing-page/FeaturedDecks'
import Testimonials from '../components/landing-page/Testimonials'
import CallToAction2 from '../components/landing-page/CallToAction2'
import Footer from '../components/landing-page/Footer'

function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <CallToAction />
      <SpacedRepetition />
      <Categories />
      <Features />
      <FeaturedDecks />
      <Testimonials />
      <CallToAction2 />
      <Footer />
    </div>
  )
}

export default Landing