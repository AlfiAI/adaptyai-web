
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAgentRepository } from '@/lib/dataAccess/factory';
import { AgentInfo } from '@/lib/dataAccess/types';
import { Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageContainer from '@/components/layout/PageContainer';
import AgentChat from '@/components/agents/AgentChat';
import { useToast } from '@/hooks/use-toast';

const AgentProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const agentRepository = getAgentRepository();
  
  const { 
    data: agent, 
    isLoading: isLoadingAgent, 
    error: agentError 
  } = useQuery({
    queryKey: ['agent', slug],
    queryFn: async () => {
      if (!slug) throw new Error("Agent slug is required");
      return await agentRepository.getBySlug(slug);
    },
    enabled: !!slug
  });

  const {
    data: features,
    isLoading: isLoadingFeatures
  } = useQuery({
    queryKey: ['agent-features', agent?.id],
    queryFn: async () => {
      if (!agent?.id) throw new Error("Agent ID is required");
      return await agentRepository.getAgentFeatures(agent.id);
    },
    enabled: !!agent?.id
  });

  const {
    data: faqs,
    isLoading: isLoadingFaqs
  } = useQuery({
    queryKey: ['agent-faqs', agent?.id],
    queryFn: async () => {
      if (!agent?.id) throw new Error("Agent ID is required");
      return await agentRepository.getAgentFaqs(agent.id);
    },
    enabled: !!agent?.id
  });

  const handleScheduleCall = () => {
    toast({
      title: "Scheduling a call",
      description: "Redirecting to scheduling page...",
    });
    window.location.href = "/schedule";
  };

  if (isLoadingAgent) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-16 w-16 animate-spin text-adapty-aqua" />
        </div>
      </PageContainer>
    );
  }

  if (agentError || !agent) {
    return (
      <PageContainer>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-red-500">Agent not found</h2>
          <p className="mt-2 text-gray-400">The requested agent does not exist or has been removed.</p>
          <Button className="mt-4" variant="outline" onClick={() => window.location.href = "/agents"}>
            Back to Agent Directory
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Set the page theme color based on the agent
  useEffect(() => {
    if (agent) {
      document.documentElement.style.setProperty('--agent-color', agent.themeColor);
      
      return () => {
        document.documentElement.style.removeProperty('--agent-color');
      };
    }
  }, [agent]);

  return (
    <PageContainer>
      {/* Hero Banner */}
      <section 
        className="py-16 px-4 rounded-2xl mb-12 relative overflow-hidden"
        style={{ 
          background: `radial-gradient(circle at 30% 10%, ${agent.themeColor}30 5%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${agent.themeColor}20 10%, transparent 50%)`,
          boxShadow: `0 0 80px ${agent.themeColor}10 inset`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4" style={{ color: agent.themeColor }}>
                {agent.name}
              </h1>
              <h2 className="text-2xl font-medium text-gray-200 mb-6">{agent.title}</h2>
              <p className="text-xl text-gray-300 mb-8">{agent.shortDescription}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {agent.capabilities.map((capability, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${agent.themeColor}20`, 
                      color: agent.themeColor
                    }}
                  >
                    {capability}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Button 
                  className="rounded-full" 
                  style={{ 
                    backgroundColor: agent.themeColor, 
                    color: 'black'
                  }}
                  onClick={handleScheduleCall}
                >
                  Schedule a Call
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full" 
                  style={{ 
                    borderColor: agent.themeColor,
                    color: agent.themeColor
                  }}
                  onClick={() => document.getElementById('agent-features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Capabilities
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div 
                className="h-56 w-56 sm:h-64 sm:w-64 rounded-full flex items-center justify-center text-8xl font-bold relative overflow-hidden border-2"
                style={{ 
                  backgroundColor: `${agent.themeColor}15`, 
                  borderColor: `${agent.themeColor}40`,
                  boxShadow: `0 0 40px ${agent.themeColor}40`
                }}
              >
                {agent.avatarUrl ? (
                  <img src={agent.avatarUrl} alt={agent.name} className="object-cover w-full h-full" />
                ) : (
                  <span style={{ color: agent.themeColor }}>{agent.name.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(to right, transparent, ${agent.themeColor}, transparent)` }}
        ></div>
      </section>

      {/* Agent Description */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">About {agent.name}</h2>
          <div className="space-y-4 text-lg text-gray-300">
            {agent.fullDescription.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16" id="agent-features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What {agent.name} Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatures ? (
              Array(3).fill(0).map((_, idx) => (
                <Card key={idx} className="bg-gray-800/50 border border-gray-700 animate-pulse h-64">
                  <CardHeader>
                    <div className="h-6 w-24 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-700 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : features && features.length > 0 ? (
              features.map((feature) => (
                <Card key={feature.id} className="bg-gray-800/50 border border-gray-700 hover:border-adapty-aqua/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor }}
                      >
                        {feature.icon || feature.title.charAt(0)}
                      </span>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              agent.capabilities.map((capability, idx) => (
                <Card key={idx} className="bg-gray-800/50 border border-gray-700 hover:border-adapty-aqua/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      {capability}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Live Demo Chat */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Talk to {agent.name}</h2>
          <div className="border border-gray-700 rounded-lg overflow-hidden" style={{ borderColor: `${agent.themeColor}30` }}>
            <AgentChat agent={agent} />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          {isLoadingFaqs ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-2/3 bg-gray-700 rounded"></div>
                    <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : faqs && faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-gray-700">
                  <AccordionTrigger className="text-left hover:text-adapty-aqua">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No FAQs available for this agent yet.</p>
              <p>Try asking a question in the chat above!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="my-16">
        <div 
          className="max-w-4xl mx-auto rounded-xl p-8 text-center"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${agent.themeColor}20 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${agent.themeColor}10`
          }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to work with {agent.name}?</h2>
          <p className="text-xl text-gray-300 mb-6">
            Schedule a call with our team to discuss how {agent.name} can help transform your business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="rounded-full" 
              style={{ 
                backgroundColor: agent.themeColor, 
                color: 'black'
              }}
              onClick={handleScheduleCall}
            >
              Schedule a Call
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full" 
              onClick={() => window.location.href = "/contact"}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default AgentProfile;
