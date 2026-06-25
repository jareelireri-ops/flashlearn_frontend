import Navbar from '../components/common/Navbar'
import Hero from '../components/landing-page/Hero'
import CallToAction from '../components/landing-page/CallToAction'
import Categories from '../components/landing-page/Categories'
import Features from '../components/landing-page/Features'
import FeaturedDecks from '../components/landing-page/FeaturedDecks'
import CallToAction2 from '../components/landing-page/CallToAction2'
import Footer from '../components/landing-page/Footer'

function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <CallToAction />
      <Categories />
      <Features />
      <FeaturedDecks />
      <CallToAction2 />
      <Footer />
    </div>
  )
}

export default Landing