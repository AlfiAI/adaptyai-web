import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import AgentChat from '@/components/agents/AgentChat';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getAgentRepository } from '@/lib/dataAccess/factory';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentSBRepository';
import { AgentInfo, AgentFeature, AgentFaq } from '@/lib/dataAccess/types';
import { toast } from '@/hooks/use-toast';

const AgentProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Use custom SupabaseAgentRepository for specialized methods
  const agentRepo = new SupabaseAgentRepository();
  
  // Query to fetch agent details
  const { data: agent, isLoading: agentLoading, error: agentError } = useQuery({
    queryKey: ['agent', slug],
    queryFn: () => agentRepo.getBySlug(slug || ''),
    enabled: !!slug
  });
  
  // Query to fetch agent features
  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ['agent-features', agent?.id],
    queryFn: () => agentRepo.getAgentFeatures(agent?.id || ''),
    enabled: !!agent?.id
  });
  
  // Query to fetch agent FAQs
  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['agent-faqs', agent?.id],
    queryFn: () => agentRepo.getAgentFaqs(agent?.id || ''),
    enabled: !!agent?.id
  });

  if (agentError) {
    toast({
      title: "Error loading agent",
      description: "We couldn't load this agent. Please try again later.",
      variant: "destructive",
    });
    return (
      <PageContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Agent not found</h2>
          <p className="text-gray-400 mb-4">We couldn't find the agent you're looking for.</p>
          <Button variant="default" onClick={() => navigate('/agents')}>
            Return to Agent Directory
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (agentLoading || !agent) {
    return (
      <PageContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-adapty-aqua/30"></div>
          <div className="h-8 w-72 bg-adapty-aqua/30 rounded"></div>
          <div className="h-4 w-96 bg-adapty-aqua/20 rounded"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      {/* Hero banner with agent details */}
      <div 
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, ${agent.themeColor}30, transparent)`,
          borderBottom: `1px solid ${agent.themeColor}40`
        }}
      >
        <PageContainer>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-2/3 text-center md:text-left">
              <Button 
                variant="ghost" 
                className="mb-4 hover:bg-black/20"
                onClick={() => navigate('/agents')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Agents
              </Button>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: agent.themeColor }}>
                {agent.name}
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-gray-300 mb-6">
                {agent.title}
              </p>
              
              <p className="text-gray-400 max-w-2xl">
                {agent.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                {agent.capabilities.map((capability, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: `${agent.themeColor}20`,
                      color: agent.themeColor,
                      borderWidth: '1px',
                      borderColor: `${agent.themeColor}40`
                    }}
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/3 relative">
              <div 
                className="rounded-full w-48 h-48 md:w-64 md:h-64 flex items-center justify-center overflow-hidden border-2"
                style={{ 
                  borderColor: agent.themeColor,
                  boxShadow: `0 0 40px ${agent.themeColor}30`
                }}
              >
                {agent.avatarUrl ? (
                  <img 
                    src={agent.avatarUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-6xl font-bold"
                    style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
      
      {/* Main Content */}
      <PageContainer className="py-12">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Left Column - About & Features */}
          <div className="lg:w-7/12">
            {/* About Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">About</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg">{agent.fullDescription}</p>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Capabilities</h2>
              {featuresLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse p-6 rounded-lg bg-gray-800/50">
                      <div className="h-8 w-8 rounded-full bg-adapty-aqua/20 mb-4"></div>
                      <div className="h-6 w-32 bg-adapty-aqua/20 rounded mb-3"></div>
                      <div className="h-4 w-full bg-adapty-aqua/10 rounded mb-2"></div>
                      <div className="h-4 w-3/4 bg-adapty-aqua/10 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : features && features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature) => (
                    <div 
                      key={feature.id}
                      className="p-6 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: `${agent.themeColor}05`,
                        borderWidth: '1px',
                        borderColor: `${agent.themeColor}20`
                      }}
                    >
                      {feature.icon && (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${agent.themeColor}20` }}
                        >
                          <span 
                            className="text-xl"
                            style={{ color: agent.themeColor }}
                          >
                            {feature.icon}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-medium mb-2" style={{ color: agent.themeColor }}>
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agent.capabilities.map((capability, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: `${agent.themeColor}05`,
                        borderWidth: '1px',
                        borderColor: `${agent.themeColor}20`
                      }}
                    >
                      <h3 className="text-lg font-medium mb-2" style={{ color: agent.themeColor }}>
                        {capability}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* FAQs Section */}
            {!faqsLoading && faqs && faqs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-invert max-w-none">
                          <p>{faq.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
          
          {/* Right Column - Chat Demo */}
          <div className="lg:w-5/12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-8">Try Me Out</h2>
              <p className="text-gray-400 mb-6">
                Chat with {agent.name} to experience how this AI agent can assist you with {agent.shortDescription.toLowerCase()}
              </p>
              
              {isFullScreen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
                  <Button 
                    variant="outline" 
                    className="absolute top-4 right-4"
                    onClick={() => setIsFullScreen(false)}
                  >
                    Close
                  </Button>
                  <div className="w-full max-w-2xl">
                    <AgentChat agent={agent} isExpanded={true} />
                  </div>
                </div>
              ) : (
                <div>
                  <AgentChat 
                    agent={agent} 
                    onToggleExpand={() => setIsFullScreen(true)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    *Demo purposes only. In a real implementation, this would connect to a specialized workflow.
                  </p>
                </div>
              )}
            </div>
            
            {/* CTA Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Learn More</h2>
              <div 
                className="p-6 rounded-lg"
                style={{ 
                  backgroundColor: `${agent.themeColor}10`,
                  borderWidth: '1px',
                  borderColor: `${agent.themeColor}30`
                }}
              >
                <h3 className="text-xl font-medium mb-3">
                  Want to see what {agent.name} can do for your business?
                </h3>
                <p className="text-gray-400 mb-6">
                  Our team can demonstrate how {agent.name} can be customized to address your specific {agent.agentType} challenges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/schedule')}
                    style={{ 
                      backgroundColor: agent.themeColor,
                      color: '#000'
                    }}
                    className="hover:opacity-90"
                  >
                    Schedule a Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/contact')}
                    style={{ 
                      borderColor: agent.themeColor,
                      color: agent.themeColor
                    }}
                    className="hover:bg-black/20"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default AgentProfile;
