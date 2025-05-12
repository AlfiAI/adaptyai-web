
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LexAssistant from "./components/chat/LexAssistant";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Loading placeholder
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="animate-pulse-glow h-16 w-16 rounded-full border-2 border-adapty-aqua flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-t-2 border-adapty-aqua border-opacity-50 rounded-full"></div>
    </div>
    <p className="mt-4 text-gray-400">Loading...</p>
  </div>
);

// Lazy load pages to improve performance
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Admin = lazy(() => import("./pages/Admin"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

// Configure Query Client with retry and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRoles={['admin']}>
                          <Admin />
                        </ProtectedRoute>
                      } />
                      <Route path="/podcast" element={<Podcast />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </div>
              <Footer />
              <LexAssistant />
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
