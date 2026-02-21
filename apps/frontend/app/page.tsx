import { projects } from "@/lib/projects";
import { SpiralHero } from "@/components/hero/spiral-hero";
import NoiseOverlay from "@/components/ui/noise-overlay";
import IntroLoader from "@/components/ui/intro-loader";
import Header from "@/components/layout/header";
import AboutServices from "@/components/sections/about-services";
import SocialProof from "@/components/sections/social-proof";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import ConsultationForm from "@/components/sections/consultation-form";
import FinalCTA from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";

export default function HomePage() {
  return (
    <>
      <IntroLoader />
      <NoiseOverlay />
      <Header />
      <SpiralHero items={projects} />
      <AboutServices />
      <SocialProof />
      <Testimonials />
      <FAQ />
      <ConsultationForm />
      <FinalCTA />
      <Footer />
    </>
  );
}
