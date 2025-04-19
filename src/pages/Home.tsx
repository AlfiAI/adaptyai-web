
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import Card from '@/components/ui/Card';

const Home = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Where AI <br />
                <span className="glow-text">Meets Purpose.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                We build adaptive, ethical AI systems that think for the future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/schedule">
                    Join the Mission
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10 px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/contact">
                    Partner with Us
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center animate-float">
              <img 
                src="/lovable-uploads/52771ff6-9f17-4730-b5a2-2a88e3487edc.png" 
                alt="Adapty AI Logo" 
                className="w-3/4 max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <Section id="about" className="bg-black/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="/lovable-uploads/6cd462eb-ca9c-4ea7-a2bf-6adf273252fa.png" 
              alt="L.E.X. AI Assistant" 
              className="w-full max-w-md mx-auto rounded-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About <span className="glow-text">Adapty AI</span>
            </h2>
            <p className="text-gray-300 mb-4">
              Founded on the principle that AI should be both powerful and ethical, Adapty AI is at the forefront of creating adaptive intelligence solutions that grow with your business.
            </p>
            <p className="text-gray-300 mb-6">
              Our team of AI researchers, engineers, and ethicists work together to build systems that not only understand your needs but anticipate them, all while maintaining the highest standards of data privacy and security.
            </p>
            <Button 
              variant="outline" 
              className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10"
              asChild
            >
              <Link to="/#services">
                Explore Our Services
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What <span className="glow-text">We Do</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our comprehensive suite of AI solutions is designed to transform how businesses operate and innovate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom AI Solutions</h3>
            <p className="text-gray-400">
              Tailored AI systems designed to address your specific business challenges and opportunities.
            </p>
          </Card>

          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-400">
              Advanced algorithms that learn from your data to make predictions and automate decision-making.
            </p>
          </Card>

          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Processing</h3>
            <p className="text-gray-400">
              AI systems that understand, interpret, and generate human language for seamless interaction.
            </p>
          </Card>

          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Consulting</h3>
            <p className="text-gray-400">
              Expert guidance on how to leverage AI technology to achieve your business objectives.
            </p>
          </Card>

          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Integration</h3>
            <p className="text-gray-400">
              Seamlessly incorporate AI capabilities into your existing systems and workflows.
            </p>
          </Card>

          <Card>
            <div className="text-adapty-aqua mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ethics & Compliance</h3>
            <p className="text-gray-400">
              Ensure your AI implementations adhere to ethical standards and regulatory requirements.
            </p>
          </Card>
        </div>
      </Section>

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
