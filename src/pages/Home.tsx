
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

// Import section components
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import EthosSection from '@/components/sections/EthosSection';
import JoinMissionSection from '@/components/sections/JoinMissionSection';
import PartnerWithUsSection from '@/components/sections/PartnerWithUsSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-adapty-aqua to-adapty-purple bg-clip-text text-transparent">
                Where AI <br />
                <span className="glow-text">Meets Purpose.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
                We build adaptive, ethical AI systems that think for the future.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 px-8 py-6 text-lg rounded-2xl transition-all duration-300 shadow-[0_0_10px_rgba(0,255,247,0.3)] hover:shadow-[0_0_20px_rgba(0,255,247,0.6)]"
                  asChild
                >
                  <a href="#join-mission">
                    Join the Mission
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10 px-8 py-6 text-lg rounded-2xl transition-all duration-300"
                  asChild
                >
                  <a href="#partner-with-us">
                    Partner with Us
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-radial from-adapty-aqua/20 to-transparent rounded-full blur-2xl"></div>
                <img 
                  src="/lovable-uploads/52771ff6-9f17-4730-b5a2-2a88e3487edc.png" 
                  alt="Adapty AI Logo" 
                  className="w-3/4 max-w-md relative z-10"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Ethos Section */}
      <EthosSection />

      {/* Join Mission Section */}
      <JoinMissionSection />

      {/* Partner With Us Section */}
      <PartnerWithUsSection />

      {/* CTA Section */}
      <Section className="bg-gradient-radial">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="glow-text">Transform</span> Your Business?
          </h2>
          <p className="text-gray-300 mb-8">
            Let's discuss how Adapty AI can help you leverage cutting-edge artificial intelligence to solve complex problems and drive innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 px-8 py-6 text-lg"
              asChild
            >
              <Link to="/schedule">
                Schedule a Call
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10 px-8 py-6 text-lg"
              asChild
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Home;
