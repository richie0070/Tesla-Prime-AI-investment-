import React from 'react';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Features from '../components/Features';
import TeslaProducts from '../components/TeslaProducts';
import BotShowcase from '../components/BotShowcase';
import ShortTermPlans from '../components/ShortTermPlans';
import RealEstateSection from '../components/RealEstateSection';
import ResellerSection from '../components/ResellerSection';
import DashboardPreview from '../components/DashboardPreview';
import HowItWorks from '../components/HowItWorks';
import FeesSection from '../components/FeesSection';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="relative z-10">
      <Hero onStart={onStart} />
      <TrustStrip />
      <Features />
      <TeslaProducts />
      <BotShowcase onDeploy={onStart} />
      <ShortTermPlans />
      <RealEstateSection />
      <ResellerSection />
      <DashboardPreview />
      <HowItWorks />
      <FeesSection />
      <Testimonials />
      <FAQ />
      <FinalCTA onStart={onStart} />
    </div>
  );
};

export default Home;
